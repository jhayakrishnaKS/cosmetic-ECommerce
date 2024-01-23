import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './component/user/home/home.component';
import { AdminHomeComponent } from './component/admin/home/home.component';
import { authGuard } from './guard/auth.guard';
import { CartComponent } from './component/user/cart/cart.component';
import { OrderComponent } from './component/user/order/order.component';
import { UserDetailsComponent } from './component/user/user-details/user-details.component';
import { ProductsComponent } from './component/user/products/products.component';
import { CategoryComponent } from './component/user/category/category.component';
import { ProductComponent } from './component/admin/product/product.component';
import { UsersComponent } from './component/admin/users/users.component';
import { AdminOrdersComponent } from './component/admin/aorders/aorders.component';
import { AdminCategoryComponent } from './component/admin/acategory/acategory.component'; 
import { LandingPageComponent } from './component/landing-page/landing-page.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminHomeComponent, canActivate: [authGuard] },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'order',
    component: OrderComponent,
  },
  {
    path: 'user-details',
    component: UserDetailsComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'category',
    component: CategoryComponent,
  },
  {
    path: 'admin/category',
    component: AdminCategoryComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/product',
    component: ProductComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/users',
    component: UsersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/order',
    component: AdminOrdersComponent,
    canActivate: [authGuard],
  },
  {
    path:'k-cosmetics',
    component:LandingPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
