// admin-layout.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent {
  activeSection = 'dashboard';
  menuExpanded = false;
  private router = inject(Router);

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  toggleMenu() {
    this.menuExpanded = !this.menuExpanded;
  }

  logout() {
    // Aquí puedes agregar la lógica para limpiar el token, etc.
    localStorage.removeItem('token');
    sessionStorage.clear();
    
    // Redirigir al login
    this.router.navigate(['/login']);
  }
}
