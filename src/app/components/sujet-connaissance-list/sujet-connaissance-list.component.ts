import { Sujet } from './../../models/sujet.model';
import { Question } from './../../models/question.model';
import { ActivatedRoute } from '@angular/router';
import { CommentaireService } from 'src/app/services/commentaire.service';
import { Commentaire } from './../../models/commentaire.model';
import { ConnaissanceService } from "./../../services/connaissance.service";

import { SujetService } from "./../../services/sujet.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Connaissance } from "src/app/models/connaissance.modal";
import { AuthService } from "src/app/services/auth.service";

import { Observable } from "rxjs";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from "rxjs/operators";
import { VoteService } from "src/app/services/vote.service";


import { MatAutocomplete, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";

@Component({
  selector: 'app-sujet-connaissance-list',
  templateUrl: './sujet-connaissance-list.component.html',
  styleUrls: ['./sujet-connaissance-list.component.css']
})
export class SujetConnaissanceListComponent implements OnInit {

  @ViewChild("fruitInput") fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = [];
  
  closeResult: string;
  sujets: Sujet[];
  connaissances: any;
  formControl = new FormControl();
  addConnaissanceForm: FormGroup;
  updateConnaissanceForm: FormGroup;
  currentConnaissance: Connaissance;
  commentaire = new Commentaire();
  showComments: boolean = false;
  addConnaissanceCommentaire: FormGroup;
  updateConnaissanceCommentaire:FormGroup;
  filteredOptions: Observable<any[]>;
  currentCommentaire : any ;
  sujetForm: FormGroup;
  currentUserId: Number
  totalElement: Number 
  page : number =1
  modules = {}
  currrentSujet : any;
  
  type: string;
  strong: string;
  message: string;
  showAlertsucces = false;
  showAlerterror = false;


  
  constructor(
    private modalService: NgbModal,
    private sujetService: SujetService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private commentaireService: CommentaireService,
    private connaissanceService: ConnaissanceService,
    private voteService: VoteService,
    private activatedRoute :ActivatedRoute
    ) {
    this.modules={
      blotFormatter: {}
    }
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(""),
      debounceTime(400),
      distinctUntilChanged(),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allFruits.slice()
      )
    );
  }

  
  ngOnInit(): void {
    this.currentUserId=this.authService.getCurrentUserId();
    this.initAddCommentaire();
    this.getConnaissances(this.activatedRoute.snapshot.params.id);
    this.currrentSujet=this.activatedRoute.snapshot.params.id
    this.sujetService.listeSujet().subscribe((response)=>{
     this.sujets=response
      
    })
    this.sujetService.listeSujet().subscribe((sujets) => {
      this.sujets = sujets;
      this.sujets.forEach((element) => {
        this.allFruits.push(element.nom);
      });
    });
  }

  initAddCommentaire() {
    this.addConnaissanceCommentaire = this.formBuilder.group({
      commentaire:  ["", [Validators.required, Validators.minLength(20)]],
    });
  }
  initUpdateCommentaire() {
    let contenu :String = this.currentCommentaire.contenu
    this.updateConnaissanceCommentaire = this.formBuilder.group({
      commentaire:  [contenu, [Validators.required, Validators.minLength(20)]],
    });
  }
  initUpdateForm() {
    let contenu: String = this.currentConnaissance.contenuConnaissance;
   
    let sujetsObject = this.toArray(this.currentConnaissance.sujet);
    let sujets =this.currentConnaissance.sujet
    sujets.forEach(element => {
      this.fruits.push(element.nom);
    })
  
    this.updateConnaissanceForm = this.formBuilder.group({
      sujet: [],
      contenu: [contenu, [Validators.required, Validators.minLength(20)]],
    });
  }
 

 
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allFruits.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) === 0
    );
    
  }

  toArray(answers: object) {
    return Object.keys(answers).map((key) => answers[key]);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.fruits.push(value.trim());
     
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = "";
    this.fruitCtrl.setValue(null);
  }

  
  
 
  countNumberVotes(connaissance: any, typeVote) {
    let allVotes = connaissance.votes;
    let x = 0;
    allVotes.forEach(vote => {
      if (vote.typeVote === typeVote) {
        x = x + 1
      }
    });
    return x;
  }
  getConnaissances(id) {
    this.connaissanceService.getConnaissancesBySujet(id).subscribe((connaissances) => {
      this.connaissances = connaissances;
      this.totalElement=connaissances.length;
      this.page=1;
    });
  }
  

  getRatedConnaissances() {
    let ratedConnaissances: Connaissance[] = [];
    let idSujet=(this.currrentSujet)
    this.voteService.getRatedConnaissances().subscribe((response) => {
      response.forEach(element => {
        this.connaissances.forEach(connaissance => {
          if (connaissance.id === element.Connaissance.id) {
            ratedConnaissances.push(connaissance)
          }
        });
      });
      this.connaissances = ratedConnaissances;
      this.totalElement=ratedConnaissances.length;
      this.page=1;
    })}

  getRecentConnaissances() {
    console.log(this.currrentSujet);
    let idSujet=(this.currrentSujet)
    let recentConnaissances : Connaissance[]=[];
    let allRecentConnaissances : Connaissance[]=[];
    this.connaissanceService.getRecentConnaissances().subscribe((allConnaissances) => {
      allConnaissances.forEach(Connaissance => {
          Connaissance.sujet.forEach(sujet => {
          let x = sujet.id-this.currrentSujet
          if(x===0){
            allRecentConnaissances.push(Connaissance)
          }
        });  
        this.connaissances=allRecentConnaissances;
        this.totalElement=allRecentConnaissances.length;
        this.page=1;
      });
    })
    }

 
    updateConnaissance(connaissance, id) {
      let tags :any[] =[]
      this.fruits.forEach(fruit => {
        this.sujets.forEach(sujet => {
          if(fruit == sujet.nom){
            let id = "/api/sujets/"+sujet.id
            tags.push(id)
          }
        });
      }); 
      let Connaissance ={
        contenuConnaissance:this.updateConnaissanceForm.get('contenu').value,
        sujet: tags
      }
      this.connaissanceService
        .updateConnaissance(Connaissance, id)
        .subscribe({
          next:(res)=>{ 
            this.getConnaissances(this.currrentSujet);
            this.type="success";
            this.message="Connaissance modifiée avec succées";
            this.showAlertsucces=true;
          },
            error:()=>{
              this.fruits=[];
              this.showAlerterror=true;
              this.type="error";
              this.message="La modification de la connaissance a echoué";
            }
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
      .subscribe({
        next:(res)=>{  
          this.initAddCommentaire();
         this.getConnaissances(this.activatedRoute.snapshot.params.id);
          this.type="success";
          this.message="Commentaire ajouté avec succées";
          this.showAlertsucces=true; 
        },
          error:()=>{
            this.showAlerterror=true;
            this.type="error";
            this.message="L'ajout du commentaire a echoué";
          }
      });
  }
  deleteCommentaire(id){
    this.commentaireService.deleteCommentaire(id).subscribe({
      next:(res)=>{ 
        this.getConnaissances(this.activatedRoute.snapshot.params.id);
        this.type="success";
        this.message="Commentaire supprimé avec succées";
        this.showAlertsucces=true; 
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="La suppression du commentaire a echoué";
        }
    });
}
 deleteConnaissances(id){
  this.connaissanceService.deleteConnaissance(id).subscribe({
    next:(res)=>{ 
      this.getConnaissances(this.activatedRoute.snapshot.params.id);
      this.type="success";
      this.message="connaissance supprimé avec succées";
      this.showAlertsucces=true; 
    },
      error:()=>{
        this.showAlerterror=true;
        this.type="error";
        this.message="La suppression de la connaissance a echoué";
      }
  });
}

  updateCommentaire(id){  
    let commentaire = {
    contenu: this.updateConnaissanceCommentaire.get("commentaire").value,
  };
  this.commentaireService
    .updateCommentaire(commentaire,id)
    .subscribe({
      next:(res)=>{ 
        this.getConnaissances(this.activatedRoute.snapshot.params.id);
        this.type="success";
        this.message="Commentaire modifié avec succées";
        this.showAlertsucces=true; 
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="La modification du commentaire a echoué";
        }
    });
}

  showCommentsSection() {
    if (this.showComments) {
      this.showComments = false;
    } else {
      this.showComments = true;
    }
  }

  likeConnaissance(connaissance: Connaissance) {
    this.voteService.getConnaissanceVote(this.currentUserId, connaissance.id).subscribe((response) => {
      if (response.length == 0) {
        let vote = {
          "typeVote": true,
          "user": "/api/users/" + this.currentUserId,
          "Connaissance": "/api/connaissances/" + connaissance.id,
          "Question": null,
          "Reponse": null
        }
         this.voteService.addLike(vote).subscribe((response) => {
          this.getConnaissances(this.activatedRoute.snapshot.params.id);
        });
      } else{
        if(response[0].typeVote===true){
          this.voteService.deleteVote(response[0].id).subscribe((response)=>{
            this.getConnaissances(this.activatedRoute.snapshot.params.id);
          });
        }else {
          let vote={
            "typeVote":true
          }
          this.voteService.updateVote(vote,response[0].id).subscribe((response)=>{
            this.getConnaissances(this.activatedRoute.snapshot.params.id);
          })
        }
      } 
    })
  }
  
  dislikeConnaissance(connaissance: Connaissance) {
    this.voteService.getConnaissanceVote(this.currentUserId, connaissance.id).subscribe((response) => {
    
      
      if (response.length == 0) {
        let vote = {
          "typeVote": false,
          "user": "/api/users/" + this.currentUserId,
          "Connaissance": "/api/connaissances/" + connaissance.id,
          "Question": null,
          "Reponse": null
        }
        this.voteService.addLike(vote).subscribe((response) => {
          this.getConnaissances(this.activatedRoute.snapshot.params.id);
        });
      } else{
        if(response[0].typeVote===false){
          this.voteService.deleteVote(response[0].id).subscribe((response)=>{
            this.getConnaissances(this.activatedRoute.snapshot.params.id);
            
          });
       
        }else  {
          let vote={
            "typeVote":false
          }
          this.voteService.updateVote(vote,response[0].id).subscribe((response)=>{
            this.getConnaissances(this.activatedRoute.snapshot.params.id);
            
          })
        }
      } 
    })
  }

 checkVote(connaissance,type){
  let test =false; 
  this.voteService.getConnaissanceVote(this.currentUserId, connaissance.id).subscribe((response) => {
   if(response.length===1 && response[0].typeVote===type){
      test = true
   }})
   return test
  }
  close() {
    this.showAlertsucces = false;
    this.showAlertsucces = false;
  }
  open(content, type, connaissance,commentaire) {
    this.currentCommentaire=commentaire;
    this.currentConnaissance = connaissance;
    if(type == "update-commentaire") {

      this.initUpdateCommentaire()
      this.modalService
        .open(content, {
          size: "lg",
          centered: true,
          ariaLabelledBy: "update-commentaire",
        })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") {
            console.log("okay");
            this.updateCommentaire(commentaire.id)
            
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }else if (type == "delete-commentaire") {

     
      this.modalService
        .open(content, {
          size: "s",
          centered: true,
          ariaLabelledBy: "delete-commentaire",
        })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") {
              this.deleteCommentaire(commentaire.id);
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }else if (type == "updateConnaissance") {

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
            this.fruits=[];
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
             this.deleteConnaissances(connaissance.id)
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

