import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable , BehaviorSubject , of} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {environment} from "../../environments/environment";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private baseUrl = environment.endpoint+'auth'; // Update with your backend API URL
  private authTokenKey = 'authToken';

  constructor(private http: HttpClient) {}




  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials,{ ...httpOptions, responseType: 'text' })
      .pipe(
        map((response: string) => {
          this.isAuthenticatedSubject.next(true);
          return response === 'Login successful';
        }),
        catchError((error) => {
          console.error('Login failed', error);
          return of(false); // Return Observable of false on error
        })
      );;
  }

  logout(): void {

    this.isAuthenticatedSubject.next(false);
  }
}
