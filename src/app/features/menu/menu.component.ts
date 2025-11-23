import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarMenuComponent } from '../../shared/navbarMenu/navbarMenu';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterOutlet, NavbarMenuComponent],
  template: `
    <div class="menu-container">
      <app-navbar-menu></app-navbar-menu>
      <div class="menu-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .menu-container {
      margin-top: -20px;
    }

    app-navbar-menu {
      position: fixed;
      top: 78px;
      left: 0;
      right: 0;
      z-index: 999;
    }

    .menu-content {
      margin-top: 60px;
    }
  `]
})
export class MenuComponent {}