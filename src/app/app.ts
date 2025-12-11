import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarCartComponent } from './shared/components/sidebar-cart/sidebar-cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarCartComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('frontend');
}
