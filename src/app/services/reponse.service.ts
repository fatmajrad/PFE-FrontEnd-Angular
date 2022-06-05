
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reponse } from '../models/reponse.model';
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})
export class ReponseService {

  apiURL: string = 'http://localhost:8000/api/reponses';
 
  constructor(private http: HttpClient) { }

  addReponse(reponse:any){
    console.log("reponse f service",reponse);
    return this.http.post<any>(this.apiURL, reponse, httpOptions);
  }

  updateReponse(reponse: any,id:Number) {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<any>(url, reponse, httpOptions)
  }

  deleteReponse(id: Number) {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete(url, httpOptions);
  }

  getReponse(): Observable<Reponse[]>{
    return this.http.get<Reponse[]>(this.apiURL);
  }
}
