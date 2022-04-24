import { Sujet } from './../models/sujet.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {map, skipWhile, tap} from 'rxjs/operators'


const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})

  
export class SujetService {
  
 
  apiURL: string = 'http://localhost:8000/api/sujets';
  constructor(private router: Router, private http: HttpClient) { }

  listeSujet(): Observable<Sujet[]>{
    return this.http.get<Sujet[]>(this.apiURL);
  }

  getSujetById(id:Number): Observable<Sujet[]>{
    const url1 = `${this.api}/${id}`;
    const url = `${this.apiURL}/${id}` + "/validate";
    return this.http.get<Sujet[]>(url, httpOptions);
  }

  supprimerSujet(id: number) {
    
    const url = `${this.apiURL}/${id}`;
   
    return this.http.delete(url, httpOptions);
  }

  consulterSujet(id: number): Observable<Sujet> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Sujet>(url);
  }

  addSujet(sujet: Sujet): Observable<Sujet> {
    return this.http.post<Sujet>(this.apiURL, sujet, httpOptions);
  }
  updateSujet(sujet: Sujet,id:Number) {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<Sujet>(url, sujet, httpOptions)
  }

  api:  string='http://localhost:8000/api/sujets?page=1&nom'
  
  getSujetbyNom(nom: string): Observable<Sujet[]> {
    const url1 = `${this.api}=${nom}`;
    return this.http.get<Sujet[]>(url1);;
  }

  getlisteSujet(){
    return this.http.get(this.apiURL).pipe(
      map((response:[]) =>response.map(sujet =>sujet['nom']))
    )
  }
}
