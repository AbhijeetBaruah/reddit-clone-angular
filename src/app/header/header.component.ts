import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth/shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  faUser = faUser;
  isLoggedIn: boolean=false;
  username: string='';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.authService.loggedIn.subscribe(data=>{
      this.isLoggedIn = data;
    })
    this.authService.username.subscribe(data=>{
      this.username = data;
    })
    this.isLoggedIn = this.authService.isLoggedIn();
    this.username = this.authService.getUserName();
  }

  goToUserProfile() {
    this.router.navigateByUrl('/user-profile/' + this.username);
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('login');
    this.isLoggedIn = false;
    this.username='';
    console.log("Logout"); 
  }
}
