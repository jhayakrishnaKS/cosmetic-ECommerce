import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppResponse } from 'src/app/model/appResponse';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';
import { BeautyProducts } from 'src/app/model/beautyProducts';
import { Category } from 'src/app/model/category';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  // Arrays to store products, categories, and paged products
  products: BeautyProducts[] = [];
  categories: Category[] = [];
  pagedProducts: BeautyProducts[] = [];
  button:String="";

  // Variable to store the selected file for product photo
  file = '';

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 0;

  // Model for a product
  productModel: BeautyProducts = {
    id: 0,
    title: '',
    description: '',
    brand: '',
    price: null,
    categoryId: 1,
    photo: '',
  };

  // Constructor with injected services (ProductService, CategoryService)
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  // Lifecycle hook 
  ngOnInit(): void {
    // Load products, categories, and update paged products
    this.loadProducts();
    this.loadCategories();
    this.updatePagedProducts();
  }

  resetForm() {
    this.productModel = {
      id: 0,
      title: '',
      description: '',
      brand: '',
      price: null,
      categoryId: 1,
      photo: '',
    };
    this.button = "Add";
    console.log('After reset:', this.productModel.id);
  }
  
  
  // Function to load products from the ProductService
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response: AppResponse) => {
        if (response && response.data) {
          // Set products array and calculate total pages for pagination
          this.products = response.data;
          this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
          this.updatePagedProducts();
        } else {
          // Log an error if the API response format is invalid
          console.error('Invalid API response format:', response);
        }
      },
      error: (err) => {
        // Log an error if there is an issue with the API call
        console.log('An error occurred:', err);
      },
      complete: () => console.log('There are no more actions happening.'),
    });
  }

  // Function to load categories from the CategoryService
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: AppResponse) => {
        if (response && response.data) {
          // Set categories array
          this.categories = response.data;
        } else {
          // Log an error if the API response format is invalid
          console.error('Invalid API response format:', response);
        }
      },
      error: (err: any) => {
        // Log an error if there is an issue with the API call
        console.log('An error occurred:', err);
      },
      complete: () => console.log('There are no more actions happening.'),
    });
  }

  // Function to handle file change event for product photo
  onFileChange(event: any) {
    const fileInput = event.target;

    if (fileInput && fileInput.files.length > 0) {
      // Set the selected file
      this.file = fileInput.files[0];
      console.log('Selected file:', this.file);
    }
  }

  // Function to handle form submission
  onSubmit(productForm: NgForm) {
    console.log(productForm);
    if (productForm.valid) {
      // Create FormData object for handling file upload
      const formData = new FormData();

      formData.append('photo', this.file);
      formData.append('id', productForm.value.id);
      formData.append('categoryId', productForm.value.categoryId);
      formData.append('title', productForm.value.title);
      formData.append('description', productForm.value.description);
      formData.append('price', productForm.value.price);
      formData.append('brand', productForm.value.brand);

      // Check if it's a new product or an update
      if (this.productModel.id === 0) 
      {
        // Add a new product
        this.productService.postProducts(formData).subscribe({
          next: (response: any) => {
            if (response && response.data) {
              // Update products array, reset form, and update paged products
              this.products = response.data;
              this.productModel = {
                id: 0,
                title: '',
                description: '',
                brand: '',
                price: 0,
                categoryId: 1,
                photo: '',
              };
              productForm.resetForm();
              this.updatePagedProducts();
            }
          },
          error: (err) => {
            console.error('An error occurred:', err);
          },
        });
      } else {
        // Update an existing product
        // const formData = new FormData();
        // formData.append('title', productForm.value.title);
        // formData.append('description', productForm.value.description);
        // formData.append('price', productForm.value.price);
        // formData.append('brand', productForm.value.brand);
        // console.log(formData);
        this.productService.putProducts(formData).subscribe({
          next: (response: any) => {
            if (response && response.data) {
              this.products = response.data;
              this.categories = response.data;
              this.productModel = {
                id: 0,
                title: '',
                description: '',
                brand: '',
                price: 0,
                categoryId: 1,
                photo: '',
              };
              productForm.resetForm();
              this.updatePagedProducts();
            } else {
              // Log an error if the API response format is invalid
              console.error('Invalid API response format:', response);
            }
          },
          error: (err) => {
            console.error('An error occurred:', err);
          },
        });
      }
    }
  }

  // Function to handle product deletion
  onDelete(id: number | undefined) {
    if (id !== undefined) {
      // Delete a product
      this.productService.deleteProducts(id).subscribe({
        next: (response: any) => {
          if (response && response.data) {
            // Update products array and update paged products
            this.products = response.data;
            this.updatePagedProducts();
          }
        },
        error: (err) => {
          // Log an error if there is an issue with the API call
          console.error('An error occurred:', err);
        },
      });
    }
  }

  // Function to handle product editing
  onEdit(product: BeautyProducts) {
    // Find the edited product in the products array
    const editedProduct = this.products.find((p) => p.id === product.id);
    this.button="Edit";
    this.close();
  
    // If the product is found, update the product model
    if (editedProduct) {
      // Remove photo and category from the product model
      const { photo, categoryId, ...restProduct } = editedProduct;
      this.productModel = { ...restProduct };
    }
  }

  // Function to handle closing the product form
  close() {
    this.productModel = { ...this.productModel };
  }
 
  // Function to update the pagedProducts array based on pagination
  updatePagedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedProducts = this.products.slice(startIndex, endIndex);
  }

  // Function to change the current page based on offset
  changePage(offset: number): void {
    this.currentPage += offset;
    if (this.currentPage < 1) {
      this.currentPage = 1;
    } else if (this.currentPage > this.getTotalPages()) {
      this.currentPage = this.getTotalPages();
    }
    this.updatePagedProducts();
  }

  // Function to go to a specific page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePagedProducts();
    }
  }

  // Function to get an array of page numbers for pagination
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Function to get the total number of pages for pagination
  getTotalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }
}
