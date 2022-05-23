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
  selector: "app-questions-list",
  templateUrl: "./questions-list.component.html",
  styleUrls: ["./questions-list.component.css"],
})
export class QuestionsListComponent implements OnInit {
  questions: Question[];
  sujets: Sujet[];
  user: User;
  formControl = new FormControl();
  filteredOptions: Observable<any[]>;
  separatorKeysCodes: number[] =  [ENTER, COMMA];
  sujetForm : FormGroup;
  
  constructor(
    private questionService: QuestionService,
    private userService: UserService,
    private sujetService: SujetService,
    private router: Router,
    private formBuilder: FormBuilder,
    private voteService : VoteService
  ) {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(""),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val) => {
        return this.filter(val || "");
      })
    );
  }

  ngOnInit(): void {
    this.questionService.listeValidatedQuestions().subscribe((questions) => {
      this.questions = questions;
    });
    this.sujetService.getlisteSujet().subscribe((sujets)=>{
      this.sujets=sujets;
    })
    this.initSujetForm();
  }

  filter(val: string): Observable<any[]> {
    // call the service which makes the http-request
    return this.sujetService.getSujetAuto().pipe(
      map((response) =>
        response.filter((option) => {
          return option.nom.toLowerCase().indexOf(val.toLowerCase()) === 0;
        })
      )
    );
  }
  initSujetForm() {
    this.sujetForm = new FormGroup(
      {
        sujet : new FormControl()
      }
    )
  }

  getQuestions(){
    this.questionService.listeValidatedQuestions().subscribe((questions) => {
      this.questions = questions;
    });
  }
  getConnaissancesBySujet(sujetNom){
    console.log(sujetNom);
    let connaissancessSujet: Question []= [];;
      this.questions.forEach(connaissance => {
        connaissance.tag.forEach(element => {
          if(element.nom==sujetNom){
            connaissancessSujet.push(connaissance)
          }
        });
      });
   
   this.questions= connaissancessSujet
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
    this.questionService.getRecentQuestions().subscribe((questions) => {
      this.questions = questions;
    });
  }

  getRatedQuestions(){
    this.voteService.getRatedReponses().subscribe((response)=>{

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
