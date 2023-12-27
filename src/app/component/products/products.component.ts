import { Component, OnInit } from '@angular/core';
import { AppResponse } from 'src/app/model/appResponse';
import { AppUser } from 'src/app/model/appUser';
import { BeautyProducts } from 'src/app/model/beautyProducts';
import { Cart } from 'src/app/model/cart';
import { ProductService } from 'src/app/service/product.service';
import { StorageService } from 'src/app/service/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  userId: number = 0;
  beautyProductId: number = 0;
  statusId: number = 0;
  carts: Cart[] = [];
  beautyProduct: string = '';
  search:string='';

  userProducts: BeautyProducts[] = [];
  totalProducts:BeautyProducts[]=[]
  error: string = '';

  constructor(private productService: ProductService,  private router: Router ,private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadUserProducts();
  }

  loadUserProducts() {
    this.productService.getUserProducts().subscribe(
      (response: AppResponse) => {
        if (response && response.data) {
          this.userProducts = response.data;
          this.totalProducts=response.data;
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
    console.log(id);
  
    const existingCartIndex = this.carts.findIndex((cart) => cart.beautyProducts.id === id);
  
    if (existingCartIndex !== -1) {
      this.carts[existingCartIndex].count++;
      this.ngOnInit();
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
          // photo: null,
        },
        count: 1, 
      };
  
      this.productService.postCart(cart).subscribe({
        next: (response: AppResponse) => {
          this.carts.push(response.data);
          this.router.navigate(['/cart']);
          this.ngOnInit();
          this.getCartCount(id);
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

  filterArray() {
    this.userProducts = this.totalProducts.filter((e: any) => {
      return (
        e.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      );
    });
  }
}
