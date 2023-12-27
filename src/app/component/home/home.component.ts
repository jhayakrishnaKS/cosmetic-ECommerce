import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppResponse } from 'src/app/model/appResponse';
import { AppUser } from 'src/app/model/appUser';
import { BeautyProducts } from 'src/app/model/beautyProducts';
import { Cart } from 'src/app/model/cart';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls:['./home.component.css']
})
export class HomeComponent implements OnInit {
  userId: number = 0;
  beautyProductId: number = 0;
  statusId: number = 0;
  carts: Cart[] = [];
  beautyProduct: string = '';
  cartItems: Cart[] = [];
  cartItemsCount: number = 0;
  userProducts: BeautyProducts[] = [];
  error: string = '';

  constructor(
    private productService: ProductService,
    private storageService: StorageService,
    private cartService: CartService,
    private router: Router 
  ) {}

  ngOnInit() {
    this.loadUserProducts();
    this.updateCartItemsCount();
  }
  updateCartItemsCount() {
    this.cartItemsCount = this.cartItems.length;
    console.log(this.cartItemsCount);
  }
  
  loadUserProducts() {
    this.productService.getUserProducts().subscribe(
      (response: AppResponse) => {
        if (response && response.data) {
          this.userProducts = response.data;

          console.log(this.userProducts);
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      (error) => {
        console.error('An error occurred:', error);
        this.error = 'Error loading user products. Please try again.';
      }
    );
  }
  addToCart(id: number) {
    let user: AppUser = this.storageService.getLoggedInUser();
  
    const existingCartIndex = this.cartItems.findIndex(
      (cart) => cart.beautyProducts && cart.beautyProducts.id === id
    );
    
  
    if (existingCartIndex !== -1) {
      this.cartItems[existingCartIndex].count++;
      this.updateCartItemsCount();
      this.getCartCount(id);
    } else {
      const cart: Cart = {
        userId: user.id,
        beautyProductId: id,
        beautyProducts: {
          id: id,
          categoryId: 0,
          title: '',
          description: '',
          brand: '',
          price: 0,
        },
        count: 1,
      };
  
      this.productService.postCart(cart).subscribe({
        next: (response: AppResponse) => {
          this.cartItems.push(response.data);
          this.updateCartItemsCount();
          this.getCartCount(id);
          this.router.navigate(['/cart']);
        },
        error: (err) => {
          console.error('Error adding item to cart:', err);
          let message: string = err?.error?.error?.message;
          this.error = message.includes(',') ? message.split(',')[0] : message;
        },
      });
     
    }
    // window.location.reload();
  }
  

  getCartCount(id: number): number {
    const cartItem = this.carts.find((cart) => cart.beautyProducts?.id === id);
    return cartItem?.count ?? 0;
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
}
