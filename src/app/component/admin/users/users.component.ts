import { Component, OnInit } from "@angular/core";
import { AnimationOptions } from "ngx-lottie";
import { UserDetail } from "src/app/model/user-details";
import { UserService } from "src/app/service/user.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  options: AnimationOptions = {
    path: "/assets/emptyAddress.json",
  };
  // Variable to store error message
  error: string = "";

  // Array to store user details
  userDetails: UserDetail[] = [];

  // Variable to store selected user details
  userDetail: UserDetail = {
    id: 0,
    username: "",
    name: "",
    roles: "",
    joinedAt: "",
    addressList: [],
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Subscribe to getUserDetails method in the UserService
    this.userService.getUserDetails().subscribe({
      // Success callback
      next: (response: any) => {
        // Extract user details from the API response
        let userDetails: UserDetail[] = response.data;
        // Check if there are user details available
        if (userDetails.length > 0) {
          // Update userDetails array and set the initial userDetail
          this.userDetails = userDetails;
          this.userDetail = userDetails[0];
        }
      },
      // Error callback
      error: (err) => {
        // Extract error message from the API response
        let message: string = err?.error?.error?.message;
        // Update the error variable, handling multiple error messages
        this.error = message.includes(",") ? message.split(",")[0] : message;
      },
    });
  }

  // Function to set the selected user details
  setSelectedUser(userDetail: UserDetail): void {
    this.userDetail = userDetail;
  }
}
