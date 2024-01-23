import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppResponse } from 'src/app/model/appResponse';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/service/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  templateUrl: './acategory.component.html',
  styleUrls: ['./acategory.component.css'],
})
export class AdminCategoryComponent implements OnInit {
  // Initial category model with default values
  INITIAL_CATEGORY: Category = { id: 0, title: '' };

  // Array to store categories
  categories: Category[] = [];

  // Current category model for form binding
  categoryModel: Category = this.INITIAL_CATEGORY;

  // Variable to store the category name for user input
  categoryName: string = '';

  selectedCategoryId: number | null = null;

  // Constructor with injected CategoryService
  constructor(private categoryService: CategoryService, private toastr:ToastrService,   private router: Router) {}

  // Lifecycle hook 
  ngOnInit(): void {
    // Load categories when the component initializes
    this.loadCategories();
  }
  resetForm() {
    this.INITIAL_CATEGORY = {
      id: 0,
      title: ''
    };
  }
  

  // Function to load categories from the CategoryService
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: AppResponse) => {
        // Check if the response and data exist
        if (response && response.data) {
          // Set the categories array with the received data
          this.categories = response.data;
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

  // Function to handle form submission (add or update category)
  onSubmit(form: any) {
    if (this.categoryModel.id === 0) {
      // If the category ID is 0, it's a new category (add operation)
      this.categoryService
        .postCategories({ title: this.categoryModel.title })
        .subscribe({
          next: (response: any) => {
            // Update the categories array with the new data
            this.categories = response.data;
            // Reset the categoryModel and form after successful addition
            this.categoryModel = this.INITIAL_CATEGORY;
            form.resetForm();
          },
          error: (err) => {
            // Log an error if there is an issue with the API call
            console.log(err?.error?.error?.message);
          },
        });
    } else {
      // If the category ID is not 0, it's an existing category (update operation)
      this.categoryService.putCategory(this.categoryModel).subscribe({
        next: (response: any) => {
          // Update the categories array with the new data
          this.categories = response.data;
          // Reset the categoryModel after successful update
          this.categoryModel = this.INITIAL_CATEGORY;
          form.resetForm();
        },
        error: (err) => {
          // Log an error if there is an issue with the API call
          console.log(err?.error?.error?.message);
        },
      });
    }
  }

  // Function to handle category deletion
  onDelete(id: number | undefined) {
    if (id !== undefined) {
      // If the category ID is defined, call the deleteCategory function
      this.categoryService.deleteCategory(id).subscribe({
        next: (response: any) => {
          // Update the categories array with the new data after deletion
          this.categories = response.data;
          this.toastr.success('category deleted Successfully', '', {
            toastClass: 'custom-toast',
            // positionClass: 'toast-top-center',
          });
          
        },
        error: (err) => {
          // Log an error if there is an issue with the API call
          console.error('An error occurred:', err);
        },
      });
    }
  }

  // Function to handle category editing (populate the form for editing)
  onEdit(category: Category) {
    // Set the categoryModel with the selected category for editing
    this.categoryModel = { ...category };
    console.log(this.categoryModel);
  }

  // Function to close the category form (reset the categoryModel)
  close() {
    this.categoryModel = { ...this.INITIAL_CATEGORY };
  }
  // Cancel category item deletion
  onCancelDelete() {
    this.router.navigate(['/admin/category'], { replaceUrl: true });
  }
  setSelectedCategoryId(categoryId:number){
    this.selectedCategoryId=categoryId;
    
  }
}
