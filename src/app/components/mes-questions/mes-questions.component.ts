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
  sujets:Sujet[];
  user : User;
  currentUser:Number;
  constructor(private questionService : QuestionService, private userService : UserService, private sujetService: SujetService, private router:Router,private authService:AuthService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.questionService.listeMesQuestions(this.currentUser).subscribe(questions => {
      this.questions = questions;
      console.log(this.questions);
      });
  }
  
  toArray(answers: object) {
    return Object.keys(answers).map(key => answers[key])
  }
  getUserName(id : number){
    return this.userService.getUserById(id);
  }

  getSujet(id:number){
    return this.sujetService.getSujetById(id);
  }

  onSelect(question){
    console.log(question);
    this.router.navigate(['reponse-list/'+question.id]);
    //this.router.navigateByUrl('reponse-list/'+question.id);
  }

  getCurrentUser(){
    this.currentUser=this.authService.getCurrentUserId();
  }

  getMyDrafts(){
    this.questionService.listeMesBrouillons(this.currentUser);
  }

  getMyPublished(){
    this.questionService.listeMesQuestions(this.currentUser);
  }
}
