import { Commentaire } from './../models/commentaire.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
}

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
  apiURL: string = 'http://localhost:8000/api/commentaires';
 
  constructor(private http: HttpClient) { }

  addCommentaire(commentaire:any){
   
    return this.http.post<any>(this.apiURL, commentaire, httpOptions);
  }
  getCommentaire(id){
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Commentaire>(url);
  }
  
  updateCommentaire(commentaire,id){
    const url = `${this.apiURL}/${id}`;
    return this.http.put<any>(url, commentaire, httpOptions)
  }

  deleteCommentaire(id){
      const url = `${this.apiURL}/${id}`;
      return this.http.delete(url, httpOptions);
  }
  
}

