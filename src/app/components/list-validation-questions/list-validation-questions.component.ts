import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Question } from 'src/app/models/question.model';
import { Sujet } from 'src/app/models/sujet.model';
import { User } from 'src/app/models/user.model';
import { IAlert } from 'src/app/sections/alerts-section/alerts-section.component';
import { QuestionService } from 'src/app/services/question.service';
import { SujetService } from 'src/app/services/sujet.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-validation-questions',
  templateUrl: './list-validation-questions.component.html',
  styleUrls: ['./list-validation-questions.component.css']
})
export class ListValidationQuestionsComponent implements OnInit {
  showAlertsucces = false;
  showAlerterror = false;
  questions : Question[];
  sujets:Sujet[];
  user : User;
  currentQuestion :Question;
  declineQuestionForm : FormGroup;
  searchForm : FormGroup
    type: string;
    strong: string;
    message: string;
    closeResult: string;
  public alert: IAlert;
  constructor( private formBuilder: FormBuilder,private modalService: NgbModal, private questionService : QuestionService, private userService : UserService, private sujetService: SujetService, private router:Router) {
    
  }

  ngOnInit(): void {
    this.getAllquestions();
    this.initSearchForm();
    this.initDeclineForm();
  }

  getAllquestions(){
    this.questionService.listeQuestion().subscribe(questions => {
      this.questions = questions;    
    });
  }
  getQuestionsBystatus(statut){
    console.log(statut);
    
    this.questionService.getQuestionsByStatut(statut).subscribe((questions)=>{
      this.questions=questions
      console.log(this.questions,statut);
      
    })
  }
  initSearchForm() {
    this.searchForm= this.formBuilder.group({
      intitule: ['',Validators.required],
    });
  }
  
  initDeclineForm(){
    //let remarqueQuestion : String = this.currentQuestion.remarque;
    this.declineQuestionForm = this.formBuilder.group({
      remarqueQuestion:['']
    });
  }

  getQuestionIntitule(){
    this.getQuestionsByIntitule(this.searchForm.get('intitule').value);
  }
  getQuestionsByIntitule(intitule){
   this.questionService.getQuestionsByIntitule(intitule).subscribe((questions)=>{
     this.questions=questions
   })
  }

  onEditClick(statut: any) {
    if(statut=='Invalide'){
       console.log(statut);
      
       this.getQuestionsBystatus('invalide');
    }else if(statut=='Valide'){
     console.log(statut);
       this.getQuestionsBystatus('valide');
    }else if(statut=='En attente'){
     console.log(statut);
       this.getQuestionsBystatus('onHold');
    }else{
     console.log(statut);
       this.getAllquestions();
    }
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

  validateQuestion(q: Question) {
    this.questionService.validateQuestion(q.id).subscribe({
      next:(res)=>{ 
       this.type="success";
       this.message="question Validée avec succées";
       this.showAlertsucces=true;
       this.getAllquestions();
      
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="Erreur avecla validation";
        }
    });
  }
 

  declineQuestion(q: Question) {
   let body={
     "remarque":this.declineQuestionForm.get('remarqueQuestion').value
   }
   this.questionService.declineQuestion(q.id).subscribe({
      next:(res)=>{ 
        this.questionService.updateQuestion(body,q.id).subscribe({next:(res)=>{
          this.type="success";
          this.message="La question est réfusée";
          this.showAlertsucces=true;
          this.getAllquestions();
        }
        }); 
       },
         error:()=>{
           this.showAlerterror=true;
           this.type="error";
           this.message="Probleme avec le refus";
         }
     });
   }
  close() {
    this.showAlertsucces=false;
    this.showAlertsucces=false;
  }

  deleteQuestion(){
    console.log("innnnn");
  }

  open(content, type,question) {
    this.currentQuestion=question;
     if (type === 'delete-question') {
      this.modalService
      .open(content, { ariaLabelledBy: "confirm-delete" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") { 
            this.deleteQuestion();
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }else if (type === 'detailsQuestion') {
      this.modalService
      .open(content, { ariaLabelledBy: "details-question" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }else if (type == 'rejectQuestion') {
      console.log(type);
      
      this.initDeclineForm();
      this.modalService
      .open(content, { ariaLabelledBy: "confirm-rejection" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") { 
            console.log("reject")
           this.declineQuestion(question);
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }else{
        this.modalService
        .open(content, { ariaLabelledBy: "confirm-accaptance" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") { 
             console.log("validtae")
             this.validateQuestion(question);
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
      

    }
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
