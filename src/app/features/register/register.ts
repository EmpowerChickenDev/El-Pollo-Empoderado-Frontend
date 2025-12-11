import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  // Campos del formulario
  name = '';
  lastName = '';
  dni = '';
  // backend expects `address` (RegisterRequest)
  address = '';
  birthDate = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;
  acceptPrivacy = false;

  // Estados
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  isLoading = false;

  

  onSubmit(event: Event): void {
    event.preventDefault();
    
    this.errorMessage = '';

    // Validaciones
    if (!this.name || !this.lastName || !this.dni || !this.address ||
        !this.birthDate || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    if (!this.acceptTerms || !this.acceptPrivacy) {
      this.errorMessage = 'Debes aceptar los términos y condiciones';
      return;
    }

    if (this.dni.length !== 8) {
      this.errorMessage = 'El DNI debe tener 8 dígitos';
      return;
    }

    // phone not required by backend RegisterRequest

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Por favor, ingresa un email válido';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;

    // Preparar payload para debug rápido
    const debugPayload = {
      firstName: this.name,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      dni: this.dni,
      birthDate: this.birthDate,
      address: this.address
    };

    // Mostrar payload en consola para inspección rápida
    console.log('[RegisterComponent] Enviando payload de registro:', debugPayload);

    // Llamar al AuthService con los campos correctos
    this.authService.register(
      this.name,           // firstName
      this.lastName,       // lastName
      this.email,          // email
      this.password,       // password
      this.dni,            // dni
      this.birthDate,      // birthDate
      this.address         // address (matches backend RegisterRequest)
    ).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.isLoading = false;
        // Redirect user to login so they can authenticate explicitly
        this.router.navigate(['/login'], { queryParams: { registered: '1', email: this.email } });
      },
      error: (error) => {
        console.error('[RegisterComponent] Error en registro (obj completo):', error);
        console.error('[RegisterComponent] error.error:', error.error);
        this.isLoading = false;

        // Mostrar mensaje detallado si el backend devuelve un body con explicación
        const backendMessage = error.error && typeof error.error !== 'string'
          ? (error.error.message || JSON.stringify(error.error))
          : error.error;

        if (error.status === 400) {
          this.errorMessage = backendMessage || 'Datos inválidos. Revisa los campos e intenta nuevamente.';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor';
        } else {
          this.errorMessage = backendMessage || 'Error al crear la cuenta. Intenta nuevamente';
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}