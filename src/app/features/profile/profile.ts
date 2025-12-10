import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, UserDTO, UpdateUserRequest, ChangePasswordRequest } from '../../services/user.service';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  userProfile: UserDTO | null = null;
  isLoading = true;
  error: string | null = null;
  private loadingTimeoutId: number | null = null;
  private readonly loadingTimeoutSeconds = 10;
  private lastError: unknown = null;
  private refreshSub: Subscription | null = null;

  // Estados para edición
  isEditingProfile = false;
  isEditingPassword = false;
  isSavingProfile = false;
  isSavingPassword = false;
  successMessage: string | null = null;
  profileError: string | null = null;
  passwordError: string | null = null;

  // Formularios
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  

  ngOnInit(): void {
    this.initForms();
    this.loadUserProfile();
    this.startRefreshTimer();
  }

  ngOnDestroy(): void {
    this.clearLoadingTimeout();
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
      this.refreshSub = null;
    }
  }

  /**
   * Inicializar formularios
   */
  initForms(): void {
    // Formulario de perfil
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });

    // Formulario de contraseña
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Validador personalizado para confirmar contraseña
   */
  passwordMatchValidator(group: FormGroup): Record<string, boolean> | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Cargar perfil del usuario
   */
  loadUserProfile(): void {
    this.isLoading = true;
    this.error = null;

    this.clearLoadingTimeout();
    this.loadingTimeoutId = window.setTimeout(() => {
      if (this.isLoading) {
        // Extraer mensaje de error de forma segura
        const maybeMessage = this.extractErrorMessage(this.lastError);

        this.error = maybeMessage
          ? `Error: ${maybeMessage}`
          : 'El servidor no responde. Intenta de nuevo más tarde.';
        this.isLoading = false;
      }
    }, this.loadingTimeoutSeconds * 1000);

    this.userService.getCurrentUserProfile().subscribe({
      next: (data: UserDTO) => {
        this.clearLoadingTimeout();
        // Prefer any locally stored updatedAt (from recent local actions) if it's newer
        const storageKey = `user_profile_updatedAt:${data.id ?? data.email ?? 'anon'}`;
        const localTs = localStorage.getItem(storageKey);
        if (localTs) {
          try {
            const localDate = new Date(localTs);
            const serverDate = new Date(data.updatedAt || data.createdAt || 0);
            if (!isNaN(localDate.getTime()) && localDate.getTime() > serverDate.getTime()) {
              (data as UserDTO).updatedAt = localTs;
            }
          } catch {
            // ignore parse errors
          }
        }

        this.userProfile = data;
        this.populateProfileForm(data);
        this.isLoading = false;
      },
      error: (err: unknown) => {
        this.lastError = err;
        console.debug('Error al cargar perfil:', err);
      }
    });
  }

  /**
   * Poblar formulario con datos del usuario
   */
  populateProfileForm(data: UserDTO): void {
    this.profileForm.patchValue({
      username: `${data.firstName} ${data.lastName}`,
      email: data.email
    });
  }
  /**
   * Activar modo edición de perfil
   */
  enableEditProfile(): void {
    this.isEditingProfile = true;
    this.profileError = null;
    this.successMessage = null;
  }

  /**
   * Cancelar edición de perfil
   */
  cancelEditProfile(): void {
    this.isEditingProfile = false;
    this.profileError = null;
    if (this.userProfile) {
      this.populateProfileForm(this.userProfile);
    }
  }

  /**
   * Guardar cambios del perfil
   */
  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileError = 'Por favor, completa todos los campos correctamente';
      return;
    }

    this.isSavingProfile = true;
    this.profileError = null;
    this.successMessage = null;

    // Separar el nombre completo en firstName y lastName
    const fullName = this.profileForm.value.username.trim();
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || nameParts[0];

    const updatedData: UpdateUserRequest = {
      firstName: firstName,
      lastName: lastName,
      email: this.profileForm.value.email
    };

    this.userService.updateProfile(updatedData).subscribe({
      next: (data: UserDTO) => {
        this.userProfile = data;
        this.isSavingProfile = false;
        this.isEditingProfile = false;
        this.successMessage = 'Perfil actualizado correctamente';

        // Persist an updatedAt locally so UI reflects the change immediately across navigation
        try {
          const nowIso = new Date().toISOString();
          (this.userProfile as UserDTO).updatedAt = nowIso;
          const key = `user_profile_updatedAt:${data.id ?? data.email ?? 'anon'}`;
          localStorage.setItem(key, nowIso);
        } catch {
          // noop
        }

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err: unknown) => {
        console.error('Error al actualizar perfil:', err);
        this.isSavingProfile = false;
        this.profileError = this.extractErrorMessage(err) || 'No se pudo actualizar el perfil. Intenta nuevamente.';
      }
    });
  }

  /**
   * Activar modo cambio de contraseña
   */
  enableChangePassword(): void {
    this.isEditingPassword = true;
    this.passwordError = null;
    this.successMessage = null;
    this.passwordForm.reset();
  }

  /**
   * Cancelar cambio de contraseña
   */
  cancelChangePassword(): void {
    this.isEditingPassword = false;
    this.passwordError = null;
    this.passwordForm.reset();
  }

  /**
   * Guardar nueva contraseña
   */
  savePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordError = 'Por favor, completa todos los campos correctamente';
      return;
    }

    if (this.passwordForm.errors?.['passwordMismatch']) {
      this.passwordError = 'Las contraseñas no coinciden';
      return;
    }

    this.isSavingPassword = true;
    this.passwordError = null;
    this.successMessage = null;

    const passwordData: ChangePasswordRequest = {
      oldPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.userService.changePassword(passwordData).subscribe({
      next: (response: { message?: string }) => {
        this.isSavingPassword = false;
        this.isEditingPassword = false;

        // Actualizar en memoria la marca de tiempo para que la UI muestre
        // 'Hace un momento' inmediatamente sin tener que esperar una recarga.
        if (this.userProfile) {
          const nowIso = new Date().toISOString();
          (this.userProfile as UserDTO).updatedAt = nowIso;
          try {
            this.cdr.detectChanges();
          } catch {
            // noop
          }
          // Persist locally so navigation away/back keeps the recent timestamp
          const key = `user_profile_updatedAt:${(this.userProfile as UserDTO).id ?? (this.userProfile as UserDTO).email ?? 'anon'}`;
          try {
            localStorage.setItem(key, nowIso);
          } catch {
            // ignore localStorage errors (e.g., storage disabled)
          }
        }

        this.passwordForm.reset();
        this.successMessage = response.message || 'Contraseña actualizada correctamente';

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err: unknown) => {
        console.error('Error al cambiar contraseña:', err);
        this.isSavingPassword = false;

        const status = (err as { status?: number })?.status;
        if (status === 400 || status === 401) {
          this.passwordError = this.extractErrorMessage(err) || 'La contraseña actual es incorrecta';
        } else {
          this.passwordError = 'No se pudo cambiar la contraseña. Intenta nuevamente.';
        }
      }
    });
  }

  /**
   * Limpiar timeout
   */
  private clearLoadingTimeout(): void {
    if (this.loadingTimeoutId) {
      clearTimeout(this.loadingTimeoutId);
      this.loadingTimeoutId = null;
    }
  }

  /**
   * Cerrar sesión desde el perfil
   */
  onLogout(): void {
    this.authService.logout();
    // authService.logout() ya redirige a /login, pero por seguridad
    // navegamos explícitamente a /login
    this.router.navigate(['/login']);
  }

  /**
   * Helpers para validación de formularios
   */
  get usernameInvalid(): boolean {
    const control = this.profileForm.get('username');
    return !!(control && control.invalid && control.touched);
  }

  get emailInvalid(): boolean {
    const control = this.profileForm.get('email');
    return !!(control && control.invalid && control.touched);
  }

  get currentPasswordInvalid(): boolean {
    const control = this.passwordForm.get('currentPassword');
    return !!(control && control.invalid && control.touched);
  }

  get newPasswordInvalid(): boolean {
    const control = this.passwordForm.get('newPassword');
    return !!(control && control.invalid && control.touched);
  }

  get confirmPasswordInvalid(): boolean {
    const control = this.passwordForm.get('confirmPassword');
    return !!(control && control.invalid && control.touched) ||
      !!(this.passwordForm.errors?.['passwordMismatch'] && control?.touched);
  }

  /**
   * Extrae un posible mensaje de error de un objeto desconocido de forma segura
   */
  private extractErrorMessage(err: unknown): string | null {
    if (typeof err === 'object' && err !== null) {
      const rec = err as Record<string, unknown>;
      if (typeof rec['message'] === 'string') {
        return rec['message'] as string;
      }
    }
    return null;
  }

  /**
   * Devuelve una cadena legible en español que indica cuánto tiempo ha pasado
   * desde la fecha proporcionada (iso string). Usa `updatedAt` si está disponible
   * en `userProfile`, si no, cae en `createdAt`.
   */
  getLastUpdateDisplay(): string {
    interface MaybeDates { updatedAt?: string; createdAt?: string }
    const dates = this.userProfile as unknown as MaybeDates | undefined;
    const iso = dates?.updatedAt || dates?.createdAt;
    if (!iso) {
      return 'Desconocida';
    }

    try {
      const date = new Date(iso);
      return this.timeAgo(date);
    } catch {
      return 'Desconocida';
    }
  }

  private timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 0) return 'ahora';

    // Si es muy reciente, mostramos 'Hace un momento' para mejor UX.
    if (seconds < 60) return 'Hace un momento';

    const intervals: [number, string, string][] = [
      [60, 'segundo', 'segundos'],
      [60 * 60, 'minuto', 'minutos'],
      [60 * 60 * 24, 'hora', 'horas'],
      [60 * 60 * 24 * 30, 'día', 'días'],
      [60 * 60 * 24 * 365, 'mes', 'meses']
    ];


    for (let i = 1; i < intervals.length; i++) {
      const [limit, singular, plural] = intervals[i];
      const previousLimit = intervals[i - 1][0];
      if (seconds < limit) {
        const value = Math.floor(seconds / previousLimit);
        const unit = value === 1 ? singular : plural;
        return `Hace ${value} ${unit}`;
      }
    }

    const years = Math.floor(seconds / (60 * 60 * 24 * 365));
    return `Hace ${years} ${years === 1 ? 'año' : 'años'}`;
  }

  /** Start a periodic timer to refresh the relative time text every 30 seconds. */
  private startRefreshTimer(): void {
    if (this.refreshSub) return;
    this.refreshSub = interval(30000).subscribe(() => {
      try {
        this.cdr.detectChanges();
      } catch {
        // noop
      }
    });
  }
}