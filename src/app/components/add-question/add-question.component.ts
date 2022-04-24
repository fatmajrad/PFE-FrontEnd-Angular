import { Observable } from 'rxjs';

import { QuestionService } from './../../services/question.service';
import { SujetService } from './../../services/sujet.service';
import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question.model';
import { Sujet } from 'src/app/models/sujet.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {
  focus;
  focus1;
  newQuestion = new Question();
  sujets: Sujet[];
  formControl = new FormControl();
  addQuestionForm: FormGroup;
  closeResult: string;
  quillEditor={
     height:'300px'
  }
  type: string;
  strong: string;
  message: string;
  showAlertsucces = false;
  showAlerterror = false;
  constructor(private sujetService: SujetService, private router: Router, private modalService: NgbModal, private formBuilder: FormBuilder, private authService: AuthService, private questionService: QuestionService) { }

  ngOnInit(): void {
    this.initForm();
    this.sujetService.listeSujet().subscribe(sujets => {
      this.sujets = sujets;

    });
  }

  initForm() {
    this.addQuestionForm = this.formBuilder.group({
      intituleQuestion: [''],
      descriptionQuestion: [''],
      sujet: [''],
    });


  }


  isValid(desc: any) {
    return true;
  }

  AjouterQuestion() {
    console.log(this.authService.getCurrentUserId());
    let question = {
      "intituleQuestion": this.addQuestionForm.get('intituleQuestion').value,
      "descriptionQuestion": this.addQuestionForm.get('descriptionQuestion').value,
      "tag": [
        "/api/sujets/9"
      ],
      "user": "/api/users/"+this.authService.getCurrentUserId(),
      "brouillon": true,
      "statutValidation": false
    }
    console.log(question);
    this.questionService.addQuestion(question).subscribe((response) => {console.log(response)});
    this.router.navigate(['mes-questions']);}

  close() {
    this.showAlertsucces=false;
    this.showAlertsucces=false;
  }

  Annuler(content) {
    if (this.addQuestionForm.get('intituleQuestion').value === null ||
      this.addQuestionForm.get('descriptionQuestion').value === null||
      this.addQuestionForm.get('sujet').value === null) {
        this.open(content);
    }
    else {
      this.router.navigate(["/mes-questions"]);
    }
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") {
            this.router.navigate(["/mes-questions"]);
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );

      }
    
    private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

}
