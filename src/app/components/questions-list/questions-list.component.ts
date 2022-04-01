import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question.model';
import { User } from 'src/app/models/user.model';
import { QuestionService } from 'src/app/services/question.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css']
})
export class QuestionsListComponent implements OnInit {
  
  questions : Question[];
  user : User;
  constructor(private questionService : QuestionService, private userService : UserService) { }

  ngOnInit(): void {
    this.questionService.listeQuestion().subscribe(questions => {
      this.questions = questions;
      });
  }

  getUserName(id : number){
    console.log(this.userService.getUserById(id));
    return this.userService.getUserById(id);
  }

}
