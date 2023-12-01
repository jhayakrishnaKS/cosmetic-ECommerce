import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AddAddress, Address } from 'src/app/model/address';
import { AppResponse } from 'src/app/model/appResponse';
import { UserDetail } from 'src/app/model/user-details';
import { StorageService } from 'src/app/service/storage.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent implements OnInit {
  address: Address = { id: 0, address: '', city: '', zipcode: 0 };
  error: string = '';
  userDetails: UserDetail[] = [];
  addressModel: AddAddress = {
    id: 0,
    address: '',
    city: '',
    zipcode: 0,
    userId: 0,
  };

  editingAddress: boolean = false; 

  constructor(
    private userService: UserService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails() {
    const userId = this.storageService.getLoggedInUser().id;

    this.userService.getUserDetails().subscribe(
      (response: AppResponse) => {
        if (response && response.data) {
          this.userDetails = response.data;
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      (error) => {
        console.log('An error occurred:', error);
      }
    );
  }

  onSubmit(addressForm: NgForm) {
    const userId = this.storageService.getLoggedInUser().id;

    let address: AddAddress = {
      id: this.addressModel.id,
      userId: userId,
      address: addressForm.value.address,
      city: addressForm.value.city,
      zipcode: parseFloat(addressForm.value.zipcode),
    };

    if (!this.editingAddress) {
      // Add new address
      this.userService.postUsersAddress(address).subscribe({
        next: (response: AppResponse) => {
          if (response && response.data) {
            this.userDetails = response.data.userDetails;
            this.addressModel = { id: 0, address: '', city: '', zipcode: 0 };
            addressForm.resetForm();
          } else {
            console.error('Invalid API response format:', response);
          }
        },
        error: (err) => {
          console.error('An error occurred:', err);
        },
      });
    } else {
      // Update existing address
      this.userService.putUserAddress(this.addressModel).subscribe({
        next: (response: AppResponse) => {
          this.userDetails = response.data;
          console.log('Address updated');
          this.address = {
            id: this.addressModel.id,
            address: addressForm.value.address,
            city: addressForm.value.city,
            zipcode: parseFloat(addressForm.value.zipcode),
          };
          this.editingAddress = false; 
        },
        error: (err) => {
          console.error('An error occurred:', err);
        },
      });
    }
  }

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

  onEdit(address: AddAddress) {
    const userId = this.storageService.getLoggedInUser()?.id;
    this.address = { ...address };
    if (userId) {
      this.addressModel = { ...address, userId: userId };
      console.log('Address Model after edit:', this.addressModel);
      this.editingAddress = true; 
    } else {
      console.error('User ID is null or undefined.');
    }
  }
}
