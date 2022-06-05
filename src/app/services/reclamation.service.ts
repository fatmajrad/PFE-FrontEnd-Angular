import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reclamation } from '../models/reclamation.model';


const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
@Injectable({
  providedIn: 'root'
})


export class ReclamationService {
  apiURL: string = 'http://localhost:8000/api/reclamations';

 
  constructor(private http: HttpClient) { }

  addReclamation(reclamation:any){
  
    return this.http.post<any>(this.apiURL, reclamation, httpOptions);
  }

  answerReclamation(reclamation: any,id:Number) {
    const url =" http://localhost:8000/api/reclamations/"+id+"/answer"
    return this.http.put<any>(url, reclamation, httpOptions)
  }
  
  deleteReclamtion(id:Number){
    const url = `${this.apiURL}/${id}`;
    return this.http.delete(url, httpOptions);
  }
  
  getAllReclamations(): Observable<Reclamation[]>{
    return this.http.get<Reclamation[]>(this.apiURL);
  }


}