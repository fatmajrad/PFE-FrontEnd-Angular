import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Sujet } from 'src/app/models/sujet.model';
import { AuthService } from 'src/app/services/auth.service';
import { QuestionService } from 'src/app/services/question.service';
import { SujetService } from 'src/app/services/sujet.service';

@Component({
  selector: 'app-publish-question',
  templateUrl: './publish-question.component.html',
  styleUrls: ['./publish-question.component.css']
})
export class PublishQuestionComponent implements OnInit {
  focus;
  focus1;
  currrentQuestionId : Number;
  sujets: Sujet[];
  formControl = new FormControl();
  updateQuestionForm: FormGroup;
  closeResult: string;
  quillEditor={
     height:'300px'
  }
  
  constructor(private sujetService: SujetService, private router: Router,private activatedRoute: ActivatedRoute, private modalService: NgbModal, private formBuilder: FormBuilder, private authService: AuthService, private questionService: QuestionService) { }

  ngOnInit(): void { 
    console.log(this.activatedRoute.snapshot.params.id);
    this.questionService.consulterQuestion(this.activatedRoute.snapshot.params.id).subscribe((response) => {console.log(response);this.initForm(response),this.currrentQuestionId=response.id} ) ;
    this.sujetService.listeSujet().subscribe(sujets => {
      this.sujets = sujets;
    });
  }

  initForm(x) {
  
    let titre:String = x.intituleQuestion;
    let description : String = x.descriptionQuestion; 
    let sujets : Sujet[] = x.tag;
    console.log(titre);
    this.updateQuestionForm = this.formBuilder.group({
      test:[''],
      intituleQuestion: [titre],
      descriptionQuestion: [description],
      sujet: [sujets],
    });


  }

  isValid(desc: any) {
    return true;
  }

  updateBrouillon(){
    let question = {
      "intituleQuestion": this.updateQuestionForm.get('intituleQuestion').value,
      "descriptionQuestion": this.updateQuestionForm.get('descriptionQuestion').value,
      "tag": [
        "/api/sujets/16"
      ]
    }
    this.questionService.updateQuestion(question,this.currrentQuestionId).subscribe((response) => console.log(response));
    this.router.navigate(["mes-questions"]);
  }
  
  publishBrouillon(){
    let formattedDate = (moment(new Date())).format('DD-MMM-YYYY').toString();
    let question = {
      "intituleQuestion": this.updateQuestionForm.get('intituleQuestion').value,
      "descriptionQuestion": this.updateQuestionForm.get('descriptionQuestion').value,
      "tag": [
        "/api/sujets/16"
      ],
      "statut": "onHold"
    }
    this.questionService.updateQuestion(question,this.currrentQuestionId).subscribe((response) => console.log(response));
    this.router.navigate(["mes-questions"]);
  }
  

  Annuler(content) {
    if (this.updateQuestionForm.get('intituleQuestion').value === null ||
      this.updateQuestionForm.get('descriptionQuestion').value === null||
      this.updateQuestionForm.get('sujet').value === null) {
        this.router.navigate(["mes-questions"]);
    }
    else {
      this.open(content);
    
    }
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") {
            this.updateBrouillon();
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );

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
