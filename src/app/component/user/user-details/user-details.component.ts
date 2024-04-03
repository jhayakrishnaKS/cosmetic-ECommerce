import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { Address } from 'src/app/model/address';
import { AppResponse } from 'src/app/model/appResponse';
import { AppUser } from 'src/app/model/appUser';
import { UserDetail } from 'src/app/model/user-details';
import { StorageService } from 'src/app/service/storage.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent implements OnInit {
  // Animation options for the ngx-lottie library
  options: AnimationOptions = {
    path: "/assets/Address.json",
  };

  // Address object for form data
  address: Address = { id: 0, address: '', city: '', zipcode: 0,state:'',phoneNumber:0 };

  // Error message
  error: string = '';

  // Arrays to store user details and app user information
  userDetails: UserDetail[] = [];
  appUser: AppUser[] = [];

  // Address model for form binding and editing
  addressModel: Address = {
    id: 0,
    address: '',
    city: '',
    zipcode: 0,
    state:'',
    userId: 0,
    phoneNumber:0
  };

  // Flag for editing an existing address
  editingAddress: boolean = false;

  // Selected address ID for deletion
  selectedAddressId: number | null = null;

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    // Initial loading of user details on component initialization
    this.loadUserDetails();
  }

  // Load user details from the server
  loadUserDetails() {
    // Get user ID from the storage service
    const userId = this.storageService.getLoggedInUser().id;

    // Call the service to get user addresses
    this.userService.getUsersAddress().subscribe(
      (response: AppResponse) => {
        if (response && response.data) {
          // Check and format the API response data
          this.userDetails = Array.isArray(response.data)
            ? response.data
            : [response.data];
          console.log(this.userDetails);
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      (error) => {
        console.log('An error occurred:', error);
      }
    );
  }

  // Handle form submission for adding or updating an address
  onSubmit(addressForm: NgForm) {
    // Get user ID from the storage service
    const userId = this.storageService.getLoggedInUser().id;

    // Create an address object with form data
    let address: Address = {
      id: this.addressModel.id,
      userId: userId,
      address: addressForm.value.address,
      city: addressForm.value.city,
      zipcode: parseFloat(addressForm.value.zipcode),
      state:addressForm.value.state,
      phoneNumber: parseFloat(addressForm.value.phoneNumber),
    };

    if (!this.editingAddress) {
      // Add new address
      this.userService.postUsersAddress(address).subscribe({
        next: (response: AppResponse) => {
          if (response && response.data) {
            // Update user details and reset form values
            this.userDetails = response.data.userDetails;
            this.addressModel = { id: 0, address: '', city: '', zipcode: 0,state:'',phoneNumber:0 };
            // Reload user details to reflect changes
            this.loadUserDetails();
          } else {
            // Log an error message if the API response format is invalid
            console.error('Invalid API response format:', response);
          }
        },
        error: (err) => {
          // Log an error message if an error occurs during the API call
          console.error('An error occurred:', err);
        },
      });
    } else {
      // Update existing address
      this.userService.putUserAddress(this.addressModel).subscribe({
        next: (response: AppResponse) => {
          // Update user details and reset form values
          this.userDetails = response.data;
          console.log('Address updated');
          // Update the address object
          this.address = {
            id: this.addressModel.id,
            address: addressForm.value.address,
            city: addressForm.value.city,
            zipcode: parseFloat(addressForm.value.zipcode),
            state:addressForm.value.state,
            phoneNumber: parseFloat(addressForm.value.phoneNumber),
          };
          // Reset the editing flag
          this.editingAddress = false;
        },
        error: (err) => {
          // Log an error message if an error occurs during the API call
          console.error('An error occurred:', err);
        },
      });
    }
  }


  // Handle address deletion
  onDelete(id: number | undefined) {
    console.log(id);
    if (id !== undefined) {
      this.userService.deleteUsersAddress(id).subscribe({
        next: (response: AppResponse) => {
          this.userDetails = response.data;
          console.log(response.data);
        },
        error: (err) => {
          console.error('An error occurred:', err);
        },
      });
    }
  }

  // Handle address editing
  onEdit(address: Address) {
    // Get user ID from the storage service
    const userId = this.storageService.getLoggedInUser()?.id;
    this.address = { ...address };

    if (userId) {
      // Update address model and set editing flag
      this.addressModel = { ...address, userId: userId };
      console.log('Address Model after edit:', this.addressModel);
      this.editingAddress = true;
      this.loadUserDetails();
    } else {
      console.error('User ID is null or undefined.');
    }
  }

  // Set the selected address ID for deletion
  setSelectedAddressId(addressId: number) {
    this.selectedAddressId = addressId;
  }

  // Cancel the address deletion and navigate back
  onCancelDelete() {
    this.router.navigate(['/user-details'], { replaceUrl: true });
  }
}
