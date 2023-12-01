import { Component, OnInit } from '@angular/core';
import { AppResponse } from 'src/app/model/appResponse';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './acategory.component.html',
  styleUrls: ['./acategory.component.css'],
})
export class AdminCategoryComponent implements OnInit {
  INITIAL_CATEGORY: Category = { id: 0, title: '' };

  categories: Category[] = [];
  categoryModel: Category = this.INITIAL_CATEGORY;
  categoryName: string = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
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
      error: (err) => {
        console.log('An error occurred:', err);
      },
      complete: () => console.log('There are no more actions happening.'),
    });
  }

  onSubmit(form: any) {
    if (this.categoryModel.id === 0) {
      this.categoryService
        .postCategories({ title: this.categoryModel.title })
        .subscribe({
          next: (response: any) => {
            this.categories = response.data;
            this.categoryModel = this.INITIAL_CATEGORY;
            form.resetForm();
          },
          error: (err) => {
            console.log(err?.error?.error?.message);
          },
        });
    } else {
      this.categoryService.putCategory(this.categoryModel).subscribe({
        next: (response: any) => {
          this.categories = response.data;
          this.categoryModel = this.INITIAL_CATEGORY;
        },
        error: (err) => {
          console.log(err?.error?.error?.message);
        },
      });
    }
  }

  onDelete(id: number | undefined) {
    // console.log(id);
    if (id !== undefined) {
      this.categoryService.deleteCategory(id).subscribe({
        next: (response: any) => {
          this.categories = response.data;
        },
        error: (err) => {
          console.error('An error occurred:', err);
        },
      });
    }
  }

  onEdit(category: Category) {
    this.categoryModel = { ...category };
    console.log(this.categoryModel);
  }
  close() {
    this.categoryModel = { ...this.INITIAL_CATEGORY };
  }
}