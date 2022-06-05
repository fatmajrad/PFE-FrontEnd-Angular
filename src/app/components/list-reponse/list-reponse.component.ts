
import { VoteService } from './../../services/vote.service';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from './../../services/question.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from 'src/app/models/question.model';
import { AuthService } from 'src/app/services/auth.service';
import { ReponseService } from 'src/app/services/reponse.service';
import { CommentaireService } from 'src/app/services/commentaire.service';
import { Reponse } from 'src/app/models/reponse.model';
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Commentaire } from 'src/app/models/commentaire.model';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Vote } from 'src/app/models/vote.model';


@Component({
  selector: 'app-list-reponse',
  templateUrl: './list-reponse.component.html',
  styleUrls: ['./list-reponse.component.css']
})
export class ListReponseComponent implements OnInit {

  currentQuestion: Question = new Question()
  formControl = new FormControl();
  addReponseCommentaire: FormGroup;
  updateReponseform: FormGroup;
  closeResult: string;
  currentReponse = new Reponse();
  currentCommentaire = new Commentaire();
  reponses: Reponse[]
  id: Number;
  commentairre = new Commentaire()
  length: Number = 0;
  exist: boolean = false;
  currentReponses : Reponse[];
  showComments : boolean=false;
  currentUserId :Number=0;
  numberVotesReponse: Number =0;
  numberVotesCommentaire :Number =0;
  type: string;
  strong: string;
  message: string;
  showAlertsucces = false;
  showAlerterror = false;
  updateConnaissanceCommentaire: FormGroup;
  updateReponseReponseForm : FormGroup
  constructor(private activatedRoute: ActivatedRoute, private reponseService: ReponseService,
    private modalService: NgbModal, private commentaireService: CommentaireService,
    private questionService: QuestionService, private formBuilder: FormBuilder,
    private authService: AuthService, private voteService: VoteService,
    private router :Router) { }


  ngOnInit() {
    this.addReponseCommentaire = this.formBuilder.group({
      reponse: ['',[Validators.required, Validators.minLength(20)]],
      commentaire: [''],
    });
    this.getQuestion();
    this.currentUserId= this.authService.getCurrentUserId();
   
   }

showCommentsSection(){
    if(this.showComments){
      this.showComments=false;
    }else{
      this.showComments=true;
    }
  
}

reponseStyle(reponse){
  let style =""
  if(reponse.statut===true){
    style="background-color:#F0FFF0; margin-top: 20px;"
  }else{
    style="background-color: #eef2ff; margin-top: 20px;"
  }
 
  return style
}
close() {
  this.showAlertsucces = false;
  this.showAlertsucces = false;
}
getQuestion(){
   this.questionService.consulterQuestion(this.activatedRoute.snapshot.params.id).subscribe((response)=>{
    this.currentQuestion=response;
    this.currentReponses=this.currentQuestion.reponses;
    this.id=response.user.id;
   }
   )
}
initUpdateReponse() {
  let content :any = this.currentReponse.contenu
  this.updateReponseReponseForm = this.formBuilder.group({
    contenu:  [, [Validators.required, Validators.minLength(20)]],
  });
}
initUpdateCommentaire() {
  let content :any = this.currentCommentaire.contenu
  this.updateConnaissanceCommentaire = this.formBuilder.group({
    commentaire:  [content, [Validators.required, Validators.minLength(20)]],
  });
}
countNumberVotes(reponse : any, typeVote){
  let allVotes = reponse.votes;
  let x =0;
  allVotes.forEach(vote => {
    if(vote.typeVote ===typeVote){
      x=x+1
      
    }
  });
  return x;
}



  toArray(answers: object) {
    if (answers != null) {
      return Object.keys(answers).map(key => answers[key])
    }
  }

  addReponse() {
    let reponse =
    {
      "contenu": this.addReponseCommentaire.get('reponse').value,
      "user": "/api/users/" + this.currentUserId,
      "Question": "/api/questions/" + this.currentQuestion.id
    }
    this.reponseService.addReponse(reponse).subscribe({
      next:(res)=>{ 
       this.type="success";
       this.message="Réponse supprimée avec succées";
       this.showAlertsucces=true;
       this.getQuestion();
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="L'ajout de la réponse a echoué";
        }
    });
  }
  

  updateReponse(idReponse : Number) {
    this.reponseService.updateReponse(this.updateReponseReponseForm.value, idReponse).subscribe({
      next:(res)=>{ 
       this.type="success";
       this.message="Réponse modifiée avec succées";
       this.showAlertsucces=true;
       this.getQuestion();
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="La modification de la réponse a echoué";
        }
    });
  }

  deleteReponse(reponse: Reponse) {

    this.reponseService.deleteReponse(reponse.id).subscribe({
      next:(res)=>{ 
       this.type="success";
       this.message="Réponse supprimée avec succées";
       this.showAlertsucces=true;
       this.getQuestion();
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="La suppression de la réponse a echoué";
        }
    });

  }


  addCommentaire(id: Number) {
    let commentaire =
    {
      "contenu": this.addReponseCommentaire.get('commentaire').value,
      "user": "/api/users/" + this.currentUserId,
      "reponse": "/api/reponses/" + id
    }
    
    this.commentaireService.addCommentaire(commentaire).subscribe({
      next:(res)=>{ 
       this.type="success";
       this.message="Commentaire ajoutée avec succées";
       this.showAlertsucces=true;
       this.getQuestion();
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="L'ajout du commentaire a echoué";
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
        this.getQuestion();
        setTimeout(()=>{  
        this.type="success";
        this.message="Commentaire modifié avec succées";
        this.showAlertsucces=true; },1000);
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="La modification du commentaire a echoué";
        }
    });
}
deleteCommentaire(id){
  this.commentaireService.deleteCommentaire(id).subscribe({
    next:(res)=>{ 
      setTimeout(()=>{  
      this.getQuestion();
      this.type="success";
      this.message="Commentaire supprimé avec succées";
      this.showAlertsucces=true; },4000);
    },
      error:()=>{
        this.showAlerterror=true;
        this.type="error";
        this.message="La suppression du commentaire a echoué";
      }
  });
}

  
  publier(id:Number){
    this.questionService.publishQuestion(id).subscribe({
      next:(res)=>{ 
       this.type="success";
       this.message="Question publiée avec succées";
       this.showAlertsucces=true;
       setTimeout(()=>{ this.router.navigate(["mes-questions"]); },4000);
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="La publication de la question à echoué a echoué";
        }
    });
  }
  
  deleteQuestions(id:Number){
    this.questionService.deleteQuestion(id).subscribe({
      next:(res)=>{ 
       this.type="success";
       this.message="Question supprimée avec succées";
       this.showAlertsucces=true;
       setTimeout(()=>{ this.router.navigate(["mes-questions"]); },4000);
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="La suppression de la question à echoué a echoué";
        }
    });
  }

 

  acceptReponse(reponse){
    let body={
      "statut":true
    }
    this.reponseService.updateReponse(body,reponse.id).subscribe({
      next:(res)=>{ 
       this.type="success";
       this.message="Réponse acceptée avec succées";
       this.showAlertsucces=true;
       setTimeout(()=>{ this.close() },2000);
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="L'acceptation de la réponse  a echoué";
        }
    });
  }
/*********************************Reponse Votes system*************************************************** */

   likeReponse(reponse : Reponse) {
     
    this.voteService.getReponseVote(this.currentUserId,reponse.id).subscribe((response) => {
      
      if (response.length == 0) {
        let vote = {
          "typeVote": true,
          "user": "/api/users/"+this.currentUserId,
          "Connaissance": null,
          "Question": null,
          "Reponse": "api/reponses/"+reponse.id
        }
         this.voteService.addLike(vote).subscribe((response) => {
          this.getQuestion();
        });
      } else{
        if(response[0].typeVote===true){
          this.voteService.deleteVote(response[0].id).subscribe((response)=>{
            this.getQuestion();
          });
        }else {
          let vote={
            "typeVote":true
          }
          this.voteService.updateVote(vote,response[0].id).subscribe((response)=>{
            this.getQuestion();
          })
        }
      } 
    })
  }
 
  dislikeReponse(reponse:Reponse) {
    this.voteService.getReponseVote(this.currentUserId,reponse.id).subscribe((response) => {
      if (response.length == 0) {
        let vote = {
          "typeVote": false,
          "user": "/api/users/"+this.currentUserId,
          "Connaissance": null,
          "Question": null,
          "Reponse": "api/reponses/"+reponse.id
        }
         this.voteService.addLike(vote).subscribe((response) => {
          this.getQuestion();
        });
      } else{
        if(response[0].typeVote===false){
          this.voteService.deleteVote(response[0].id).subscribe((response)=>{
            this.getQuestion();
          });
        }else {
          let vote={
            "typeVote":false
          }
          this.voteService.updateVote(vote,response[0].id).subscribe((response)=>{
            this.getQuestion();
          })
        }
      } 
    })
  }


/**********************Modal*********************************************** */
  open(content, type, reponse, commentaire) {
    this.currentReponse = reponse;
    this.currentCommentaire = commentaire;
    this.initUpdateReponse();
    if (type === 'modify-reponse') {

     
      this.modalService
        .open(content, { size: "lg", ariaLabelledBy: "modify-reponse-modal" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") {
              this.updateReponse(reponse.id);
              
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (type === 'delete-reponse') {
      this.modalService
        .open(content, { ariaLabelledBy: "delete-reponse-modal" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") {
              this.deleteReponse(reponse);
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (type === 'modify-commentaire') {
      this.initUpdateCommentaire()
      this.modalService
        .open(content, { size: "lg", ariaLabelledBy: "modify-commentaire-modal" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") {
                this.updateCommentaire(commentaire.id);
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }else if(type=='accept-reponse'){
      this.modalService
      .open(content, { ariaLabelledBy: "accept-reponse-modal" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") {
            this.acceptReponse(reponse);
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }else{

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






