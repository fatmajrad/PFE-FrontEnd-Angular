import { ReclamationService } from './../../services/reclamation.service';
import { Component, OnInit } from '@angular/core';
import { Reclamation } from 'src/app/models/reclamation.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrls: ['./reclamation-list.component.css']
})
export class ReclamationListComponent implements OnInit {
  reclamations : Reclamation[];
  answerForm : FormGroup;
  closeResult: string;
  showAlertsucces = false;
  showAlerterror = false;
  currentReclamation = new Reclamation();
  type: string;
  strong: string;
  message: string;
  totalElemnt : Number=0;
  page=1;
  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder, private reclamationService :ReclamationService) { }

  ngOnInit(): void {
    this.getReclamtions();
  } 

  initanswerForm(reclamation){
    let adressmail: String = reclamation.UserEmail;
    let answer : String = reclamation.answer
   
    this.answerForm = this.formBuilder.group({
     email: [adressmail],
     answer:[answer,[Validators.required, Validators.minLength(20)]]
    });
  }

  getReclamtions(){
    this.reclamationService.getAllReclamations().subscribe((response)=>{
      this.reclamations = response;
      this.totalElemnt=response.length;
    })
  }

  deleteReclamation(reclamation : Reclamation){
    this.reclamationService.deleteReclamtion(reclamation.id).subscribe({
      next:(res)=>{ 
       this.type="success";
       this.message="La réclamation a été supprimé";
       this.showAlertsucces=true;
       this.getReclamtions();
    
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="Erreur avec la suppression de la reclamation";
        }
    });
  }
  answerReclamtion(id:Number){
    let body = {
      answer:this.answerForm.get('answer').value
    }
    this.reclamationService.answerReclamation(body,id).subscribe({
      next:(res)=>{ 
       this.type="success";
       this.message="La réponse a été envoyé avec succées";
       this.showAlertsucces=true;
       this.getReclamtions();
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="Erreur avec l'envoie de la réponse";
          setTimeout(()=>{ this.close(); },1000);
        }
    });
  }

 

  open(content, type,reclamation) {
    this.currentReclamation  = reclamation;
    console.log(reclamation, this.currentReclamation);
    this.initanswerForm(reclamation);
     if (type === 'deleteReclamtion') {
      this.modalService
      .open(content, { ariaLabelledBy: "confirm-delete" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") { 
            this.deleteReclamation(reclamation)
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }else if (type === 'answerReclamation') {
      this.initanswerForm(reclamation);
      this.modalService
      .open(content, { ariaLabelledBy: "confirm-rejection" })
      .result.then(
        (result) => {
          console.log("inside rejection");
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") { 
    
            this.answerReclamtion(reclamation.id);
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
      }else{
      this.modalService
        .open(content, { ariaLabelledBy: "detailsReclamtion" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
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
    close() {
      this.showAlertsucces=false;
      this.showAlerterror=false;
    }
  }
  


