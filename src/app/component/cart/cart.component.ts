import { Component, OnInit } from '@angular/core';
import { AppResponse } from 'src/app/model/appResponse';
import { Cart } from 'src/app/model/cart';
import { Order } from 'src/app/model/order';
import { UserDetail } from 'src/app/model/user-details';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';
import { StorageService } from 'src/app/service/storage.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  error: string = '';
  cartItems: Cart[] = [];
  cartItemsCount: number = 0; 
  currentOrder: Order | undefined;
  isCartEmpty: boolean = true;
  userDetails: UserDetail[] = [];
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private storageService: StorageService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (response: any) => {
        this.cartItems = response.data;
        this.isCartEmpty = this.cartItems.length === 0;
        this.updateCartItemsCount(); 
      },
      error: (err) => {
        let message: string = err?.error?.error?.message;
        this.error = message.includes(',') ? message.split(',')[0] : message;
      },
    });
  }
  loadUserDetails() {
    const userId = this.storageService.getLoggedInUser().id;
  
    this.userService.getUserDetails().subscribe(
      (response: AppResponse) => {
        if (response && response.data && Array.isArray(response.data)) {
          const userWithAddress = response.data.find(user => user.addressList && user.addressList.length > 0);
  
          if (userWithAddress) {
            const firstAddress = userWithAddress.addressList[0].id;
            console.log(firstAddress);
  
            const loggedInUser = this.storageService.getLoggedInUser();
            if (loggedInUser) {
              const order = {
                userId: loggedInUser.id,
                addressId: firstAddress,
              };
  
              this.orderService.postOrder(order).subscribe({
                next: (response: any) => {
                  this.currentOrder = response.data;
                  this.cartItems = [];
                  this.isCartEmpty = true;
                },
                error: (err) => {
                  console.error('Checkout error:', err);
                },
              });
            }
          } else {
            console.error('No user with a valid addressList found in the API response.');
          }
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      (error) => {
        console.log('An error occurred:', error);
      }
    );
  }
  
  
  checkout() {
    console.log("got In");
    const loggedInUser = this.storageService.getLoggedInUser();
  
    if (loggedInUser) {
      this.loadUserDetails(); 
    } else {
      console.error('User not logged in.');
      console.log("nope");
    }
  }
  
  deleteCart(id: number | undefined) {
    if (id != undefined) {
      this.cartService.deleteCart(id).subscribe({
        next: (response: any) => {
          this.cartItems = response.data;
        },
        error: (err) => {
          console.error('An error occurred:', err);
        },
      });
    }
    this.updateCartItemsCount();
  }
  updateCartItemsCount() {
    this.cartItemsCount = this.cartItems.length; 
  }
}
