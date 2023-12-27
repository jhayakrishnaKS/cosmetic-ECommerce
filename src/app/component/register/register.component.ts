import { Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { AppResponse } from 'src/app/model/appResponse';
import { Register } from 'src/app/model/register';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { AppUser } from 'src/app/model/appUser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registers:Register[]=[];
  options: AnimationOptions = {
    path: '/assets/auth.json',
  };
 
  constructor(private authService:AuthService,private router:Router){}
 
  person:String='';
  nameRef:String='';
  password:String='';
  role:String='';
  appUsers:AppUser[]=[];
  userError:string='';
 
  ngOnInit():void{
    this.authService.getAllUsers().subscribe({
      next:(response)=>{
        this.appUsers=response.data;
        console.log(this.appUsers);
      }
    })
  }
  onSubmit(form: any) {
    let userExist: Boolean = false;
   
    const newregister:Register={
      username: this.nameRef,
      password:this.password,
      name:this.person,
      role:this.role
 
    };
    for (let user of this.appUsers) {
      if (this.person === user.username) {
        this.userError = 'User Already Exists';
        userExist = true;
      }
    }
    if(userExist==false){
      this.authService.register(newregister).subscribe({
        next:(response:AppResponse)=>{
          this.registers.push(response.data);
          this.router.navigate(['/login']);
        }
      });
    }
    
  }
}
