import { Component, OnInit } from '@angular/core';
import { AppResponse } from 'src/app/model/appResponse';
import { Cart } from 'src/app/model/cart';
import { Order } from 'src/app/model/order';
import { UserDetail } from 'src/app/model/user-details';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';
import { StorageService } from 'src/app/service/storage.service';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
const MAX_PRODUCT_COUNT = 10; 
const MIN_PRODUCT_COUNT = 1; 
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  options: AnimationOptions = {
    path: "/assets/empty.json",
  };
  error: string = '';
  cartItems: Cart[] = [];
  cartItemsCount: number = 0;
  currentOrder: Order | undefined;
  isCartEmpty: boolean = true;
  userDetails: UserDetail[] = [];
  selectedCartId:number|null=null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private storageService: StorageService,
    private userService: UserService,
    private router: Router 
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

  checkout() {
    const loggedInUser = this.storageService.getLoggedInUser();

    if (loggedInUser) {
      this.loadUserDetails();
    } else {
      console.error('User not logged in.');
      console.log('nope');
    }
  }

  loadUserDetails() {
    const userId = this.storageService.getLoggedInUser().id;

    this.userService.getUserDetails().subscribe(
      (response: AppResponse) => {
        if (response && response.data && Array.isArray(response.data)) {
          const userWithAddress = response.data.find(
            (user) => user.addressList && user.addressList.length > 0
          );

          if (userWithAddress) {
            const firstAddress = userWithAddress.addressList[0].id;

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
                  this.router.navigate(['/orders']);
                },
                error: (err) => {
                  console.error('Checkout error:', err);
                },
              });
            }
          } else {

            console.error('No user with a valid addressList found.');
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

  incrementCount(cart: Cart) {
    if (cart.count < 3) {
      cart.count += 1;
      if (cart.beautyProducts.id != null) {
        this.cartService
          .updateCartCount(this.storageService.getLoggedInUser().id, cart.beautyProducts.id, cart.count)
          .subscribe(
            (response) => {
              console.log('Cart count updated successfully:', response);
            },
            (error) => {
              console.error('Error updating cart count:', error);
            },
            () => {
              console.log('Observable completed.');
            }
          );
      } else {
        alert('Minimum count reached. To remove the item, click "Remove" button.');
        console.error('beautyProductId is null or undefined');
      }
    }
  }
  
  decrementCount(cart: Cart) {
    if (cart.count > 1) {
      cart.count -= 1;
      if (cart.beautyProducts.id != null) {
        this.cartService
          .updateCartCount(this.storageService.getLoggedInUser().id, cart.beautyProducts.id, cart.count)
          .subscribe(
            (response) => {
              console.log('Cart count updated successfully:', response);
            },
            (error) => {
              console.error('Error updating cart count:', error);
            },
            () => {
              console.log('Observable completed.');
            }
          );
      } else {
        console.error('beautyProductId is null or undefined');
      }
    }
  }
  
  updateCartItemsCount() {
    this.cartItemsCount = this.cartItems.length;
  }
  onCancelDelete(){
    this.router.navigate(['/cart'],{ replaceUrl: true });
  }

  setSelectedCartId(cartId:number){
    this.selectedCartId=cartId;
  }
}
