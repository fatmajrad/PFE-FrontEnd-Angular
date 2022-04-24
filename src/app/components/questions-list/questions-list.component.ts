import { SujetService } from './../../services/sujet.service';
import { Sujet } from 'src/app/models/sujet.model';
import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question.model';
import { User } from 'src/app/models/user.model';
import { QuestionService } from 'src/app/services/question.service';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute, Route } from '@angular/router';



@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css']
})


export class QuestionsListComponent implements OnInit {
  
  
  questions : Question[];
  sujets:Sujet[];
  user : User;
  constructor(private questionService : QuestionService, private userService : UserService, private sujetService: SujetService, private router:Router) { }

  ngOnInit(): void {
    this.questionService.listeValidatedQuestions().subscribe(questions => {
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

  /*onSelect(question){
    console.log(question);
    this.router.navigate(['reponse-list/'+question.id]);
    console.log("okay")
    //this.router.navigateByUrl('reponse-list/'+question.id);
  }*/
}
