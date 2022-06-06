import { UserService } from "src/app/services/user.service";
import { Component, OnInit } from "@angular/core";
import { User } from "../../models/user.model";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  test: Date = new Date();
  focus;
  focus1;
  focus2;
  err: number = 0;
  closeResult: string;
  newUser = new User();
  formControl = new FormControl();
  signUpForm: FormGroup;
  apiURL: string = "http://localhost:8080/produits/api";
  PwdType: boolean;
  PwdConfirmedType: boolean;
  toggleFieldTextType(value) {
    value === 'pwd'
      ? (this.PwdType = !this.PwdType)
      : (this.PwdConfirmedType = !this.PwdConfirmedType);
  }

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signUpForm = this.formBuilder.group({
      nomUser: ["",[Validators.required, Validators.minLength(5)]],
      email: ["",[Validators.required,Validators.email]],
      fonction: ["",[Validators.required]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      confirmpassword: [""],
    },
    {validators: this.passwordErrorValidator});
  }
  signUpUser() {
    let user= {
      "email": this.signUpForm.get('email').value,
      "password":  this.signUpForm.get('password').value,
      "nomUser":  this.signUpForm.get('nomUser').value,
      "userFonction":  this.signUpForm.get('fonction').value,
    }
    this.userService.getUserByEmail(this.signUpForm.get('email').value).subscribe((response)=>{
      console.log(response);
      
      if(response.length===0){
        this.userService.addDemandeUser(user).subscribe(
          (response) => {
            this.signUpForm.reset();
            document.getElementById("openModelButton").click();
            setTimeout(()=>{ this.router.navigate(["/home"]); },1000);
            }
        );
      }else{
        this.err=1;
        
      }
    })
    
   
  }
  passwordErrorValidator = (control: FormGroup) => {
    const password = control.value.password;
    const confirmpassword = control.value.confirmpassword;

    return password !== confirmpassword
      ? control.get('confirmpassword').setErrors({ passwordMismatch: true })
      : control.get('confirmpassword').setErrors(null);
    
      
  }
  
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "alert-User" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
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
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
  function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
}



