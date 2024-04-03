import { Component, OnInit } from '@angular/core';
import { AppResponse } from 'src/app/model/appResponse';
import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order.service';
import { UserService } from 'src/app/service/user.service';
import { StorageService } from 'src/app/service/storage.service';
import { UserDetail } from 'src/app/model/user-details';
import { AppUser } from 'src/app/model/appUser';
import { AnimationOptions } from 'ngx-lottie';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  // Animation options for the order component
  options: AnimationOptions = {
    path: '/assets/empty.json',
  };

  // Error message to display in case of API call failure
  error: string = '';

  // Array to store all order items
  orderItems: Order[] = [];

  // Array to store user details
  userDetails: UserDetail[] = [];

  // Array to store paged order items for pagination
  pagedOrderItems: Order[] = [];

  // Current page number for pagination
  currentPage = 1;

  // Items per page for pagination
  itemsPerPage = 1;

  // Total number of pages for pagination
  totalPages = 0;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    // Call loadUserDetails here to fetch user details
    this.loadUserDetails();

    // Fetch orders from the OrderService
    this.orderService.getOrders().subscribe(
      (response: AppResponse) => {
        if (response && response.data) {
          this.orderItems = response.data;

          // Calculate total pages for pagination
          this.totalPages = Math.ceil(
            this.orderItems.length / this.itemsPerPage
          );

          // Update pagedOrderItems based on the current page
          this.updatePagedOrderItems();
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      (error) => {
        console.log('An error occurred:', error);
      }
    );
  }

  // Function to update pagedOrderItems based on currentPage
  updatePagedOrderItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedOrderItems = this.orderItems.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  // Function to handle "Next" button click
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedOrderItems();
    }
  }

  // Function to handle "Previous" button click
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedOrderItems();
    }
  }

  // Load user details function
  loadUserDetails() {
    const userId = this.storageService.getLoggedInUser().id;

    this.userService.getUsersAddress().subscribe(
      (response: AppResponse) => {
        if (response && response.data) {
          this.userDetails = Array.isArray(response.data)
            ? response.data
            : [response.data];
          console.log(this.userDetails);
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      (error) => {
        console.log('An error occurred:', error);
      }
    );
  }

  getOrderStatusColor(orderStatus: string | number): string {
    // Convert to string if it's a number
    const statusString = typeof orderStatus === 'number' ? orderStatus.toString() : orderStatus;
  
    switch (statusString) {
      case 'Pending':
        return 'yellow';
      case 'Confirmed':
        return 'green';
      case 'Out for Delivery':
        return 'pink';
      case 'Delivered':
        return 'red';
      default:
        return 'gray';
    }
  }
  
  
  getOrderStatusProgress(orderStatus: string | number): number {
    const statusString = typeof orderStatus === 'number' ? orderStatus.toString() : orderStatus;
    switch (statusString) {
      
      case 'Pending':
        return 25;
      case 'Confirmed':
        return 50;
      case 'Out for Delivery':
        return 75;
      case 'Delivered':
        return 100;
      default:
        return 0;
    }
  }
  

  // Assuming orderStatus is of type 'string'
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
