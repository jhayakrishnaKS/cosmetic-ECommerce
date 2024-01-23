import { Component, OnInit } from '@angular/core';
import { AppResponse } from 'src/app/model/appResponse';
import { Order } from 'src/app/model/order';
import { OrderStatus } from 'src/app/model/order-status';
import { OrderService } from 'src/app/service/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './aorders.component.html',
  styleUrls: ['./aorders.component.css'],
})
export class AdminOrdersComponent implements OnInit {
  // Array to store user orders
  userOrders: Order[] = [];

  selectOrder: Order[] = [];

  // Array to store order statuses
  orderStatus: OrderStatus[] = [];

  // Variable to store the selected order ID for updating status
  selectedOrderId: number | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5; // Adjust the number of items per page as needed
  totalPages: number = 1;
  pages: number[] = [];
  pagedUserOrders: any[] = [];


  constructor(
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}

  // Lifecycle hook
  ngOnInit(): void {
    // Fetch user orders and order statuses when the component initializes
    this.fetchUserOrders();
    this.fetchOrderStatus();
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
          // Update pagination properties when userOrders change
          this.calculateTotalPages();
          this.setPage(1);
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      error: (err) => {
        console.log('An error occurred while fetching user orders:', err);
      },
    });
  }

  // Function to fetch order statuses from the OrderService
  fetchOrderStatus() {
    this.orderService.getAllOrderStatus().subscribe({
      next: (response: AppResponse) => {
        // Check if the response and data exist
        if (response && response.data) {
          // Set the orderStatus array with the received data
          this.orderStatus = response.data;
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      error: (err) => {
        console.log('An error occurred while fetching order status:', err);
      },
    });
  }

  // Function to update the order status
  updateOrderStatus(order: Order) {
    // Map of order statuses to status IDs
    const orderStatusMap: { [key: string]: number } = {
      Pending: 1,
      Confirmed: 2,
      'Out for Delivery': 3,
      Delivered: 4,
    };

    // Get the status of the order
    const orderStatus = order.orderStatus;

    // Get the status ID from the map
    const statusId = orderStatusMap[orderStatus];

    // Create an OrderStatus object for the API request
    const orderStatusData: OrderStatus = {
      orderId: order.id,
      statusId: statusId,
    };

    // Call the OrderService to update the order status
    this.orderService.putOrderStatus(orderStatusData).subscribe({
      next: (response: AppResponse) => {
        // Check if there is an error in the API response
        if (response && response.error) {
          console.error('Error in API response:', response.error);
        } else {
          console.log('OrderStatus updated');
          this.toastr.success('order status changed Successfully', '', {
            toastClass: 'custom-toast',
            // positionClass: 'toast-top-center',
          });
          // this.fetchUserOrders();
          // this.fetchOrderStatus();
        }
      },
      error: (err) => {
        console.error('An error occurred:', err);
      },
    });
  }
  getCountForProduct(order: any, product: any): number {
    // Get the title of the product
    const productTitle = product.title;

    // Find the product in the orderedBeautyProductList
    const foundProduct = order.orderedBeautyProductList.find(
      (p: any) => p.title === productTitle
    );

    // If the product is found, return its count, otherwise, return 0
    return foundProduct ? foundProduct.count : 0;
  }
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.userOrders.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedUserOrders = this.userOrders.slice(start, end);
  }

  prevPage() {
    this.setPage(this.currentPage - 1);
  }

  nextPage() {
    this.setPage(this.currentPage + 1);
  }
}
