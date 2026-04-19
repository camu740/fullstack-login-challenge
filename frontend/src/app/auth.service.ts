import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

const AUTH_API = '/api/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user') || 'null'));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): any {
    return this.userSubject.value;
  }

  login(credentials: any): Observable<any> {
    return this.http.post(AUTH_API + 'login', credentials).pipe(map(user => {
      this.saveUser(user);
      return user;
    }));
  }

  register(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'signup', user);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  saveUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  ssoCallback(code: string): Observable<any> {
    return this.http.get(AUTH_API + 'sso/callback?code=' + code).pipe(map(user => {
      this.saveUser(user);
      return user;
    }));
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(AUTH_API + 'refresh', { refreshToken });
  }

  getAccessToken(): string | null {
    const user = this.userValue;
    return user ? user.accessToken : null;
  }
}
