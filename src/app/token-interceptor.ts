import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable,throwError, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth/shared/auth.service';
import { catchError, switchMap,take, filter } from 'rxjs/operators';
import { LoginResponse } from './auth/login/login-responsepayload';

@Injectable({
    providedIn:'root'
})

export class TokenInterceptor implements HttpInterceptor{
    isTokenRefreshing = false;
    refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null); 
    constructor(public authService:AuthService){ }

    intercept(req: HttpRequest<any>,next: HttpHandler):
    Observable<HttpEvent<any>>{

        //guard condition to skip the process if we are making an API call to
        //Refresh Token and Login
        if(req.url.indexOf('refresh') !== -1 || req.url.indexOf('login') != -1)
        {
            return next.handle(req);
        }

        const jwtToken = this.authService.getJwtToken();
        if(jwtToken)
        {
            req=this.addToken(req,jwtToken);
        }

        return next.handle(req).pipe(catchError(error =>{
            if (error instanceof HttpErrorResponse
                && error.status === 403) {
                return this.handleAuthErrors(req, next);
            } else {
                return throwError(error);
            }
        }));
    }

    private handleAuthErrors(req: HttpRequest<any>, next: HttpHandler)
    :Observable<HttpEvent<any>>{

        if(!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap((refreshTokenResponse: LoginResponse) => {
                    this.isTokenRefreshing = false;
                    this.refreshTokenSubject
                        .next(refreshTokenResponse.authenticationToken);
                    return next.handle(this.addToken(req, 
                        refreshTokenResponse.authenticationToken));
                })
            )
        }else{
            return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap((res) => {
                    return next.handle(this.addToken(req,
                        this.authService.getJwtToken()))
                })
            );
        }

    }

    addToken(req:HttpRequest<any>,jwtToken:any){
        return req.clone({
            headers: req.headers.set('Authorization',
            'Bearer '+jwtToken)
        });
    }
}