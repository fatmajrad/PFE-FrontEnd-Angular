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
  
  totaLElement: Number;
  page1: Number =1;

  totaLPublished: Number;
  page2:Number=1;

  totaLRequests: Number;
  page3:Number=1;

  totaLbrouillons: Number;
  page4:Number=1;

  totaLInvalid: Number;
  page5:Number=1;
  
  sujets:Sujet[]=[];
  sujet : any;
  user : User;
  currentUser:Number;
  closeResult: string;
  formControl = new FormControl();
  filteredOptions: Observable<any[]>;
  searchForm : FormGroup
  sujetId:Number=0
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
  
   ngOnInit() {
    this.getCurrentUser();
    this.getAllQuestions();
    this.initSearchForm();
    this.getMyDrafts();
    this.getMyInvalidQuestions();
    this.getMyPublished();
    this.getMyQuestionqRequests();
    this.sujetService.listeSujet().subscribe((response)=>{
      this.sujets=response
    })
    
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
      intitule: [''],
      sujet:[]
    });
  } 

   
  toArray(answers: object) {
    return Object.keys(answers).map(key => answers[key])
  }
  getAllQuestions(){
    this.questionService.listMyQuestions(this.currentUser).subscribe((questions)=>{
      this.questions=questions;
      this.totaLElement=questions.length
      this.page1=1})
  }
  getQuestions(){
    let intitule = this.searchForm.get('intitule').value
    
    if(this.sujetId===0 && intitule!=""){
     this.questionService.getMyQuestionsByIntitule(intitule,this.currentUser).subscribe((questions)=>{
      this.questions=questions;
      this.totaLElement=questions.length
      this.page1=1
        
      })
   }else if(intitule==="" && this.sujetId!=0){
          this.questionService.getMyQuestionsByTag(this.sujetId, this.currentUser).subscribe((questions)=>{
            this.questions=questions;
            this.totaLElement=questions.length
            this.page1=1
    });
    }else if(intitule!="" && this.sujetId!=0){
        this.questionService.getMyQuestionsByIntituleSujet(this.currentUser,this.sujetId,intitule).subscribe((questions)=>{
        this.questions=questions;
        this.totaLElement=questions.length
        this.page1=1
     
    })
    }else{
        this.questionService.listMyQuestions(this.currentUser).subscribe((questions)=>{
        this.questions=questions;
        this.totaLElement=questions.length
        this.page1=1
     })
  }
} 
    getConnaissancesBySujet(event){
      this.sujets.forEach(element =>{
        if(element.nom===event){
            this.sujetId=element.id
        }
       });
    }
  resetSearchForm(){
    this.searchForm.reset();
    this.getAllQuestions();
  }
  getMyDrafts(){
    this.questionService.getMyQuestionsByStatut("draft",this.currentUser).subscribe(questions => {
      this.brouillons = questions;
      this.totaLbrouillons=questions.length
      this.page4=1});
  }
  getMyPublished(){
    this.questionService.getMyQuestionsByStatut("valide",this.currentUser).subscribe(questions => {
      this.published = questions;
      this.totaLPublished=questions.length
    this.page2=1});
  }
  getMyQuestionqRequests(){
    this.questionService.getMyQuestionsByStatut("onHold",this.currentUser).subscribe(questions => {
      this.requests = questions;
      this.totaLRequests=questions.length
      this.page3=1});
  }
  getMyInvalidQuestions(){
    this.questionService.getMyQuestionsByStatut("invalide",this.currentUser).subscribe(questions => {
      this.invalidQ = questions;
    this.totaLInvalid=questions.length
      this.page5=1});
     
  }
  
  
  getUser(id : number){
    return this.userService.getUserById(id);
   
  }

  getSujet(id:number){
    return this.sujetService.getSujetById(id);
  }

  getCurrentUser(){
   this.currentUser= this.authService.getCurrentUserId();
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
     
      this.modalService
      .open(content, {centered: true, ariaLabelledBy: "delete-connaissance"})
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
