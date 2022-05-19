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
      email: ["",[Validators.required, Validators.minLength(5)]],
      fonction: ["",[Validators.required]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      confirmpassword: [""],
    });
  }
  signUpUser(user) {
   
      this.userService.addDemandeUser(user).subscribe(
        (response) => {
          console.log(response);

          document.getElementById("openModelButton").click();
        
          },
        (err) => {
          this.err = 1;
        }
      );
    
  }

  passwordErrorValidator = (control: FormGroup) => {
    const password = control.value.password;
    const confirmedPassword = control.value.confirmedPassword;

    return password !== confirmedPassword
      ? control.get('confirmedPassword').setErrors({ passwordMismatch: true })
      : control.get('confirmedPassword').setErrors(null);
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
