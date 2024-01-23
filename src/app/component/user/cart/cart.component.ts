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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  // Lottie animation options
  options: AnimationOptions = {
    path: '/assets/empty.json',
  };

  // Error message
  error: string = '';

  // Cart items
  cartItems: Cart[] = [];

  // Cart items count
  cartItemsCount: number = 0;

  // Current order information
  currentOrder: Order | undefined;

  // Flag indicating whether the cart is empty
  isCartEmpty: boolean = true;

  // User details
  userDetails: UserDetail[] = [];

  // Selected cart item id for deletion confirmation
  selectedCartId: number | null = null;

  // Constructor with injected services
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private storageService: StorageService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  // Lifecycle hook: ngOnInit
  ngOnInit(): void {
    this.loadCart();
  }

  // Load user's cart items
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

  // Proceed to checkout
  checkout() {
    const loggedInUser = this.storageService.getLoggedInUser();

    if (loggedInUser) {
      this.loadUserOrder(loggedInUser.id);
    } else {
      console.error('User not logged in.');
    }
  }

  // Load user details for checkout
  loadUserOrder(userId: number) {
    // Call the getUserDetails method of UserService to fetch user details
    this.userService.getUserDetails().subscribe(
      (response: AppResponse) => {
        // Check if the API response contains data and it's an array
        if (response && Array.isArray(response.data)) {
          // Find the user with the provided userId
          const user = response.data.find((u) => u.id === userId);

          // Check if a user is found
          if (user && user.addressList && user.addressList.length > 0) {
            // Get the ID of the first address in the user's addressList
            const firstAddress = user.addressList[0].id;

            // Prepare the order object with user and address details
            const order = {
              userId: userId,
              addressId: firstAddress,
            };

            // Place the order by calling the postOrder method of OrderService
            this.orderService.postOrder(order).subscribe({
              next: (response: any) => {
                // Update currentOrder, clear cartItems, and set isCartEmpty to true
                this.currentOrder = response.data;
                this.cartItems = [];
                this.isCartEmpty = true;

                // Navigate to the order confirmation page
                this.router.navigate(['/order'], { replaceUrl: true });
              },
              error: (err) => {
                // Handle errors during the order placement
                console.error('Checkout error:', err);
              },
            });
          } else {
            // Log an error if no user or no address is found
            this.router.navigate(['/user-details'], { replaceUrl: true });
            this.toastr.success('Please Add Address to checkout', '', {
            toastClass: 'custom-toast',
            // positionClass: 'toast-top-center',
          });
            console.error(
              'No user or no address found for the provided userId.'
            );
          }
        } else {
          // Log an error if the API response format is invalid
          console.error('Invalid API response format:', response);
        }
      },
      // Handle errors in the HTTP request
      (error) => {
        console.log('An error occurred:', error);
      }
    );
  }

  // Delete cart item
  deleteCart(id: number | undefined) {
    if (id != undefined) {
      this.cartService.deleteCart(id).subscribe({
        next: (response: any) => {
          this.cartItems = response.data;
          this.toastr.success('cart deleted Successfully', '', {
            toastClass: 'custom-toast',
            // positionClass: 'toast-top-center',
          });
        },
        error: (err) => {
          console.error('An error occurred:', err);
        },
      });
    }
    this.updateCartItemsCount();
  }

  // Increment item count in the cart
  incrementCount(cart: Cart) {
    // Check if the count is less than the maximum allowed value (3 in this case)
    if (cart.count < 3) {
      // Increment the count by 1
      cart.count += 1;

      // Check if the beautyProducts ID is not null
      if (cart.beautyProducts.id != null) {
        // Call the updateCartCount method of CartService to update the count on the server
        this.cartService
          .updateCartCount(
            this.storageService.getLoggedInUser().id,
            cart.beautyProducts.id,
            cart.count
          )
          .subscribe(
            (response) => {
              // Log a success message if the cart count is updated successfully
              console.log('Cart count updated successfully:', response);
            },
            (error) => {
              // Log an error if there is an issue updating the cart count
              console.error('Error updating cart count:', error);
            }
          );
      } else {
        // Log an error if the beautyProducts ID is null or undefined
        console.error('beautyProductId is null or undefined');
      }
    }
  }

  // Decrement item count in the cart
  decrementCount(cart: Cart) {
    // Check if the count is greater than the minimum allowed value (1 in this case)
    if (cart.count > 1) {
      // Decrement the count by 1
      cart.count -= 1;

      // Check if the beautyProducts ID is not null
      if (cart.beautyProducts.id != null) {
        // Call the updateCartCount method of CartService to update the count on the server
        this.cartService
          .updateCartCount(
            this.storageService.getLoggedInUser().id,
            cart.beautyProducts.id,
            cart.count
          )
          .subscribe(
            (response) => {
              // Log a success message if the cart count is updated successfully
              console.log('Cart count updated successfully:', response);
            },
            (error) => {
              // Log an error if there is an issue updating the cart count
              console.error('Error updating cart count:', error);
            }
          );
      } else {
        // Log an error if the beautyProducts ID is null or undefined
        console.error('beautyProductId is null or undefined');
      }
    }
  }

  // Update cart items count
  updateCartItemsCount() {
    this.cartItemsCount = this.cartItems.length;
  }

  // Cancel cart item deletion
  onCancelDelete() {
    this.router.navigate(['/cart'], { replaceUrl: true });
  }

  // Set selected cart item id for deletion confirmation
  setSelectedCartId(cartId: number) {
    this.selectedCartId = cartId;
  }

  calculateTotalPrice(): number {
    let total = 0;

    for (const cartItem of this.cartItems) {
      total += (cartItem?.beautyProducts?.price || 0) * (cartItem?.count || 0);
    }

    return total;
  }
}
