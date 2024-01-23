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
  // User ID, Beauty Product ID, and Status ID variables
  userId: number = 0;
  beautyProductId: number = 0;
  statusId: number = 0;

  // Array to store cart items
  carts: Cart[] = [];

  // Beauty product search query
  beautyProduct: string = '';

  // Search string for filtering products
  search: string = '';

  // Arrays to store user products and total products
  userProducts: BeautyProducts[] = [];
  totalProducts: BeautyProducts[] = [];


  // Error message to display in case of API call failure
  error: string = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    // Load user products when the component initializes
    this.loadUserProducts();
  
  }

  // Function to load user products from the ProductService
  loadUserProducts() {
    this.productService.getUserProducts().subscribe(
      (response: AppResponse) => {
        if (response && response.data) {
          this.userProducts = response.data;
          this.totalProducts = response.data;
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

  // Function to add a product to the cart
  addToCart(id: number) {
    // Get the logged-in user from storage
    let user: AppUser = this.storageService.getLoggedInUser();
    console.log(id);

    // Check if the product is already in the cart
    const existingCartIndex = this.carts.findIndex(
      (cart) => cart.beautyProducts.id === id
    );

    if (existingCartIndex !== -1) {
      // Increment the count if the product is already in the cart
      this.carts[existingCartIndex].count++;
      this.ngOnInit(); // Reload the component
      this.getCartCount(id);
    } else {
      // Create a new cart item if the product is not in the cart
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
        },
        count: 1,
      };

      // Post the new cart item to the server
      this.productService.postCart(cart).subscribe({
        next: (response: AppResponse) => {
          // Update the carts array, navigate to the cart page, reload the component, and get the cart count
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

  // Function to get the count of a product in the cart
  getCartCount(id: number): number {
    const cartItem = this.carts.find(
      (cart) => cart.beautyProducts?.id === id
    );
    return cartItem?.count ?? 0;
  }

  // Function to filter products based on the search query
  filterArray() {
    this.userProducts = this.totalProducts.filter((e: any) => {
      return e.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
    });
  }
}
