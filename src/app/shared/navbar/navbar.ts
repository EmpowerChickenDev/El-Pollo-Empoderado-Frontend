import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive, CommonModule],
    standalone: true,
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class Navbar {
    cartService = inject(CartService);

    openCart(event: Event) {
        event.preventDefault(); // Prevent navigation
        this.cartService.openSidebar();
    }
}