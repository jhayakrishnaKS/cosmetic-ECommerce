import { Component } from '@angular/core';
import { Form } from '@angular/forms';
import { AnimationOptions } from 'ngx-lottie';
import { ToastrService } from 'ngx-toastr';
import { AppResponse } from 'src/app/model/appResponse';
import { Login } from 'src/app/model/login';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Animation options for the login component
  options: AnimationOptions = {
    path: "/assets/auth.json",
  };

  // User input fields
  username: String = "";
  password: String = "";

  // Error message to display in case of login failure
  error: String = "";

  // Constructor with AuthService injection
  constructor(private authService: AuthService,private toastr:ToastrService) {}

  // Function to handle user login
  login(_loginForm: Form): void {
    // Create a Login object with user input
    let login: Login = {
      username: this.username,
      password: this.password,
    };

    // Make a login API call using AuthService
    this.authService.login(login).subscribe({
      next: (response: AppResponse) => {
        // Set the user as logged in on successful login
        this.authService.setLoggedIn(response.data);
        this.toastr.success('Login Successfull', '', {
          toastClass: 'custom-toast',
          // positionClass: 'toast-top-center',
        });
        
        
        
      },
      error: (err) => {
        // Handle login error and display an error message
        let message: String = err.error.error.message;
        this.error = message.includes(",") ? message.split(",")[0] : message;
      },
      complete: () => console.log("There are no more action happen."),
    });
  }
}
