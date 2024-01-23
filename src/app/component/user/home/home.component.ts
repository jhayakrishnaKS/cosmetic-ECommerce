import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AppResponse } from 'src/app/model/appResponse';
import { AppUser } from 'src/app/model/appUser';
import { BeautyProducts } from 'src/app/model/beautyProducts';
import { Cart } from 'src/app/model/cart';
import { Category } from 'src/app/model/category';
import { CartService } from 'src/app/service/cart.service';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // Properties to store various data
  userId: number = 0; // User ID
  beautyProductId: number = 0; // ID of a beauty product
  carts: Cart[] = []; // Array to store cart items
  beautyProduct: string = ''; // String to store beauty product information
  cartItems: Cart[] = []; // Array to store cart items
  cartItemsCount: number = 0; // Count of items in the cart
  userProducts: BeautyProducts[] = []; // Array to store user-specific beauty products
  totalProducts: BeautyProducts[] = []; // Array to store all beauty products
  error: string = ''; // Error message
  flag: boolean = false; // Flag variable for loading more product

  // Array to store categories
  categories: Category[] = [];

  // Search string for filtering products
  search: string = '';

  minPrice: number = 0;
  maxPrice: number = 999;
  selectedCategoryId: number | null = null;
  filteredProducts: BeautyProducts[] = [];

  constructor(
    private productService: ProductService,
    private storageService: StorageService,
    private categoryService: CategoryService,
    private router: Router,
    private appComponent: AppComponent
  ) {}

  // View Child to access methods from the AppComponent
  @ViewChild(AppComponent) appComponentRef!: AppComponent;

  ngOnInit() {
    // Load user products and update cart items count
    this.loadUserProducts();
    this.loadCategories();
  }

  // Update the count of items in the cart
  updateCartItemsCount() {
    this.cartItemsCount = this.cartItems.length;

    // Update cart items count
    // console.log(this.cartItemsCount);
  }

  // Load user-specific products
  loadUserProducts() {
    this.productService.getUserProducts().subscribe(
      (response: AppResponse) => {
        if (response && response.data) {
          // Set user products array
          this.userProducts = response.data;
          this.totalProducts = response.data;
          // console.log(this.userProducts);
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

  // Add a product to the cart
  addToCart(id: number) {
    let user: AppUser = this.storageService.getLoggedInUser();

    // Check if the product already exists in the cart
    const existingCartIndex = this.cartItems.findIndex(
      (cart) => cart.beautyProducts && cart.beautyProducts.id === id
    );

    // If the product exists, increment the count
    if (existingCartIndex !== -1) {
      this.cartItems[existingCartIndex].count++; // Increment the count
    } else {
      // If the product does not exist, add it to the cart
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

      // Make API call to add the item to the cart
      this.productService.postCart(cart).subscribe({
        next: (response: AppResponse) => {
          // Update cart items array, count, and navigate to cart page
          this.cartItems.push(response.data);
          this.router.navigate(['/cart']);
          this.appComponent.updateCartItemsCount();
        },
        error: (err) => {
          console.error('Error adding item to cart:', err);
          let message: string = err?.error?.error?.message;
          this.error = message.includes(',') ? message.split(',')[0] : message;
        },
      });
    }
  }

  // Function to load more products
  loadMoreProducts(flag: boolean) {
    this.flag = true; // Set the flag to true
    this.loadUserProducts(); // Load more user products
  }

  // Function to filter products based on the search string
  filterArray() {
    this.userProducts = this.totalProducts.filter((e: any) => {
      return e.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
    });
  }

  // Sort products in ascending order (low to high)
  sortProductsLowToHigh() {
    this.userProducts.sort((a, b) => a.price! - b.price!);
  }

  // Sort products in descending order (high to low)
  sortProductsHighToLow() {
    this.userProducts.sort((a, b) => b.price! - a.price!);
  }

  // Sort products in ascending order alphabetically (A to Z)
  sortProductsAToZ() {
    this.userProducts.sort((a, b) => (a.title || '').localeCompare(b.title));
  }

  // Sort products in descending order alphabetically (Z to A)
  sortProductsZToA() {
    this.userProducts.sort((a, b) => (b.title || '').localeCompare(a.title));
  }

  filterByPriceRange() {
    // Filter products based on the selected price range
    this.userProducts = this.totalProducts.filter(
      (product) =>
        product.price &&
        product.price >= this.minPrice &&
        product.price <= this.maxPrice
    );
  }

  resetFilter() {
    // Reset min and max prices
    this.minPrice = 0;
    this.maxPrice = 999;

    // Call your existing method to load products with the updated filter
    this.loadMoreProducts(false);
  }

  applyFilter() {
    // Call the method to apply the filter
    this.filterByPriceRange();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: AppResponse) => {
        if (response && response.data) {
          this.categories = response.data;
          console.log(response.data);
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      error: (err) => {
        console.log('An error occurred:', err);
      },
      complete: () => console.log('Categories loaded successfully.'),
    });
  }

  applyCategoryFilter(categoryId: number | undefined) {
    if (categoryId === undefined) {
      console.error('Invalid categoryId:', categoryId);
      return;
    }

    this.productService.getProductCategory(categoryId).subscribe({
      next: (response: AppResponse) => {
        this.userProducts = response.data;
        console.log(response.data);
      },
      error: (err) => {
        console.log('An error occurred:', err);
      },
    });
  }
}
