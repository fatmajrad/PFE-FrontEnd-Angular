import { ThrowStmt } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { User } from "src/app/models/user.model";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";



@Component({
  
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: [ './profile.component.css' ],
})

export class ProfileComponent implements OnInit {
 
  nomUser :any;
  description : any;
  subjects : [];
  fonction : any;
  id :any;
  updateProfileForm : FormGroup;
  currentUser : User;
  closeResult: string;
  email :any;
  userFonction : any;
  
  constructor(
    private formBuilder : FormBuilder,
    public authService: AuthService,
    public userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router : Router,
    private modalService: NgbModal,
    
    
  ) {
    
  }

  ngOnInit() {
   
    this.userService
      .getUserById(this.activatedRoute.snapshot.params.id)
      .subscribe((response) => {
        this.currentUser=response[0];
        this.nomUser = response[0].nomUser; 
        this.description = response[0].description;
        this.subjects = response[0].intrestedTopics;
        this.userFonction = response[0].userFonction;
        this.email=response[0].email;
        this.id=response[0].id;
        this.initUpdateUserProfile();
      });
    }
  

  initUpdateUserProfile(){
    this.updateProfileForm = this.formBuilder.group({
      userName: [this.nomUser],
      fonction: [this.userFonction],
      email:[this.email],
      subjects:[this.subjects]
    });
  }

  toArray(answers: object) {
    if (answers != null) {
      return Object.keys(answers).map(key => answers[key])
    }
  }

  updateProfile(){
    let user ={
      "email":this.updateProfileForm.get('email').value,
      "userFonction": this.updateProfileForm.get('fonction').value,
      "intrestedTopics": [
        "/api/sujets/16",
        "/api/sujets/17",
      ]
    }
    this.userService.updateUser(this.currentUser,user).subscribe((response)=>{
      console.log(response);
    });
  }
 
  open(content) {
      this.modalService
        .open(content, { size: "lg",ariaLabelledBy: "update-profile" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") {
            this.updateProfile()
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
function readURL(arg0: HTMLElement) {
  throw new Error("Function not implemented.");
}

