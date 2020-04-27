import { Injectable } from '@angular/core';
import { Entry } from './entry.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  entry: Entry;
  urlBase = 'api/entries';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.urlBase).pipe(
      map((products) => products),
      catchError((error) => this.handleError(error))
    );
  }
  get(id: number): Observable<Entry> {
    const url = `${this.urlBase}/${id}`;
    return this.http.get<Entry>(url).pipe(
      map((entry) => entry),
      catchError((error) => this.handleError(error))
    );
  }
  update(entry: Entry): Observable<Entry> {
    const url = `${this.urlBase}/${entry.id}`;
    return this.http.put('fude', entry).pipe(
      map(() => entry),
      catchError((error) => this.handleError(error))
    );
  }
  create(entry: Entry): Observable<Entry> {
    return this.http.post<Entry>(this.urlBase, entry).pipe(
      map((obj) => obj),
      catchError((error) => this.handleError(error))
    );
  }
  delete(entry: Entry): Observable<Entry> {
    const url = `${this.urlBase}/${entry.id}`;
    return this.http.delete(url).pipe(
      map(() => EMPTY),
      catchError((error) => this.handleError(error))
    );
  }
  handleError(error: any): Observable<any> {
    console.log(error);
    return throwError('error');
  }
}
