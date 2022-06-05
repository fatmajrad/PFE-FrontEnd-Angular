import { QuestionService } from './../../services/question.service';
import { User } from "src/app/models/user.model";

import { Component, OnInit, EventEmitter, Output, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  users: User[];
  closeResult: string;
  showAlertsucces = false;
  showAlerterror = false;
  currentUser = new User();
  type: string;
  strong: string;
  message: string;
  declineUserForm : FormGroup;
  searchForm : FormGroup
  totalElemnt : Number=0;
  page=1
  constructor(
    private userService: UserService,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.initSearchForm();
  }
  
  initSearchForm() {
    this.searchForm= this.formBuilder.group({
      userNom: ['',Validators.required],
      statut : []
    });
  }
  
  resetForm(){
    this.searchForm.reset();
    this.getAllUsers();
  }
  initDeclineForm(user : User){
    let adressmail: string = this.currentUser.email;
    let remarque : String = this.currentUser.remarque;
    
    this.declineUserForm = this.formBuilder.group({
     email: [adressmail],
     contenuMail:[remarque,[Validators.required, Validators.minLength(20)]]
    });
  }
  getUserByNom(){
    this.getUsersByName(this.searchForm.get('userNom').value);
  }

  getAllUsers(){
    this.userService.listeUser().subscribe((users) => {
      this.users = users;
      this.totalElemnt = users.length
      
    });
  }
  supprimerUser(u: User) {
    this.userService.supprimerDemandeUser(u.id).subscribe({
      next:(res)=>{ 
       this.type="success";
       this.message="Utilisateur supprimée avec succées";
       this.showAlertsucces=true;
       this.supprimerDuTableauUser(u);
    
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="Erreur avec la suppression";
        }
    });
  }

  supprimerDuTableauUser(u: User) {
    this.users.forEach((cur, index) => {
      if (u.id === cur.id) {
        this.users.splice(index, 1);
      }
    });
  }

  validerUser(u: User) {
    this.userService.validerDemandeUser(u.id).subscribe((response)=>{
       this.type="success";
       this.message="Utilisateur validée avec succées";
       this.showAlertsucces=true;
       this.getAllUsers();
  })
  }
  refuserUser(u: User, body) {
    this.userService.updateUser(u,body).subscribe((response)=>{
      this.type="success";
      this.message="Utilisateur validée avec succées";
      this.showAlertsucces=true;
      this.getAllUsers();
 })
 }
  
   getUserBystatus(statut){
     this.userService.getUsersByStaut(statut).subscribe((users)=>{
       this.users=users
       this.totalElemnt = users.length
       this.page=1
     })
   }

   getUsersByName(userName){
    this.userService.getUsersByUserName(userName).subscribe((users)=>{
      this.users=users
      this.totalElemnt = users.length
      this.page=1
    })
   }

   onEditClick(statut: any) {
   if(statut=='Invalide'){
     
      this.getUserBystatus('invalide');
   }else if(statut=='Valide'){
    
      this.getUserBystatus('valide');
   }else if(statut=='En attente'){
   
      this.getUserBystatus('onHold');
   }else{
   
      this.getAllUsers();
   }
   
}

isPair(id){
 
  return !(id % 2)
}
  open(content, type,user) {
    this.currentUser = user;
    this.initDeclineForm(user);
     if (type === 'delete-question') {
      this.modalService
      .open(content, { ariaLabelledBy: "confirm-delete" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") { 
            this.supprimerUser(user);
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }else if (type == 'rejectQuestion') {
      this.modalService
      .open(content, { ariaLabelledBy: "confirm-rejection" })
      .result.then(
        (result) => {
          console.log("inside rejection");
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") { 
            console.log("reject")
           
            let body={
              "remarque": this.declineUserForm.get("contenuMail").value
            }
            this.refuserUser(user,body);
           
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }else if(type=='acceptQuestion'){
        
       this.modalService
        .open(content, { ariaLabelledBy: "confirm-accaptance" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") { 
             this.validerUser(user);
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }else{
      this.modalService
        .open(content, { ariaLabelledBy: "details-question" })
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
      this.showAlertsucces=false;
    }
}

