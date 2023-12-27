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
  activeItem: string = 'Dashboard';
 

  error: string = '';
  cartItems: Cart[] = [];
  cartItemsCount: number = 0; 
  options: AnimationOptions = {
    path: '/assets/loading.json',
    rendererSettings: {
      className: 'lottie-loader',
    },
  };

  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  isUser: boolean = false;

  constructor(
    private authService: AuthService,
    public loaderService: LoaderService,
    private cartService: CartService,private route:ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });

    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.loadCart();
    this.updateCartItemsCount();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (response: any) => {
        this.cartItems = response.data;
        this.updateCartItemsCount(); 
      },
      error: (err) => {
        let message: string = err?.error?.error?.message;
        this.error = message.includes(',') ? message.split(',')[0] : message;
      },
    });
  }

  updateCartItemsCount() {
    this.cartItemsCount = this.cartItems.length; 
  }

  logout(): void {
    this.authService.logout();
  }
  isActive(route: string): boolean {
    return this.route.snapshot.url.join('/') === route;
  }
  
}
