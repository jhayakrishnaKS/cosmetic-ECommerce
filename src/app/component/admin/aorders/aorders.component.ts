import { HttpErrorResponse } from '@angular/common/http';
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
  userOrders: Order[] = [];
  orderStatus: OrderStatus[] = [];
  selectedOrderId: number | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchUserOrders();
    this.fetchOrderStatus();
  }

  fetchUserOrders() {
    this.orderService.getUserOrders().subscribe({
      next: (response: AppResponse) => {
        if (response && response.data) {
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

  fetchOrderStatus() {
    this.orderService.getAllOrderStatus().subscribe({
      next: (response: AppResponse) => {
        if (response && response.data) {
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

  updateOrderStatus(order: Order) {
    const orderStatusMap: { [key: string]: number } = {
      'Pending': 1,
      'Confirmed': 2,
      'Out for Delivery': 3,
      'Delivered': 4,
    };

    const orderStatus = order.orderStatus;
    const statusId = orderStatusMap[orderStatus];

    if (statusId === undefined) {
      console.error('Invalid order status. Cannot convert to a number.');
      return;
    }

    const orderStatusData: OrderStatus = {
      orderId: order.id,
      statusId: statusId,
    };

    console.log(
      'Order status type (updateOrderStatus):',
      typeof order.orderStatus
    );
    console.log('Order status value (updateOrderStatus):', order.orderStatus);
    console.log('Status ID (updateOrderStatus):', statusId);
    console.log(orderStatusData);

    this.orderService.putOrderStatus(orderStatusData).subscribe({
      next: (response: AppResponse) => {
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

  onEditOrderStatus(order: Order) {
    console.log(order.orderStatus);
    this.updateOrderStatus(order);
  }
}
