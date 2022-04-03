import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  questions : Question[];
  apiURL: string = 'http://localhost:8000/api/questions';
  constructor(private router: Router, private http: HttpClient) { }

  listeQuestion(): Observable<Question[]>{
    return this.http.get<Question[]>(this.apiURL);
  }
  
}
