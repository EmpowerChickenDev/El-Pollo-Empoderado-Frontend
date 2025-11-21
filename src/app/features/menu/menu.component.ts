import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarMenuComponent } from '../../shared/navbarMenu/navbarMenu';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterOutlet, NavbarMenuComponent],
  template: `
    <app-navbar-menu></app-navbar-menu>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class MenuComponent {}