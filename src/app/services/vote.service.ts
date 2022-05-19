import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Vote } from '../models/vote.model';


const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};


@Injectable({
  providedIn: 'root'
})
export class VoteService {
  
  apiURL: string = 'http://localhost:8000/api/votes';
  constructor(private router: Router, private http: HttpClient) { }

 
  getQuestionVote(idUser:Number,idQuestion:Number): Observable<Vote[]>{
      let url="http://localhost:8000/api/votes?page=1&user.id="+idUser+"&Question.id="+idQuestion;
      console.log(url);
      return this.http.get<Vote[]>(url, httpOptions);
    }

    getReponseVote(idUser:Number,idReponse:Number): Observable<Vote[]>{
      let url="http://localhost:8000/api/votes?page=1&user.id="+idUser+"&Reponse.id="+idReponse;
      console.log(url);
      return this.http.get<Vote[]>(url, httpOptions);
    }

    getConnaissanceVote(idUser:Number,idConnaissance:Number): Observable<Vote[]>{
      let url="http://localhost:8000/api/votes?page=1&user.id="+idUser+"&Connaissance.id="+idConnaissance;
      console.log(url);
      return this.http.get<Vote[]>(url, httpOptions);
    }


    addLike(vote: any){
      console.log(vote);
      return this.http.post<any>(this.apiURL, vote, httpOptions);
    }

    deleteVote(id : Number){
      const url = `${this.apiURL}/${id}`;
    return this.http.delete(url, httpOptions);
    }
  
}
