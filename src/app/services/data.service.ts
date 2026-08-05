import { Injectable } from '@angular/core';
import { Olympic } from '../models/olympic.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private olympicUrl: string = './assets/mock/olympic.json';
  error: string | null = null;

  constructor(private http: HttpClient){
    
  }
  
  loadOlympics(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      catchError((err: HttpErrorResponse) => {
        this.error = err.message;
        return of([]);
      })
    );
  }

  

}