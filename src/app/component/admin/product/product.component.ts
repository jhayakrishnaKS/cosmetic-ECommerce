import { HttpHeaders } from '@angular/common/http';
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
  products: BeautyProducts[] = [];
  categories: Category[] = [];
  file = '';
  productModel: BeautyProducts = {
    id: 0,
    title: '',
    description: '',
    brand: '',
    price: 0,
    categoryId: 1,
    photo: '',
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response: AppResponse) => {
        if (response && response.data) {
          this.products = response.data;
          this.categories = response.data;
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      error: (err) => {
        console.log('An error occurred:', err);
      },
      complete: () => console.log('There are no more actions happening.'),
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: AppResponse) => {
        if (response && response.data) {
          this.categories = response.data;
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      error: (err: any) => {
        console.log('An error occurred:', err);
      },
      complete: () => console.log('There are no more actions happening.'),
    });
  }

  onFileChange(event: any) {
    const fileInput = event.target;

    if (fileInput && fileInput.files.length > 0) {
      this.file = fileInput.files[0];

      console.log('Selected file:', this.file);
    }
  }

  onSubmit(productForm: NgForm) {
    if (productForm.valid) {
      const formData = new FormData();
      formData.append('photo', this.file);
      formData.append('categoryId', productForm.value.categoryId);
      formData.append('title', productForm.value.title);
      formData.append('description', productForm.value.description);
      formData.append('price', productForm.value.price);
      formData.append('brand', productForm.value.brand);
      console.log(formData);
      console.log(productForm);
      
      

      if (this.productModel.id === 0) {
        this.productService.postProducts(formData).subscribe({
          next: (response: AppResponse) => {
            if (response && response.data) {
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
            }
          },
          error: (err) => {
            console.error('An error occurred:', err);
          },
          complete: () => console.log(this.products),
        });
      } else {
        // Update the existing product
        this.productService.putProducts(this.productModel).subscribe({
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
            } else {
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

  onDelete(id: number | undefined) {
    console.log(id);
    if (id !== undefined) {
      this.productService.deleteProducts(id).subscribe({
        next: (response: any) => {
          if (response && response.data) {
            this.products = response.data;
          }
        },
        error: (err) => {
          console.error('An error occurred:', err);
        },
      });
    }
  }

  onEdit(product: BeautyProducts) {
    const editedProduct = this.products.find((p) => p.id === product.id);

    if (editedProduct) {
      this.productModel = { ...editedProduct };
      console.log(this.productModel);
    }
  }

  close() {
    this.productModel = { ...this.productModel };
  }
}
