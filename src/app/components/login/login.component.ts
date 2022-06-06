import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user.model";

import { Router } from "@angular/router";
import { Token } from "@angular/compiler";
import { tokenize } from "@angular/compiler/src/ml_parser/lexer";
import { AuthService } from "src/app/services/auth.service";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  focus;
  focus1;
  user = new User();
  err: number = 0;
  closeResult: string;
  verifMailForm : FormGroup;
  showmAILMSG =false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private userService : UserService,
    private formBuilder :FormBuilder
  ) {}

  ngOnInit() {
   
  }

  onLoggedin() {
    this.authService.login(this.user).subscribe(
      (data) => {
       this.authService.saveToken(data.token)
        console.log(this.authService.isAdmin());
        console.log(!this.authService.isValid());
        
        if(this.authService.isValid()===false){
          document.getElementById("openModelButton").click();
        }else{
          if(this.authService.isAdmin()&&this.authService.isValid()){
            this.router.navigate(["/dashboard"]);
          }else{
            this.router.navigate(["/home"]);
          }
        }
      },
      (err) => {
        this.err = 1;
      }

    );
  }
  initverifFormMail() {
    this.verifMailForm = this.formBuilder.group({
     email :["",[Validators.required,Validators.email]]
    });
  }

  sendVerificationEmail(){
    this.userService.getUserByEmail(this.verifMailForm.get('email').value).subscribe((response)=>{
         if (response.length===0){
          let error = 1
         }else{
           this.userService.sendVerificationMail(response[0].id,this.verifMailForm.value).subscribe((response)=>{
             console.log(response)
           })
         }
          
  })}
  open(content,type) {
    if(type==="userConfirmation"){
      this.modalService
      .open(content,{ ariaLabelledBy: "alert-User" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }else{
      console.log("okay");
      
      this.initverifFormMail();
      this.modalService
      .open(content,{ ariaLabelledBy: "forgot-password" })
      .result.then(
        (result) => {
          console.log("inside rejection");
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") { 
    
          this.sendVerificationEmail()
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
