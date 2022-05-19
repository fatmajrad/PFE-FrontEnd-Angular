
import { VoteService } from './../../services/vote.service';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { QuestionService } from './../../services/question.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  currentUserId :Number;
  numberVotesReponse: any;
  numberVotesCommentaire :any;
  constructor(private activatedRoute: ActivatedRoute, private reponseService: ReponseService,
    private modalService: NgbModal, private commentaireService: CommentaireService,
    private questionService: QuestionService, private formBuilder: FormBuilder,
    private authService: AuthService, private voteService: VoteService) { }


  ngOnInit() {
    this.addReponseCommentaire = this.formBuilder.group({
      reponse: [''],
      commentaire: [''],
    });
    this.getQuestion();
    this.currentUserId= this.authService.getCurrentUserId();
    console.log(this.currentUserId);
   }

showCommentsSection(){
    if(this.showComments){
      this.showComments=false;
    }else{
      this.showComments=true;
    }
  }

getQuestion(){
   this.questionService.consulterQuestion(this.activatedRoute.snapshot.params.id).subscribe((response)=>{
    this.currentQuestion=response;
    this.currentReponses=this.currentQuestion.reponses;
    this.id=response.user.id;
   }
   )
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

canEditQuestion() {
    if (this.authService.isloggedIn){
      if (this.currentQuestion.user.id == this.currentUserId) {
        return true;
      } else {
        return false;
      }
    }
  }

  canEditReponse(id:Number) {
    if ((this.authService.isloggedIn) &&(id)){
      if (id == this.currentUserId) {
        return true;
      } else {
        return false;
      }
    }
  }

  canEditComment() {
    if (this.authService.isloggedIn) {
      if (this.currentReponse.user.id == this.currentUserId) {
        return true;
      } else {
        return false;
      }
    }
  }

  ifAuthorized() {
    if (this.authService.isloggedIn) {
      if (this.id == this.currentUserId) {
        return true;
      } else {
        return false;
      }
    }
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
    this.reponseService.addReponse(reponse).subscribe((response) => {this.getQuestion()});

  }

  updateReponse(reponse: Reponse) {

    this.reponseService.updateReponse(reponse, reponse.id).subscribe((response) => {this.getQuestion()});
  }

  deleteReponse(reponse: Reponse) {

    this.reponseService.deleteReponse(reponse.id).subscribe((response)=>{this.getQuestion()});

  }


  addCommentaire(id: Number) {
    let commentaire =
    {
      "contenu": this.addReponseCommentaire.get('commentaire').value,
      "user": "/api/users/" + this.currentUserId,
      "reponse": "/api/reponses/" + id
    }
    
    this.commentaireService.addCommentaire(commentaire).subscribe((response) => {
      this.getQuestion()
    });
  }

  
  publier(id:Number){
    this.questionService.publishQuestion(id).subscribe((response) => console.log(response));
  }
  
  deleteQuestions(id:Number){
    this.questionService.deleteQuestion(id).subscribe((questions)=>{console.log("mes questions");
   }) 
   } 

 

  acceptReponse(reponse){
    let body={
      "statut":true
    }
    this.reponseService.updateReponse(body,reponse.id).subscribe((response)=>{
      console.log(reponse);
      
    })
  }
  
/*********************************Reponse Votes system*************************************************** */

   likeReponse(reponse : Reponse) {
    this.voteService.getReponseVote(this.currentUserId,reponse.id).subscribe((response)=>{
      if(response.length==0){
        let vote = {
          "typeVote": true,
          "user": "/api/users/"+this.currentUserId,
          "Connaissance": null,
          "Question": null,
          "Reponse": "api/reponses/"+reponse.id
        }
        this.voteService.addLike(vote).subscribe((response) => {console.log(response),
         this.countNumberVotes(reponse,true)});
      }else{
        console.log("delete");
        this.voteService.deleteVote(response[0].id);
      }  
    })
  }
  dislikeReponse(reponse:Reponse) {
    this.voteService.getReponseVote(this.currentUserId,reponse.id).subscribe((response)=>{
      if(response.length==0){
        let vote = {
          "typeVote": false,
          "user": "/api/users/"+this.currentUserId,
          "Connaissance": null,
          "Question": null,
          "Reponse": "api/reponses/"+reponse.id
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


/**********************Modal*********************************************** */
  open(content, type, reponse, commentaire) {
    this.currentReponse = reponse;
    this.currentCommentaire = commentaire;
    if (type === 'modify-reponse') {
      this.modalService
        .open(content, { ariaLabelledBy: "modify-reponse-modal" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") {
              this.updateReponse(reponse);

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
              console.log("deleted")
              this.deleteReponse(reponse);
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (type === 'modify-commentaire') {
      this.modalService
        .open(content, { ariaLabelledBy: "modify-commentaire-modal" })
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






