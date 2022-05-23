import { element } from 'protractor';
import { Vote } from 'src/app/models/vote.model';
import { Reponse } from "src/app/models/reponse.model";
import { ConnaissanceService } from "./../../services/connaissance.service";
import { CommentaireService } from "./../../services/commentaire.service";
import { SujetService } from "./../../services/sujet.service";
import { Component, OnInit } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Sujet } from "src/app/models/sujet.model";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Connaissance } from "src/app/models/connaissance.modal";
import { AuthService } from "src/app/services/auth.service";
import * as moment from "moment";
import { Commentaire } from "src/app/models/commentaire.model";
import { Observable } from "rxjs";
import {COMMA, ENTER} from '@angular/cdk/keycodes'; 
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from "rxjs/operators";
import { VoteService } from "src/app/services/vote.service";
import { convertCompilerOptionsFromJson } from 'typescript';

@Component({
  selector: "app-connaissances-list",
  templateUrl: "./connaissances-list.component.html",
  styleUrls: ["./connaissances-list.component.css"],
})
export class ConnaissancesListComponent implements OnInit {
  closeResult: string;
  sujets: Sujet[];
  connaissances: Connaissance[];
  formControl = new FormControl();
  addConnaissanceForm: FormGroup;
  updateConnaissanceForm: FormGroup;
  currentConnaissance: Connaissance;
  commentaire = new Commentaire();
  showComments: boolean = false;
  addConnaissanceCommentaire: FormGroup;
  filteredOptions: Observable<any[]>;
  separatorKeysCodes: number[] =  [ENTER, COMMA];
  sujetForm : FormGroup;
  currentUserId : Number

  
  
  constructor(
    private modalService: NgbModal,
    private sujetService: SujetService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private commentaireService: CommentaireService,
    private connaissanceService: ConnaissanceService,
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


  ngOnInit(): void {
  
    this.getConnaissances();
    this.sujetService.listeSujet().subscribe((sujets) => {
      this.sujets = sujets;
    });
    this.initAddForm();
  
    this.initAddCommentaire();
    this.initSujetForm();
    this.currentUserId=this.authService.getCurrentUserId();
  }

  toArray(answers: object) {
    return Object.keys(answers).map((key) => answers[key]);
  }

  initAddForm() {
    this.addConnaissanceForm = this.formBuilder.group({
      sujet: [""],
      contenu: [""],
    });
  }

  initUpdateForm() {
    let contenu: String = this.currentConnaissance.contenuConnaissance;
    let sujetc: String = "sujet";
    let sujetsObject = this.toArray(this.currentConnaissance.sujet);
    let sujets=[]
    sujetsObject.forEach(element => {
      sujets.push(element.nomSujet);
    })
    console.log(sujets);
    this.updateConnaissanceForm = this.formBuilder.group({
      sujet: [sujetc],
      contenu: [contenu],
    });
  }

  initAddCommentaire() {
    this.addConnaissanceCommentaire = this.formBuilder.group({
      commentaire: [""],
    });
  }
  countNumberVotes(connaissance : any, typeVote){
    let allVotes = connaissance.votes;
    let x =0;
    allVotes.forEach(vote => {
      if(vote.typeVote ===typeVote){
        x=x+1
      }
    });
    return x;
  }

  addConnaissance() {
    this.authService.getCurrentUserId();
    let connaissance = {
      contenuConnaissance: this.addConnaissanceForm.get("contenu").value,
      user: "/api/users/" + this.authService.getCurrentUserId(),
      sujet: ["/api/sujets/16"],
      statut: "valide",
    };
    this.connaissanceService
      .addConnaissance(connaissance)
      .subscribe((response) => {
        this.getConnaissances();
      });
  }

  updateConnaissance(connaissance, id) {
    this.connaissanceService
      .updateConnaissance(connaissance, id)
      .subscribe((response) => {
        this.getConnaissances();
        console.log(response);
      });
  }

  getConnaissances() {
    this.connaissanceService.getConnaissance().subscribe((connaissances) => {
      this.connaissances = connaissances;
    });
  }

  addCommentaire(id: Number) {
    let commentaire = {
      contenu: this.addConnaissanceCommentaire.get("commentaire").value,
      user: "/api/users/" + this.authService.getCurrentUserId(),
      reponse: null,
      connaissance: "/api/connaissances/" + id,
    };
    console.log("commentaire", commentaire);
    this.commentaireService
      .addCommentaire(commentaire)
      .subscribe((response) => {
        this.getConnaissances();
        this.showCommentsSection();
      });
  }

  showCommentsSection() {
    if (this.showComments) {
      this.showComments = false;
    } else {
      this.showComments = true;
    }
  }

  likeConnaissance(connaissance : Connaissance) {
    this.voteService.getConnaissanceVote(this.currentUserId,connaissance.id).subscribe((response)=>{
      if(response.length==0){
        let vote = {
          "typeVote": true,
          "user": "/api/users/"+this.currentUserId,
          "Connaissance": "/api/connaissances/"+connaissance.id,
          "Question": null,
          "Reponse": null
        }
        this.voteService.addLike(vote).subscribe((response) => {console.log(response),
         this.countNumberVotes(connaissance,true)});
      }else{
        console.log("delete");
        this.voteService.deleteVote(response[0].id);
      }  
    })
  }
  dislikeConnaissance(connaissance : Connaissance) {
    this.voteService.getConnaissanceVote(this.currentUserId,connaissance.id).subscribe((response)=>{
      if(response.length==0){
        let vote = {
          "typeVote": false,
          "user": "/api/users/"+this.currentUserId,
          "Connaissance": "/api/connaissances/"+connaissance.id,
          "Question": null,
          "Reponse": null
        }
        this.voteService.addLike(vote).subscribe((response) => console.log(response));
      }else{
        if(response[0].typeVote==true){
          console.log("vous aves deja un vote");
          
        }else{
          console.log("delete");
          this.voteService.deleteVote(response[0].id);
        }
       
      }  
    })
  }

  getConnaissancesBySujet(sujetNom){
    console.log(sujetNom);
    let connaissancessSujet: Connaissance []= [];;
      this.connaissances.forEach(connaissance => {
        connaissance.sujet.forEach(element => {
          if(element.nom==sujetNom){
            connaissancessSujet.push(connaissance)
          }
        });
        this.connaissances= connaissancessSujet
      });
  }

  getRatedConnaissances(){
    console.log("les plus meriele");
    
    let ratedConnaissances : Connaissance[]=[];
    this.voteService.getRatedConnaissances().subscribe((response)=>{
      response.forEach(element => {
        this.connaissances.forEach(connaissance => {
          if(connaissance.id === element.Connaissance.id){
            ratedConnaissances.push(connaissance)
          }
        });
      });
     this.connaissances=ratedConnaissances;
    })
  }

  getRecentConnaissances(){
    this.connaissanceService.getRecentConnaissances().subscribe((response)=>{
      console.log(response);
      this.connaissances=response
    })
  }

  open(content, type, connaissance) {
   
    this.currentConnaissance = connaissance;
    if (type == "addConnaissance") {
  
      this.modalService
        .open(content, {
          size: "lg",
          centered: true,
          ariaLabelledBy: "add-connaissance",
        })
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
    } else if (type == "updateConnaissance") {
     
      this.initUpdateForm();
      this.modalService
        .open(content, {
          size: "lg",
          centered: true,
          ariaLabelledBy: "update-connaissance",
        })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") {
              this.updateConnaissance(connaissance, connaissance.id);
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else {
      console.log("deleteconnaissance1");
      this.modalService
        .open(content, {
          centered: true,
          ariaLabelledBy: "delete-connaissance",
        })
        .result.then(
          (result) => {
            console.log("deleteconnaissance2");
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") {
              console.log("deleteconnaissance3");
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
