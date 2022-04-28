import { Connaissance } from 'src/app/models/connaissance.modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})
export class ConnaissanceService {

  apiURL: string = 'http://localhost:8000/api/connaissances';
  constructor(private router: Router, private http: HttpClient) { }

  getConnaissance(): Observable<Connaissance[]>{
    return this.http.get<Connaissance[]>(this.apiURL);
  }

  addQuestion(connaissance:any){
    console.log("connaissance f service",connaissance);
    return this.http.post<any>(this.apiURL, connaissance, httpOptions);
  }

  updateConnaissance(connaissance: any,id:Number) {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<any>(url, connaissance, httpOptions)
  }
}
