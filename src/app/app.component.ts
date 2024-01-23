import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { AnimationOptions } from 'ngx-lottie';
import { LoaderService } from './service/loader.service';
import { Cart } from './model/cart';
import { CartService } from './service/cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // Active item in the navigation
  activeItem: string = 'Dashboard';

  // Error message
  error: string = '';

  // Cart related properties
  cartItems: Cart[] = [];
  cartItemsCount: number = 0;

  // Animation options for loader
  options: AnimationOptions = {
    path: '/assets/loading.json',
    rendererSettings: {
      className: 'lottie-loader',
    },
  };

  // User role flags
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  isUser: boolean = false;

  constructor(
    private authService: AuthService,
    public loaderService: LoaderService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Subscribe to isAdmin observable
    this.authService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });

    // Subscribe to isLoggedIn observable
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.cartItemsCount

    // Load user's cart and update cart count
    // this.loadCart();
    // this.updateCartItemsCount();
  }

  // Load user's cart
  loadCart() {
    this.cartService.getCart().subscribe({
      next: (response: any) => {
        this.cartItems = response.data;
        this.updateCartItemsCount();
      },
      error: (err) => {
        let message: string = err?.error?.error?.message;
        // Extract the first part of the error message
        this.error = message.includes(',') ? message.split(',')[0] : message;
      },
    });
  }

  // Update cart items count
  updateCartItemsCount() {
    // this.loadCart();
    this.cartItemsCount = this.cartItems.length;
  }

  // Logout the user
  logout(): void {
    this.authService.logout();
  }

  // Check if a route is currently active
  isActive(route: string): boolean {
    return this.route.snapshot.url.join('/') === route;
  }


}
