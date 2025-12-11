import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
    selector: 'app-sidebar-cart',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar-cart.component.html',
    styleUrls: ['./sidebar-cart.component.css']
})
export class SidebarCartComponent {
    cartService = inject(CartService);

    closeSidebar() {
        this.cartService.closeSidebar();
    }

    increaseQuantity(itemId: number, currentQuantity: number) {
        this.cartService.updateQuantity(itemId, currentQuantity + 1);
    }

    decreaseQuantity(itemId: number, currentQuantity: number) {
        this.cartService.updateQuantity(itemId, currentQuantity - 1);
    }

    removeItem(itemId: number) {
        this.cartService.removeItem(itemId);
    }
}
