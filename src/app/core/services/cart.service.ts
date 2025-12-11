import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItemsSignal = signal<CartItem[]>([]);
    private isSidebarOpenSignal = signal<boolean>(false);

    cartItems = computed(() => this.cartItemsSignal());
    isSidebarOpen = computed(() => this.isSidebarOpenSignal());

    total = computed(() => {
        return this.cartItemsSignal().reduce((acc, item) => acc + item.subtotal, 0);
    });

    cartCount = computed(() => {
        return this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0);
    });

    addItem(product: Product) {
        const currentItems = this.cartItemsSignal();
        const existingItemIndex = currentItems.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            // Item exists, increment quantity
            this.updateQuantity(product.id, currentItems[existingItemIndex].quantity + 1);
            // Do NOT open sidebar if adding existing item (as per requirements)
        } else {
            // New item, add to cart
            const newItem: CartItem = {
                ...product,
                quantity: 1,
                subtotal: product.precio
            };
            this.cartItemsSignal.set([...currentItems, newItem]);

            // Open sidebar for new items
            this.openSidebar();
        }
    }

    removeItem(productId: number) {
        const currentItems = this.cartItemsSignal();
        this.cartItemsSignal.set(currentItems.filter(item => item.id !== productId));
    }

    updateQuantity(productId: number, quantity: number) {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }

        this.cartItemsSignal.update(items =>
            items.map(item => {
                if (item.id === productId) {
                    return {
                        ...item,
                        quantity: quantity,
                        subtotal: item.precio * quantity
                    };
                }
                return item;
            })
        );
    }

    toggleSidebar() {
        this.isSidebarOpenSignal.update(val => !val);
    }

    openSidebar() {
        this.isSidebarOpenSignal.set(true);
    }

    closeSidebar() {
        this.isSidebarOpenSignal.set(false);
    }
}
