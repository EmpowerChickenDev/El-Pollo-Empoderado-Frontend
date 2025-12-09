import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  isAuthenticated = false;
  username = '';
  isDropdownOpen = false;

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;

      if (isAuth) {
        this.userService.getCurrentUserProfile().subscribe({
          next: (user) => {
            this.username = user.firstName; // Usar firstName en lugar de username
          },
          error: () => {
            this.username = this.authService.getCurrentUserEmail()?.split('@')[0] || 'Usuario';
          }
        });
      } else {
        this.username = '';
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.isDropdownOpen = false;
    }
  }

  onLogout(event: Event): void {
    event.preventDefault();
    this.closeDropdown();
    this.authService.logout();
  }
}