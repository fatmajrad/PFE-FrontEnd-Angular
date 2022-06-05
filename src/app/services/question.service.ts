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
  getQuestionsByIntitule(intitule: any) {
    const url = "http://localhost:8000/api/questions?page=1&intituleQuestion="+intitule
    return this.http.get<Question[]>(url);
  }
  getQuestionsByStatut(statut){
    const url = "http://localhost:8000/api/questions?page=1&statut="+statut
    return this.http.get<Question[]>(url);
  }
 
  questions : Question[];
  emtyBody:any;
  apiURL: string = 'http://localhost:8000/api/questions';
 
  constructor(private router: Router, private http: HttpClient) { }

  listeValidatedQuestions(){
    const url ="http://localhost:8000/api/questions?page=1&statut=valide"
    return this.http.get<Question[]>(url);
  }
  
  listeQuestion(): Observable<Question[]>{
    const url ="http://localhost:8000/api/questions?page=1&brouillon=false"
    return this.http.get<Question[]>(url);
  }


  listMyQuestions(id:Number) {
    const url ="http://localhost:8000/api/questions?page=1&user.id="+id
    console.log(url);
    return this.http.get<Question[]>(url);
  }

  getMyQuestionsByStatut(statut,id){
    const url = "http://localhost:8000/api/questions?page=1&user.id="+id+"&statut="+statut
    return this.http.get<Question[]>(url);
  }

  getMyQuestionsByIntitule(intitule,id){
    const url = "http://localhost:8000/api/questions?page=1&user.id="+id+"&intituleQuestion="+intitule
    return this.http.get<Question[]>(url);
  }
  
 
  getQuestionsByDateIntervall(minDate , maxDate){

    const url = "http://localhost:8000/api/users/valide/"+minDate+"/"+maxDate+"/countdate"
    console.log(url);
    
    return this.http.get<Question[]>(url);
  }
 
  getRecentQuestions(){
    const url = "http://localhost:8000/api/questions/recent"
    
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

  deleteQuestion(id:Number){
    const url = `${this.apiURL}/${id}`;
    return this.http.delete(url, httpOptions);
  }

  countAllQuestions(){
    const url = "http://localhost:8000/api/questions/valide/count"
    return this.http.get<Question[]>(url);
  }

  getQuestionsBySujet(idSujet){
    const url="http://localhost:8000/api/questions?statut=valide&tag.id="+idSujet
    return this.http.get<Question[]>(url)
  }

  getMyQuestionsByTag(idSujet,IdUser){
    const url="http://localhost:8000/api/questions?user.id="+IdUser+"&tag.id="+idSujet
    return this.http.get<Question[]>(url);
  }

  getMyQuestionsByIntituleSujet(idUser,idSujet,intitule){
    const url="http://localhost:8000/api/questions?user.id="+idUser+"&intituleQuestion="+intitule+"&tag.id="+idSujet
    return this.http.get<Question[]>(url);
  }
  
}
