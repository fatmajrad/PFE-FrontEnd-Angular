import { Question } from 'src/app/models/question.model';
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


export class QuestionService {
 
  questions : Question[];
  emtyBody:any;
  apiURL: string = 'http://localhost:8000/api/questions';
 
  constructor(private router: Router, private http: HttpClient) { }


  
  listeQuestion(): Observable<Question[]>{
    const url ="http://localhost:8000/api/questions?page=1&brouillon=false"
    return this.http.get<Question[]>(url);
  }

  listeValidatedQuestions():Observable<Question[]>{
    const url ="http://localhost:8000/api/questions?statutValidation=true&brouillon=false"
    return this.http.get<Question[]>(url);
  }
  listeInvalidQuestions():Observable<Question[]>{
    const url ="http://localhost:8000/api/questions?statutValidation=false&brouillon=false"
    return this.http.get<Question[]>(url);
  }
  
 
  listMyQuestions(id:Number) {
    const url ="http://localhost:8000/api/questions?page=1&user.id="+id
    console.log(url);
    return this.http.get<Question[]>(url);
  }

  listMyDrafts(id:Number) {
    const url ="http://localhost:8000/api/questions?page=1&statutValidation=false&brouillon=true&user.id="+id
    return this.http.get<Question[]>(url);
  }

  listMyQuestionsRequest(id:Number):Observable<Question[]>{
    const url ="http://localhost:8000/api/questions?page=1&statutValidation=true&brouillon=false&user.id="+id
    return this.http.get<Question[]>(url);
  }

  listeMyPublishedQuestions(id:Number) {
    const url ="http://localhost:8000/api/questions?page=1&brouillon=false&user.id="+id
    return this.http.get<Question[]>(url);
  }
  
  listeMyInvalidQuestions(id:Number) {
    const url ="http://localhost:8000/api/questions?page=1&statutValidation=false&brouillon=false&user.id="+id
    return this.http.get<Question[]>(url);
  }
 
  
  
  
  consulterQuestion(id: number): Observable<Question> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Question>(url);
  }

  addQuestion(question:any){
    console.log("question f service",question);
    return this.http.post<any>(this.apiURL, question, httpOptions);
  }

  updateQuestion(question: any,id:Number) {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<any>(url, question, httpOptions)
  }

  validateQuestion(id: Number) {
    const url = `${this.apiURL}/${id}` + "/validate";
    this.emtyBody = {};
    return this.http.put(url, this.emtyBody, httpOptions);
  }
  declineQuestion(id: Number) {
    const url = `${this.apiURL}/${id}` + "/decline";
    this.emtyBody = {};
    return this.http.put(url, this.emtyBody, httpOptions);
  }
  
  publishQuestion(id: Number) {
    const url = `${this.apiURL}/${id}` + "/publish";
    this.emtyBody = {};
    return this.http.put(url, this.emtyBody, httpOptions);
  }
}
