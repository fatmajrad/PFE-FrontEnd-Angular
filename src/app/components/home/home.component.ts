import { ReponseService } from './../../services/reponse.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReclamationService } from "./../../services/reclamation.service";
import { ConnaissanceService } from "./../../services/connaissance.service";
import { QuestionService } from "./../../services/question.service";
import { Component, OnInit } from "@angular/core";
import { Question } from "src/app/models/question.model";
import { SujetService } from "src/app/services/sujet.service";
import { Connaissance } from "src/app/models/connaissance.modal";
import { Sujet } from "src/app/models/sujet.model";
import { UserService } from 'src/app/services/user.service';
import { Reponse } from 'src/app/models/reponse.model';



@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  model = {
    left: true,
    middle: false,
    right: false,
  };
  type: string;
  strong: string;
  message: string;
  showAlertsucces = false;
  showAlerterror = false;

  focus;
  focus1;
  questions: Question[]=[];
  connaissances: Connaissance[] = [];
  sujets: Sujet[] = [];
  reclamationForm : FormGroup;
  propOne: any;
  reponses: Reponse[] = [];
  constructor(
    private reclamationService: ReclamationService,
    private questionService: QuestionService,
    private connaissanceService: ConnaissanceService,
    private sujetService: SujetService,
    private formBuilder : FormBuilder,
    private authService:AuthService,
    private router : Router,
    private userService : UserService,
    private reponseService:ReponseService
  ) {
    
  }

  ngOnInit() {
    this.getRecentQuestions();
    this.getRecentConnaissances();
    this.getBestSujets();
    this.initReclamationForm();
    this.userService.countAllUsers().subscribe((response)=>{
      this.propOne=response
    })
    this.reponseService.getReponse().subscribe((response)=>{
      this.reponses = response
    })
  }
  getRecentConnaissances() {
    this.connaissanceService.getRecentConnaissances().subscribe((response) => {
      this.connaissances.push(response[0]);
      this.connaissances.push(response[1]);
      this.connaissances.push(response[2]);
    });
  }

  getRecentQuestions() {   
    this.questionService.listeValidatedQuestions().subscribe((response) => {
      this.questions=response
    });
  }

  getBestSujets() {
    this.sujetService.listeSujet().subscribe((sujets) => {
      this.sujets.push(sujets[0]);
      this.sujets.push(sujets[1]);
      this.sujets.push(sujets[2]);
      this.sujets.push(sujets[3]);
    });
  }

  toArray(answers: object) {
    return Object.keys(answers).map((key) => answers[key]);
  }

  sendReclamation(){
  let reclamation= this.reclamationForm.value;
  this.reclamationService.addReclamation(reclamation).subscribe((response)=>{
    this.initReclamationForm()
    this.type="success";
    this.message="Votre message a été envoyé avec succées";
    this.showAlertsucces=true;
    setTimeout(()=>{this.close()},3000);
  });
  }

  askQuestionButton(){
    if(this.authService.isloggedIn){
      this.router.navigate(['/add-question'])
    }else{this.router.navigate(['/login'])} 
  }
  
  initReclamationForm(){
    this.reclamationForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(10)]],
      UserEmail: ['',[Validators.required,Validators.email]],
      description: ['',[Validators.required, Validators.minLength(20)]]
    });
  }
  close() {
    this.showAlertsucces = false;
    this.showAlertsucces = false;
  }
}
