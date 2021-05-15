import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/auth.service';
import { LoginRequestPayload } from './login-requestpayload';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  loginForm: any;
  loginRequestPayload: LoginRequestPayload;
  registerSuccessMessage: any;
  isError:boolean;

  constructor(private authservice:AuthService,private activatedRoute:ActivatedRoute
    ,private router:Router,private toastr:ToastrService) {
    this.loginRequestPayload = {
      username:'',
      password:''
    };
    this.isError = false;
   }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
    });

    this.activatedRoute.queryParams
    .subscribe(params => {
      if(params.registered !== undefined && params.registered === 'true'){
        this.toastr.success('Signup Successful');
        this.registerSuccessMessage = 'Please Check your inbox for activation email '
        + 'activate your account before you Login!';
      }
    });
  }

  login(){

    this.loginRequestPayload.username = this.loginForm.get('username').value;
    this.loginRequestPayload.password = this.loginForm.get('password').value;

    this.authservice.login(this.loginRequestPayload).subscribe(
      ()=>{
        this.isError = false;
        this.router.navigateByUrl('/');
        this.toastr.success('Login Successful');
      },()=>{
        console.log("Login Unsuccessful");
        this.isError = true;
      }
    )
  }

}


