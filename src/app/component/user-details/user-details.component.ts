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
  options: AnimationOptions = {
    path: "/assets/Address.json",
  };
  address: Address = { id: 0, address: '', city: '', zipcode: 0 };
  error: string = '';
  userDetails: UserDetail[] = [];
  appUser: AppUser[] = [];
  addressModel: Address = {
    id: 0,
    address: '',
    city: '',
    zipcode: 0,
    userId: 0,
  };

  editingAddress: boolean = false;
  selectedAddressId:number|null=null;

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }
//Loading user details
  loadUserDetails() {
    const userId = this.storageService.getLoggedInUser().id;

    this.userService.getUsersAddress().subscribe(
      (response: AppResponse) => {
        if (response && response.data) {
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

  onSubmit(addressForm: NgForm) {
    const userId = this.storageService.getLoggedInUser().id;

    let address: Address = {
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
            this.loadUserDetails();
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
//Delete function
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
//Edit function
  onEdit(address: Address) {
    const userId = this.storageService.getLoggedInUser()?.id;
    this.address = { ...address };
    if (userId) {
      this.addressModel = { ...address, userId: userId };
      console.log('Address Model after edit:', this.addressModel);
      this.editingAddress = true;
      this.loadUserDetails();
    } else {
      console.error('User ID is null or undefined.');
    }
  }
  setSelectedAddressId(addressId:number){
    this.selectedAddressId=addressId;
  }
  onCancelDelete(){
    this.router.navigate(['/user-details'],{ replaceUrl: true });
  }
}
