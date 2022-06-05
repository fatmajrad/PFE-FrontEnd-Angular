import { VoteService } from 'src/app/services/vote.service';
import { SujetService } from "./../../services/sujet.service";
import { Sujet } from "src/app/models/sujet.model";
import { Component, OnInit } from "@angular/core";
import { Question } from "src/app/models/question.model";
import { User } from "src/app/models/user.model";
import { QuestionService } from "src/app/services/question.service";
import { UserService } from "src/app/services/user.service";
import { Router, ActivatedRoute, Route } from "@angular/router";
import { Observable } from "rxjs";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from "rxjs/operators";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-sujet-questions-list',
  templateUrl: './sujet-questions-list.component.html',
  styleUrls: ['./sujet-questions-list.component.css']
})
export class SujetQuestionsListComponent implements OnInit {

  questions: Question[];
  sujets: Sujet[];
  user: User;
  formControl = new FormControl();
  totalElement: Number 
  page : number =1
  currrentSujet : any;
  constructor(
    private questionService: QuestionService,
    private userService: UserService,
    private sujetService: SujetService,
    private router: Router,
    private formBuilder: FormBuilder,
    private voteService : VoteService,
    private activatedRoute: ActivatedRoute
  ) {
   
  }

  ngOnInit(): void {
    this.questionService
    .getQuestionsBySujet(this.activatedRoute.snapshot.params.id)
    .subscribe((response) => {
      this.questions=response;
      this.currrentSujet=this.activatedRoute.snapshot.params.id;
      console.log(this.activatedRoute.snapshot.params.id);
      
    });
  }

  toArray(answers: object) {
    return Object.keys(answers).map((key) => answers[key]);
  }
  getUserName(id: number) {
    return this.userService.getUserById(id);
  }

  getSujet(id: number) {
    return this.sujetService.getSujetById(id);
  }

  getRecentQuestions() {
    let recentQuestions :Question[]=[]
    this.questionService.getRecentQuestions().subscribe((questions) => {
      questions.forEach(question => {
       question.tag.forEach(tag => {
        let x = tag.id-this.currrentSujet
        if(x===0){
          recentQuestions.push(question)
        }
        });
      });
    });
    this.questions=recentQuestions
  }

  getRatedQuestions(){
    this.voteService.getRatedReponses().subscribe((response)=>{
      console.log(response);
      
    });
  }
 
  countNumberVotes(reponse : any, typeVote){
    let allVotes = reponse.votes;
    console.log(allVotes);
    let x =0;
    allVotes.forEach(vote => {
      if(vote.typeVote ===typeVote){
        x=x+1
      }
    });
    return x;
  }

 
}


