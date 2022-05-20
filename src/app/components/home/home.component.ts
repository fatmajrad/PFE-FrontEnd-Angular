import { QuestionService } from './../../services/question.service';
import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    model = {
        left: true,
        middle: false,
        right: false
    };

    focus;
    focus1;
    questions : Question[]
    constructor(private questionService :QuestionService) { }

    ngOnInit() {
        this.getRecentQuestions();
    }

    getRecentQuestions() {
        this.questionService.listeValidatedQuestions().subscribe((questions) => {
          this.questions = questions;
        });
      }

      toArray(answers: object) {
        return Object.keys(answers).map((key) => answers[key]);
      }
    
}
