import { EventEmitter, Injectable, Output } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { SignupRequestPayload } from '../signup/signup-requestpayload';
import { Observable } from 'rxjs';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { LoginRequestPayload } from '../login/login-requestpayload';
import { LoginResponse } from '../login/login-responsepayload';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import {map,tap} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  


  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();


  constructor(private httpClient: HttpClient,
    private localStorage: LocalStorageService,
    private sessionStorage:SessionStorageService) {}

  signup(signupRequestPayload: SignupRequestPayload):Observable<any>
  {
    return this.httpClient.post('http://localhost:8080/api/auth/signup',signupRequestPayload,{responseType:'text'});
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<boolean>
  {
    this.sessionStorage.clear();
    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/auth/login',loginRequestPayload)
    .pipe(map(data => {
      
      this.sessionStorage.store('authenticationToken',data.authenticationToken);
      this.sessionStorage.store('username',data.username);
      this.sessionStorage.store('refreshToken',data.refreshToken);
      this.sessionStorage.store('expiresAt',data.expiresAt);

      this.loggedIn.emit(true);
      this.username.emit(data.username);
      return true;
    }));
  }

  getJwtToken(){
    return this.sessionStorage.retrieve('authenticationToken');
  }

  refreshToken() {
    const refreshTokenPayload = {
      refreshToken: this.getRefreshToken(),
      username: this.getUserName()
    }

    
    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/auth/refresh/token',
      refreshTokenPayload)
      .pipe(tap(response => {
        this.sessionStorage.clear('authenticationToken');
        this.sessionStorage.clear('expiresAt');

        
        this.sessionStorage.store('authenticationToken', response.authenticationToken);
        this.sessionStorage.store('expiresAt', response.expiresAt);
      }));
  }

  getRefreshToken() {
    return this.sessionStorage.retrieve('refreshToken');
  }

  getUserName() {
    return this.sessionStorage.retrieve('username');
  }

  getExpirationTime() {
    return this.sessionStorage.retrieve('expiresAt');
  }


  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }

  logout() {
    this.sessionStorage.clear('username');
    this.sessionStorage.clear('authenticationToken');
    this.sessionStorage.clear('refreshToken');
    this.sessionStorage.clear('expiresAt');
  }

}
