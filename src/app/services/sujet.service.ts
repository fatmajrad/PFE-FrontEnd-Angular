import { Sujet } from './../models/sujet.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

  
export class SujetService {
  
  apiURL: string = 'http://localhost:8000/api/sujets';
  constructor(private router: Router, private http: HttpClient) { }

  listeSujet(): Observable<Sujet[]>{
    return this.http.get<Sujet[]>(this.apiURL);
  }
}
