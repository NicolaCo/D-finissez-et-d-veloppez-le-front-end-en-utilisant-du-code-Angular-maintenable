import { Injectable } from '@angular/core';
import { Olympic } from '../models/olympic.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

export type LoadOlympicsResult =
  | { kind: 'success'; data: Olympic[] }
  | { kind: 'error'; status: number; message: string };

export type LoadOlympicsByIdResult =
  | { kind: 'success'; data: Olympic }
  | { kind: 'not-found' }
  | { kind: 'error'; status: number; message: string };

@Injectable({
  providedIn: 'root'
})

export class DataService {
 
  private olympicUrl: string = './assets/mock/olympic.json';

  constructor(private http: HttpClient){
    
  }
  
  loadOlympics(): Observable<LoadOlympicsResult> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      map((data: Olympic[]) => ({ kind: 'success' as const, data })),
      catchError((err: HttpErrorResponse) =>
        of({ kind: 'error' as const, status: err.status, message: err.message })
      )
    );
  }

  loadOlympicsById(id: number): Observable<LoadOlympicsByIdResult> {
    return this.loadOlympics().pipe(
      map((result) => {
        if (result.kind === 'error') {
          return { kind: 'error', status: result.status, message: result.message };
        }
        const olympic = result.data.find((o: Olympic) => o.id === id);
        return olympic
          ? { kind: 'success', data: olympic }
          : { kind: 'not-found' };
      })
    );
  }
}