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
    console.log("reponse f service",commentaire);
    return this.http.post<any>(this.apiURL, commentaire, httpOptions);
  }

  
}

