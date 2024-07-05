import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Prescription } from './prescription.model';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  private prescriptionsUrl = 'http://localhost:8085/prescriptions';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET prescriptions from the server */
  getPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(this.prescriptionsUrl)
      .pipe(
        tap(_ => console.log('fetched prescriptions')),
        catchError(this.handleError<Prescription[]>('getprescriptions', []))
      );
  }

  /** GET prescription by id. Will 404 if id not found */
  getPrescription(id: number): Observable<Prescription> {
    const url = `${this.prescriptionsUrl}/${id}`;
    return this.http.get<Prescription>(url).pipe(
      tap(_ => console.log(`fetched prescription id=${id}`)),
      catchError(this.handleError<Prescription>(`getprescription id=${id}`))
    );
  }

  /** POST: add a new prescription to the server */
  addPrescription(visitId: number, prescription: Prescription): Observable<Prescription> {
    return this.http.post<Prescription>(`${this.prescriptionsUrl}?visitId=${visitId}`, prescription);
  }



  /** DELETE: delete the prescription from the server */
  deletePrescription(prescription: Prescription | number): Observable<Prescription> {
    const id = typeof prescription === 'number' ? prescription : prescription.id;
    const url = `${this.prescriptionsUrl}/${id}`;

    return this.http.delete<Prescription>(url, this.httpOptions).pipe(
      tap(_ => console.log(`deleted prescription id=${id}`)),
      catchError(this.handleError<Prescription>('deleteprescription'))
    );
  }

  /** PUT: update the prescription on the server */


  /** GET prescriptions whose name contains search term */
  searchPrescriptions(term: string): Observable<Prescription[]> {
    if (!term.trim()) {
      // if not search term, return empty prescription array.
      return of([]);
    }
    return this.http.get<Prescription[]>(`${this.prescriptionsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        console.log(`found prescriptions matching "${term}"`) :
        console.log(`no prescriptions matching "${term}"`)),
      catchError(this.handleError<Prescription[]>('searchprescriptions', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
