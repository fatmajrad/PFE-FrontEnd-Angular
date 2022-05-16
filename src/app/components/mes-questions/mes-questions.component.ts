import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbPaginationNumber } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
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
  closeResult: string;
  formControl = new FormControl();
  filteredOptions: Observable<any[]>;
  sujetForm: FormGroup;
  searchForm : FormGroup
  constructor(private questionService : QuestionService,private modalService: NgbModal,private formBuilder: FormBuilder, private userService : UserService, private sujetService: SujetService, private router:Router,private authService:AuthService) { 
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
            return this.filter(val || '')
       }) 
    )
  }
  
  async ngOnInit(): Promise<void> {
    this.getCurrentUser();
    this.currentUser= await this.authService.getCurrentUserId();
    this.questions = await this.questionService.listMyQuestions(this.currentUser).toPromise();
    this.initSearchForm();
    this.getMyDrafts();
    this.getMyInvalidQuestions();
    this.getMyPublished();
    this.getMyQuestionqRequests();
    this.initSujetForm();
  
  }
  
  filter(val: string): Observable<any[]> {
    // call the service which makes the http-request
    return this.sujetService.getSujetAuto()
     .pipe(
       map(response => response.filter(option => { 
         return option.nom.toLowerCase().indexOf(val.toLowerCase()) === 0
       }))
     )
   }
   initSearchForm() {
    this.searchForm= this.formBuilder.group({
      intitule: ['',Validators.required],
    });
  } 

  getQuestionIntitule(){
    console.log(this.searchForm.get('intitule').value);
    this.getQuestionsByIntitule(this.searchForm.get('intitule').value);
  }

  getQuestionsByIntitule(intitule){
   this.questionService.getMyQuestionsByIntitule(intitule,this.currentUser).subscribe((questions)=>{
     console.log(questions);
     
   })
  }
  
  initSujetForm() {
    this.sujetForm = new FormGroup(
      {
        sujet : new FormControl()
      }
    )
    /*this.sujetForm = this.formBuilder.group({
      sujet: ['',Validators.required],
    });*/
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

  getCurrentUser(){
    return this.authService.getCurrentUserId();
    
  }

  
  getMyDrafts(){
    this.questionService.getMyQuestionsByStatut("draft",this.currentUser).subscribe(questions => {
      this.brouillons = questions;});
  }
  

  getMyPublished(){
    this.questionService.getMyQuestionsByStatut("valide",this.currentUser).subscribe(questions => {
      this.published = questions;});
  }

  getMyQuestionqRequests(){
    this.questionService.getMyQuestionsByStatut("onHold",this.currentUser).subscribe(questions => {
      this.requests = questions;});
  }

  getMyInvalidQuestions(){
    this.questionService.getMyQuestionsByStatut("invalide",this.currentUser).subscribe(questions => {
      this.invalidQ = questions;});
      console.log(this.invalidQ);
  }

  publier(id:Number){
    this.questionService.publishQuestion(id).subscribe(
      (response)=>{this.questionService.listMyQuestions(this.currentUser)}
    ) 
   }

  deleteQuestions(id:Number){
   this.questionService.deleteQuestion(id).subscribe(
     (response)=>{this.questionService.listMyQuestions(this.currentUser)}
   ) 
  }

  open(content,type,question) {
    if(type=='deletequestion'){
        this.modalService
          .open(content, { size: 'sm', centered: true, ariaLabelledBy: "delete-question"})
          .result.then(
            (result) => {
              this.closeResult = `Closed with: ${result}`;
              if (result === "yes") {
                this.deleteQuestions(question.id);
              }
            },
            (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
          );
    }else if(type =='updateConnaissance'){
      this.modalService
      .open(content, { size: 'lg', centered: true, ariaLabelledBy: "update-connaissance"})
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") {
          
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }else{
      console.log("deleteconnaissance1")
      this.modalService
      .open(content, {centered: true, ariaLabelledBy: "delete-connaissance"})
      .result.then(
        (result) => {
          console.log("deleteconnaissance2")
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") {
           console.log("deleteconnaissance3")
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }}
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
