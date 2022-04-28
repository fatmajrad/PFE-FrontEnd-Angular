import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbPaginationNumber } from '@ng-bootstrap/ng-bootstrap';
import { Question } from 'src/app/models/question.model';
import { Sujet } from 'src/app/models/sujet.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { QuestionService } from 'src/app/services/question.service';
import { SujetService } from 'src/app/services/sujet.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mes-questions',
  templateUrl: './mes-questions.component.html',
  styleUrls: ['./mes-questions.component.css']
})
export class MesQuestionsComponent implements OnInit {

  questions : Question[];
  published: Question [];
  requests : Question[];
  invalidQ:Question[];
  brouillons:Question[]
  
  sujets:Sujet[];
  user : User;
  currentUser:Number;
  constructor(private questionService : QuestionService, private userService : UserService, private sujetService: SujetService, private router:Router,private authService:AuthService) { }

  async ngOnInit(): Promise<void> {
    this.getCurrentUser();
    this.currentUser= await this.authService.getCurrentUserId();
    this.questions = await this.questionService.listMyQuestions(this.currentUser).toPromise();
    this.getMyDrafts();
    this.getMyInvalidQuestions();
    this.getMyPublished();
    this.getMyQuestionqRequests();
  }
  
  toArray(answers: object) {
    return Object.keys(answers).map(key => answers[key])
  }
  getUser(id : number){
    return this.userService.getUserById(id);
  }

  getSujet(id:number){
    return this.sujetService.getSujetById(id);
  }

  onSelect(question){
    console.log(question);
    this.router.navigate(['reponse-list/'+question.id]);
  }

  getCurrentUser(){
     this.authService.getCurrentUserId();
    console.log(this.currentUser);
  }

  
  getMyDrafts(){
    this.questionService.listMyDrafts(this.currentUser).subscribe(questions => {
      this.brouillons = questions;});
  }
  

  getMyPublished(){
    this.questionService.listeMyPublishedQuestions(this.currentUser).subscribe(questions => {
      this.published = questions;});
  }

  getMyQuestionqRequests(){
    this.questionService.listMyQuestionsRequest(this.currentUser).subscribe(questions => {
      this.requests = questions;});
  }

  getMyInvalidQuestions(){
    this.questionService.listeMyInvalidQuestions(this.currentUser).subscribe(questions => {
      this.invalidQ = questions;});
      console.log(this.invalidQ);
  }

}
