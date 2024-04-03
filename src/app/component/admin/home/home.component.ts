import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { ProductService } from 'src/app/service/product.service';
import { OrderService } from 'src/app/service/order.service';
import { UserDetail } from 'src/app/model/user-details';
import { BeautyProducts } from 'src/app/model/beautyProducts';
import { Order } from 'src/app/model/order';
import { AppResponse } from 'src/app/model/appResponse';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-admin-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  options: AnimationOptions = {
    path: "/assets/empty.json",
  };
  // Variables to store total users, products, and orders
  totalUsers: number = 0;
  totalProducts: number = 0;


  // Array to store user orders
  userOrders: Order[] = [];

  
  constructor(
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Fetch total users and update the totalUsers variable
    this.userService.getUserDetails().subscribe({
      next: (response: any) => {
        let users: UserDetail[] = response.data;
        this.totalUsers = users.length;
      },
      error: (err) => {
        console.error('Error loading total users:', err);
      },
    });

    // Fetch total products and update the totalProducts variable
    this.loadTotalProducts();

    // Fetch user orders
    this.fetchUserOrders();
  }

  // Function to load total products from the ProductService
  loadTotalProducts() {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        let products: BeautyProducts[] = response.data;
        this.totalProducts = products.length;
      },
      error: (err) => {
        console.error('Error loading total products:', err);
      },
    });
  }

 

  // Function to fetch user orders from the OrderService
  fetchUserOrders() {
    this.orderService.getUserOrders().subscribe({
      next: (response: AppResponse) => {
        // Check if the response and data exist
        if (response && response.data) {
          // Set the userOrders array with the received data
          this.userOrders = response.data;
          console.log(this.userOrders);
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      error: (err) => {
        console.log('An error occurred while fetching user orders:', err);
      },
    });

  }
  getOrderStatusIconClass(orderStatus: string | number): string {
    const statusString = typeof orderStatus === 'number' ? orderStatus.toString() : orderStatus;
    switch (statusString) {
      case 'Pending':
        return 'fas fa-hourglass-start icon-pending';
      case 'Confirmed':
        return 'fas fa-check-circle icon-confirmed';
      case 'Out for Delivery':
        return 'fas fa-truck icon-out-for-delivery';
      case 'Delivered':
        return 'fas fa-check-double icon-delivered';
      default:
        return '';
    }
  }
}
