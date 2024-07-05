import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../visit/user.model';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8085/api/user';
  private usernameUrl = 'http://localhost:8085/api/user/username';
  private emailURL = 'http://localhost:8085/api/user/email';


  constructor(private http: HttpClient) { }

  findAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  getUsername(): Observable<string> {
    return this.http.get(this.usernameUrl, { responseType: 'text' }).pipe(
      catchError(this.handleError<string>('getUsername'))
    );
  }

  getEmail(): Observable<string> {
    return this.http.get(this.emailURL, { responseType: 'text' }).pipe(
      catchError(this.handleError<string>('getEmail'))
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  handleError<T>(arg0: string): (err: any, caught: Observable<string>) => import("rxjs").ObservableInput<any> {
    throw new Error('Method not implemented.');
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser( user: User, id: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
