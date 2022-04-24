import { User } from "src/app/models/user.model";

import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
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
   
  constructor(
    private userService: UserService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(){
    this.userService.listeUser().subscribe((users) => {
      this.users = users;
    });
  }
  supprimerUser(u: User) {
    this.userService.supprimerDemandeUser(u.id).subscribe({
      next:(res)=>{ 
       this.type="success";
       this.message="user supprimée avec succées";
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
    this.userService.validerDemandeUser(u.id).subscribe({
      next:(res)=>{ 
       this.type="success";
       this.message="user validée avec succées";
       this.showAlertsucces=true;
       this.getAllUsers();
      
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="Erreur avec la validation";
        }
    });
  }
  refuserUser(u: User) {
    this.userService.refuserDemandeUser(u.id).subscribe({
      next:(res)=>{ 
        this.type="success";
        this.message="user est réfusée";
        this.showAlertsucces=true;
        this.getAllUsers();
       
       },
         error:()=>{
           this.showAlerterror=true;
           this.type="error";
           this.message="Probleme avec le refus";
         }
     });
   }


 /* open(content, user) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
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
  }*/

  open(content, type,user) {
    this.currentUser = user;
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
          this.refuserUser(user);
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }else{
        console.log("gggggggggg")
       this.modalService
        .open(content, { ariaLabelledBy: "confirm-accaptance" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") { 
             console.log("validtae")
             this.validerUser(user);
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
    close() {
      this.showAlertsucces=false;
      this.showAlertsucces=false;
    }
}

