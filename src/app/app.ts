import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { NavbarMenuComponent } from './shared/navbarMenu/navbarMenu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, NavbarMenuComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('frontend');

  private readonly router = inject(Router);

  // hideLayout(): boolean {
  //   // rutas donde NO se mostrará navbar ni footer
  //   const hiddenRoutes = ['/login', '/register'];
  //   return hiddenRoutes.includes(this.router.url);
  // }
}
