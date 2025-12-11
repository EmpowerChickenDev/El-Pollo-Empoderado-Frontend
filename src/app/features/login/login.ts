import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  showPassword = false;
  errorMessage = '';
  isLoading = false;
  successMessage: string | null = null;

  ngOnInit(): void {
    // Prefill email and show message if redirected from registration
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
      if (params['registered']) {
        this.successMessage = 'Registro exitoso. Por favor inicia sesión.';
        // Clear message after a short timeout
        setTimeout(() => this.successMessage = null, 5000);
      }
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Por favor, ingresa un email válido';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.isLoading = false;
        
        // Redirigir según los roles (AuthResponse ahora tiene `roles: string[]`)
        const roles = Array.isArray(response.roles) ? response.roles : [];
        if (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin']);
        } else {
          // After login, take the user to their profile page
          this.router.navigate(['/profile']);
        }
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.isLoading = false;
        
        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'Email o contraseña incorrectos';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor';
        } else {
          this.errorMessage = error.error?.message || 'Error al iniciar sesión. Intenta nuevamente';
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}