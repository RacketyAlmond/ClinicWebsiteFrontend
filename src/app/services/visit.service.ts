import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visit } from '../visit/visit.model';
import {catchError} from "rxjs/operators";
import { User } from '../visit/user.model';




const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private baseUrl = 'http://localhost:8085/api/visit';
  private usernameUrl = 'http://localhost:8085/api/user/username';
  private emailURL = 'http://localhost:8085/api/user/email';


  constructor(private http: HttpClient) {}

  findAllVisits(): Observable<Visit[]> {
    return this.http.get<Visit[]>(this.baseUrl);
  }

  addVisit(userId: number, visit: Visit): Observable<Visit> {
    return this.http.post<Visit>(`${this.baseUrl}?userId=${userId}`, visit);
  }

  getUsername(): Observable<string> {
    return this.http.get(this.usernameUrl, { responseType: 'text' }).pipe(
      catchError(this.handleError<string>('getUsername'))
    );
  }

  handleError<T>(arg0: string): (err: any, caught: Observable<string>) => import("rxjs").ObservableInput<any> {
        throw new Error('Method not implemented.');
    }

  getEmail(): Observable<string> {
    return this.http.get(this.emailURL, { responseType: 'text' }).pipe(
      catchError(this.handleError<string>('getEmail'))
    );
  }

  deleteVisit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  deleteVisiter(visit: Visit | number): Observable<Visit> {
    const id = typeof visit === 'number' ? visit : visit.id;
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<Visit>(url, httpOptions);
  }

  updateVisit(id: number, visit: Visit): Observable<Visit> {
    return this.http.put<Visit>(`${this.baseUrl}/${id}`, visit);
  }
}
