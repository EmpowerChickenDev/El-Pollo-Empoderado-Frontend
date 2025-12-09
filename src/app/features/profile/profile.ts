import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, UserDTO, UpdateUserRequest, ChangePasswordRequest } from '../../services/user.service';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

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

  userProfile: UserDTO | null = null;
  isLoading = true;
  error: string | null = null;
  private loadingTimeoutId: number | null = null;
  private readonly loadingTimeoutSeconds = 10;
  private lastError: unknown = null;

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
  }

  ngOnDestroy(): void {
    this.clearLoadingTimeout();
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
      next: (data) => {
        this.clearLoadingTimeout();
        this.userProfile = data;
        this.populateProfileForm(data);
        this.isLoading = false;
      },
      error: (err) => {
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
      next: (data) => {
        this.userProfile = data;
        this.isSavingProfile = false;
        this.isEditingProfile = false;
        this.successMessage = 'Perfil actualizado correctamente';

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        this.isSavingProfile = false;
        this.profileError = err.error?.message || 'No se pudo actualizar el perfil. Intenta nuevamente.';
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
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.userService.changePassword(passwordData).subscribe({
      next: (response) => {
        this.isSavingPassword = false;
        this.isEditingPassword = false;
        this.passwordForm.reset();
        this.successMessage = response.message || 'Contraseña actualizada correctamente';

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error al cambiar contraseña:', err);
        this.isSavingPassword = false;

        if (err.status === 400 || err.status === 401) {
          this.passwordError = err.error?.message || 'La contraseña actual es incorrecta';
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
}