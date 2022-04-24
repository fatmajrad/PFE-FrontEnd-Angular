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

  constructor(private activatedRoute: ActivatedRoute, private reponseService: ReponseService,
    private modalService: NgbModal, private commentaireService: CommentaireService,
    private questionService: QuestionService, private formBuilder: FormBuilder,
    private authService: AuthService, private voteService: VoteService) { }


  async ngOnInit(): Promise<void> {
    this.addReponseCommentaire = this.formBuilder.group({
      reponse: [''],
      commentaire: [''],
    });
    this.getQuestion();
  }


async getQuestion(){
  this.currentQuestion = await this.questionService.consulterQuestion(this.activatedRoute.snapshot.params.id).toPromise();
   this.currentReponses=this.currentQuestion.reponses;
   this.currentReponses.forEach(element => {
     console.log(element.user.id)
   });
}

  canEditQuestion() {
    if (this.authService.isloggedIn){
      if (this.currentQuestion.user.id == this.authService.getCurrentUserId()) {
        return true;
      } else {
        return false;
      }
    }
  }

  canEditReponse(id:Number) {
    if ((this.authService.isloggedIn) &&(id)){
      if (id == this.authService.getCurrentUserId()) {
        return true;
      } else {
        return false;
      }
    }
  }

  canEditComment() {
    if (this.authService.isloggedIn) {
      if (this.currentReponse.user.id == this.authService.getCurrentUserId()) {
        return true;
      } else {
        return false;
      }
    }
  }

  ifAuthorized() {
    if (this.authService.isloggedIn) {
      if (this.currentCommentaire.user.id == this.authService.getCurrentUserId()) {
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
      "user": "/api/users/" + this.authService.getCurrentUserId(),
      "Question": "/api/questions/" + this.currentQuestion.id
    }
    this.reponseService.addReponse(reponse).subscribe((response) => {this.getQuestion()});

  }
  updateReponse(reponse: Reponse) {

    this.reponseService.updateReponse(reponse, reponse.id).subscribe((response) => console.log(response));
  }

  deleteReponse(reponse: Reponse) {

    this.reponseService.deleteReponse(reponse.id).subscribe(() => console.log("user deleted"));

  }


  addCommentaire(id: Number) {
    console.log(id);

    let commentaire =
    {
      "contenu": this.addReponseCommentaire.get('commentaire').value,
      "user": "/api/users/" + this.authService.getCurrentUserId(),
      "repsonse": "/api/reponses/" + id,
      "connaissance": null
    }
    
    this.commentaireService.addCommentaire(commentaire).subscribe((response) => console.log(response));
  }

  showCommentsSection(){
    if(this.showComments){
      this.showComments=false;
    }else{
      this.showComments=true;
    }
  }

  publier(id:Number){
    this.questionService.publishQuestion(id).subscribe((response) => console.log(response));
  }
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

  getCommentaire() {
    this.reponses = this.currentQuestion.reponses;
    for (let i = 0; i < this.reponses.length; i++) {
      console.log(this.reponses[i]);
    }
  }

  async checkQuestionVote() {
    const response = await this.voteService.getQuestionVote(this.currentQuestion.id, this.authService.getCurrentUserId()).toPromise();
      return response.length;
  }

  async likeQuestion() {
    console.log(this.checkQuestionVote())
    /*if (this.checkQuestionVote()==0) {
      const userId = this.authService.getCurrentUserId()
      const questionId = this.currentQuestion.id;
      let vote = {
        "typeVote": true,
        "user": "/api/users/" + userId,
        "Connaissance": null,
        "Question": "api/questions/" + questionId,
        "Reponse": null
      }
      this.voteService.addLike(vote).subscribe((response) => console.log(response));;
      console.log("okay");
     } else {
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

    }*/
  }
  async dislikeQuestion() {
    if (this.exist == true) {
      const userId = this.authService.getCurrentUserId();
      console.log(this.authService.getCurrentUserId());
      const questionId = this.currentQuestion.id;
      console.log(this.currentQuestion.id);
      let vote = {
        "typeVote": false,
        "user": "/api/users/" + userId,
        "Connaissance": null,
        "Question": "api/questions/" + questionId,
        "Reponse": null
      }
      this.voteService.addLike(vote).subscribe((response) => console.log(response));;
      console.log("okay");
    } else {
      console.log("vote exist deja");

    }
  }


  async checkReponseVote() {
    const response = await this.voteService.getReponseVote(this.currentReponse.id, this.authService.getCurrentUserId()).toPromise();
    console.log(response);
    if (response.length > 0) {
      this.exist = false;
    } else if (response.length = 0) {
      this.exist = true;
    }
  }

  async likeReponse() {
    //if (this.exist == true) {
      const userId = this.authService.getCurrentUserId()
      const reponseId = this.currentReponse.id;
      let vote = {
        "typeVote": true,
        "user": "/api/users/51",
        "Connaissance": null,
        "Question": null,
        "Reponse": "api/reponses/3"
      }
      this.voteService.addLike(vote).subscribe((response) => console.log(response));;
      console.log("okay");
   /* } else {
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

    }*/
  }
  async dislikeReponse() {
    if (this.exist == true) {
      const userId = this.authService.getCurrentUserId()
      const reponseId = this.currentReponse.id;
      let vote = {
        "typeVote": false,
        "user": "/api/users/" + userId,
        "Connaissance": null,
        "Question": null,
        "Reponse": "api/reponses/" + reponseId
      }
      this.voteService.addLike(vote).subscribe((response) => console.log(response));;
      console.log("okay");
    } else {
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
    }
  }

}






