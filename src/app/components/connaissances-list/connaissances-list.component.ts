import { ConnaissanceService } from './../../services/connaissance.service';
import { CommentaireService } from './../../services/commentaire.service';
import { SujetService } from './../../services/sujet.service';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Sujet } from 'src/app/models/sujet.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Connaissance } from 'src/app/models/connaissance.modal';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import { Commentaire } from 'src/app/models/commentaire.model';



@Component({
  selector: 'app-connaissances-list',
  templateUrl: './connaissances-list.component.html',
  styleUrls: ['./connaissances-list.component.css']
})
export class ConnaissancesListComponent implements OnInit {

  closeResult: string;
  sujets : Sujet[];
  connaissances: Connaissance[];
  formControl = new FormControl();
  addConnaissanceForm: FormGroup;
  updateConnaissanceForm: FormGroup;
  currentConnaissance : Connaissance;
  commentaire = new Commentaire()
  showComments : boolean=false;
  addConnaissanceCommentaire: FormGroup;
  constructor( private modalService: NgbModal, private sujetService:SujetService,private formBuilder: FormBuilder,
              private authService:AuthService, private commentaireService:CommentaireService, private connaissanceService :ConnaissanceService ) { }

  ngOnInit(): void {
    this.getConnaissances();
    this.sujetService.listeSujet().subscribe(sujets => {
      this.sujets = sujets;
    });
    this.initAddForm();
    this.initUpdateForm();
    this.initAddCommentaire();
  }

  toArray(answers: object) {
    return Object.keys(answers).map(key => answers[key])
  }

  initAddForm() {
    this.addConnaissanceForm = this.formBuilder.group({
      sujet: [''],
      contenu: [''],
    });
  }
 
  initUpdateForm() {
    this.updateConnaissanceForm = this.formBuilder.group({
      sujet: [''],
      contenu: [''],
    });
  }
  
  initAddCommentaire(){
    this.addConnaissanceCommentaire = this.formBuilder.group({
      commentaire: [''],
    });
  }


  addConnaissance(){
  this.authService.getCurrentUserId();
  let formattedDate = (moment(new Date())).format('DD-MMM-YYYY HH:mm:ss').toString();
  console.log(formattedDate);
  let connaissance={
    "contenuConnaissance": this.addConnaissanceForm.get('contenu').value,
    "user": "/api/users/"+this.authService.getCurrentUserId(),
    "sujet": [
      "/api/sujets/9"
    ],
    "statutValidation": true,
    "createdAt": formattedDate,
    "updatedAt": null
  };
  console.log(connaissance);
  }

  updateConnaissance(){

  }
  getConnaissances(){
    this.connaissanceService.getConnaissance().subscribe(connaissances => {
      this.connaissances = connaissances;})
    console.log(this.connaissances)
  }

  addCommentaire(id: Number) {
    console.log(id);

    let commentaire =
    {
      "contenu": this.addConnaissanceCommentaire.get('commentaire').value,
      "user": "/api/users/" + this.authService.getCurrentUserId(),
      "reponse": null,
      "connaissance": "/api/connaissances/"+id
    }
    console.log(commentaire)
    this.commentaireService.addCommentaire(commentaire).subscribe((response) => {this.getConnaissances(); this.showCommentsSection()});
  }

  showCommentsSection(){
    if(this.showComments){
      this.showComments=false;
    }else{
      this.showComments=true;
    }
  }
  
  open(content,type,connaissance) {
  this.currentConnaissance=connaissance;
  if(type=='addConnaissance'){
      this.modalService
        .open(content, { size: 'lg', centered: true, ariaLabelledBy: "add-connaissance"})
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") {
             this.addConnaissance();
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
         console.log("updtaeConnassance")
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
