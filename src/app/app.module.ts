import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import player from 'lottie-web';
import { LottieModule } from 'ngx-lottie';

import { LoaderInterceptorService } from './service/interceptor/loaderInterceptor.service';
import { AuthInterceptorService } from './service/interceptor/authInterceptor.service';
import { CartComponent } from './component/cart/cart.component';
import { OrderComponent } from './component/order/order.component';
import { UserDetailsComponent } from './component/user-details/user-details.component';
import { ProductsComponent } from './component/products/products.component';
import { CategoryComponent } from './component/category/category.component';
import { ProductComponent } from './component/admin/product/product.component';
import { UsersComponent } from './component/admin/users/users.component';
import { AdminOrdersComponent } from './component/admin/aorders/aorders.component';
import { AdminCategoryComponent } from './component/admin/acategory/acategory.component';
import { AdminHomeComponent } from './component/admin/home/home.component';
import { ComponentComponent } from './confirmation-modal/component/component.component';


export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AdminHomeComponent,
   
    CartComponent,
        OrderComponent,
        UserDetailsComponent,
        ProductsComponent,
        CategoryComponent,
        ProductComponent,
        UsersComponent,
        AdminOrdersComponent,
        AdminCategoryComponent,
        ComponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LottieModule.forRoot({ player: playerFactory }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
