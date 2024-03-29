import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/auth.service';
import { SignupRequestPayload } from './signup-requestpayload';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {


  signupRequestPayload: SignupRequestPayload;
  signupForm: any;

  constructor(private authService: AuthService,private router:Router,
    private toastr: ToastrService) { 
    this.signupRequestPayload = {
      username:'',
      email: '',
      password:''
    };
    
  } 

  ngOnInit(){
    this.signupForm = new FormGroup({
      username: new FormControl('',Validators.required),
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',Validators.required),
    });
  }

  signup(){
    this.signupRequestPayload.email=this.signupForm.get('email').value;
    this.signupRequestPayload.username = this.signupForm.get('username').value;
    this.signupRequestPayload.password = this.signupForm.get('password').value;  

    this.authService.signup(this.signupRequestPayload)
    .subscribe(() =>{
      this.toastr.show("Check Email for activation");
      this.router.navigate(['/login'],
      { queryParams:{registered:'true'}});
    },()=>{
      this.toastr.error('Registration Failed! Please try again (try another username)');
    });
  }

}
