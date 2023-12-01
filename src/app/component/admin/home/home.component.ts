import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { ProductService } from 'src/app/service/product.service';
import { OrderService } from 'src/app/service/order.service';
import { UserDetail } from 'src/app/model/user-details';
import { BeautyProducts } from 'src/app/model/beautyProducts';
import { Order } from 'src/app/model/order';
import { AppResponse } from 'src/app/model/appResponse';

@Component({
  selector: 'app-admin-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  totalUsers: number = 0;
  totalProducts: number = 0;
  totalOrders: number = 0;
  userOrders: Order[] = [];

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.userService.getUserDetails().subscribe({
      next: (response:any) => {
        let users:UserDetail[]=response.data;
        this.totalUsers = users.length;
      },
      error: (err) => {
        console.error('Error loading total users:', err);
      },
    });
    // this.loadTotalUsers();
    this.loadTotalProducts();
    this.loadTotalOrders();
    this.fetchUserOrders();
  }

 

  loadTotalProducts() {
    this.productService.getProducts().subscribe({
      next:(response:any)=>{
        let product:BeautyProducts[]=response.data;
        this.totalProducts=product.length;
      },
      error: (err) => {
        console.error('Error loading total users:', err);
      },
    })
  }

  loadTotalOrders() {
    this.orderService.getAllOrderStatus().subscribe({
      next: (response:any) => {
        let order:Order[]=response.data;
        this.totalOrders = order.length-2;
        console.log(order.length);
        
      },
      error: (err) => {
        console.error('Error loading total orders:', err);
      },
    });
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
}
