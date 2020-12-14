import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from 'src/auth-data.model';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;
  private isAuthenticated: boolean = false;
  private userId : string|null = null;
  private tokenTimer: any;

  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    return this.http.post('http://localhost:3000/api/user/signup', authData);
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    return this.http
      .post('http://localhost:3000/api/user/login', authData)
      .pipe(
        tap((response: any) => {
          const token = response.token;
          this.token = token;

          this.authStatusListener.next((this.isAuthenticated = !!this.token));
          if (!!token) {
            if (this.tokenTimer) clearTimeout(this.tokenTimer);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + response.expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.userId = response.userId);
            this.setAuthTimer(response.expiresInDuration);
          }
          return true;
        })
      );
  }

  getUserId() {
    return this.userId;
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.token = null;
    this.authStatusListener.next((this.isAuthenticated = false));
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
  }

  private getAuthData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresInDuration =
      authInformation.expirationDate.getTime() - now.getTime();
    if (expiresInDuration > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresInDuration / 1000);
    }
  }

  private saveAuthData(token: string, expirationDate: Date, userId : string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
}
