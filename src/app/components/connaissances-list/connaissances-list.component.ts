import { CommentaireService } from 'src/app/services/commentaire.service';
import { Commentaire } from './../../models/commentaire.model';
import { ConnaissanceService } from "./../../services/connaissance.service";

import { SujetService } from "./../../services/sujet.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Sujet } from "src/app/models/sujet.model";
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
  selector: "app-connaissances-list",
  templateUrl: "./connaissances-list.component.html",
  styleUrls: ["./connaissances-list.component.css"],
})
export class ConnaissancesListComponent implements OnInit {
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
  btnType;
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
  updateConnaissanceCommentaire:FormGroup;
  filteredOptions: Observable<any[]>;
  currentCommentaire : any ;
  sujetForm: FormGroup;
  currentUserId: Number
  totalElement: Number 
  page : number =1
  modules = {}
 
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
    private voteService: VoteService
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
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(""),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val) => {
        return this.filter(val || "");
      })
    );
  }


  ngOnInit(): void {
    this.getConnaissances();
    this.sujetService.listeSujet().subscribe((sujets) => {
      this.sujets = sujets;
      this.sujets.forEach((element) => {
        this.allFruits.push(element.nom);
      });
    });
    this.initAddForm();
    this.initAddCommentaire();
    this.initSujetForm();
    this.currentUserId = this.authService.getCurrentUserId();
  }

  initAddForm() {
    this.addConnaissanceForm = this.formBuilder.group({
      sujet: [""],
      contenu:  ["", [Validators.required, Validators.minLength(20)]],
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

  initSujetForm() {
    this.sujetForm = new FormGroup(
      {
        sujet: new FormControl()
      }
    )
  }
  resetSearchForm(){
    this.sujetForm.reset();
    this.getConnaissances();
  }

  filter(val: string): Observable<any[]> {
    return this.sujetService.getSujetAuto().pipe(
      map((response) =>
        response.filter((option) => {
          return option.nom.toLowerCase().indexOf(val.toLowerCase()) === 0;
        })));
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
  getConnaissances() {
    this.connaissanceService.getConnaissance().subscribe((connaissances) => {
      this.connaissances = connaissances;
      this.totalElement=connaissances.length;
    });
  }
  getConnaissancesBySujet(sujetNom) {
    let connaissancessSujet: Connaissance[] = [];;
    this.connaissances.forEach(connaissance => {
      connaissance.sujet.forEach(element => {
        if (element.nom == sujetNom) {
          connaissancessSujet.push(connaissance)
        }
      });
      this.connaissances = connaissancessSujet;
      this.totalElement=connaissancessSujet.length;
      this.page=1;
    });
  }

  getRatedConnaissances() {
    let ratedConnaissances: Connaissance[] = [];
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
    })
  }

  getRecentConnaissances() {
    this.connaissanceService.getRecentConnaissances().subscribe((response) => {
      this.connaissances = response;
      this.totalElement=response.length;
      this.page=1;
    })
  }

  addConnaissance() {
    let tags :any[] =[]
    this.fruits.forEach(fruit => {
      this.sujets.forEach(sujet => {
        if(fruit == sujet.nom){
          let id = "/api/sujets/"+sujet.id
          tags.push(id)
        }
      });
    }); 
    let connaissance = {
      contenuConnaissance: this.addConnaissanceForm.get("contenu").value,
      user: "/api/users/" + this.authService.getCurrentUserId(),
      sujet: tags,
      statut: "valide",
    };
    this.connaissanceService
      .addConnaissance(connaissance)
      .subscribe({
        next:(res)=>{
          this.getConnaissances();
          this.type="success";
          this.message="Connaissance partagée avec succées";
          this.showAlertsucces=true;
      
        },
          error:()=>{
            this.showAlerterror=true;
            this.type="error";
            this.message="Le partage de la connaissance a echoué";
          }
      });
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
          this.getConnaissances();
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
    this.commentaireService
      .addCommentaire(commentaire)
      .subscribe({
        next:(res)=>{  
          this.initAddCommentaire();
          this.getConnaissances();
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
        this.getConnaissances();
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
      this.getConnaissances();
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
        this.getConnaissances(); 
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
          this.getConnaissances()
        });
      } else{
        if(response[0].typeVote===true){
          this.voteService.deleteVote(response[0].id).subscribe((response)=>{
            this.getConnaissances()
          });
        }else {
          let vote={
            "typeVote":true
          }
          this.voteService.updateVote(vote,response[0].id).subscribe((response)=>{
            this.getConnaissances()
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
          this.getConnaissances()
        });
      } else{
        if(response[0].typeVote===false){
          this.voteService.deleteVote(response[0].id).subscribe((response)=>{
            this.getConnaissances()
            
          });
       
        }else  {
          let vote={
            "typeVote":false
          }
          this.voteService.updateVote(vote,response[0].id).subscribe((response)=>{
            this.getConnaissances()
            
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
            this.fruits=[];
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (type == "update-commentaire") {

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
            this.updateCommentaire(commentaire.id)
            
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }else if (type == "delete-commentaire") {

      this.initUpdateForm();
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
    } else {
      this.modalService
        .open(content, {
          centered: true,
          ariaLabelledBy: "delete-connaissance",
        })
        .result.then(
          (result) => {
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
