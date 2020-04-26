import { Injectable } from '@angular/core';
import { Category } from './category.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  category: Category;
  urlBase = 'api/categories';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.urlBase).pipe(
      map((products) => products),
      catchError((error) => this.handleError(error))
    );
  }
  get(id: number): Observable<Category> {
    const url = `${this.urlBase}/${id}`;
    return this.http.get<Category>(url).pipe(
      map((category) => category),
      catchError((error) => this.handleError(error))
    );
  }
  update(category: Category): Observable<Category> {
    const url = `${this.urlBase}/${category.id}`;
    return this.http.put('fude', category).pipe(
      map(() => category),
      catchError((error) => this.handleError(error))
    );
  }
  create(category: Category): Observable<Category> {
    return this.http.post<Category>(this.urlBase, category).pipe(
      map((obj) => obj),
      catchError((error) => this.handleError(error))
    );
  }
  delete(category: Category): Observable<Category> {
    const url = `${this.urlBase}/${category.id}`;
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
