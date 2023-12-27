import { Component, OnInit } from '@angular/core';
import { AppResponse } from 'src/app/model/appResponse';
import { Order } from 'src/app/model/order';
import { OrderStatus } from 'src/app/model/order-status';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './aorders.component.html',
  styleUrls: ['./aorders.component.css'],
})
export class AdminOrdersComponent implements OnInit {
  // Array to store user orders
  userOrders: Order[] = [];

  // Array to store order statuses
  orderStatus: OrderStatus[] = [];

  // Variable to store the selected order ID for updating status
  selectedOrderId: number | null = null;

  constructor(private orderService: OrderService) {}

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
      'Pending': 1,
      'Confirmed': 2,
      'Out for Delivery': 3,
      'Delivered': 4,
    };

    // Get the status of the order
    const orderStatus = order.orderStatus;

    // Get the status ID from the map
    const statusId = orderStatusMap[orderStatus];

    // Check if the status ID is undefined
    if (statusId === undefined) {
      console.error('Invalid order status. Cannot convert to a number.');
      return;
    }

    // Create an OrderStatus object for the API request
    const orderStatusData: OrderStatus = {
      orderId: order.id,
      statusId: statusId,
    };

    // Log information for debugging
    console.log(
      'Order status type (updateOrderStatus):',
      typeof order.orderStatus
    );
    console.log('Order status value (updateOrderStatus):', order.orderStatus);
    console.log('Status ID (updateOrderStatus):', statusId);
    console.log(orderStatusData);

    // Call the OrderService to update the order status
    this.orderService.putOrderStatus(orderStatusData).subscribe({
      next: (response: AppResponse) => {
        // Check if there is an error in the API response
        if (response && response.error) {
          console.error('Error in API response:', response.error);
        } else {
          console.log('OrderStatus updated');
          this.fetchUserOrders();
          this.fetchOrderStatus();
        }
      },
      error: (err) => {
        console.error('An error occurred:', err);
      },
    });
  }

  // Function to handle the edit order status button click
  onEditOrderStatus(order: Order) {
    console.log(order.orderStatus);
    // Call the updateOrderStatus function with the selected order
    this.updateOrderStatus(order);
  }
}
