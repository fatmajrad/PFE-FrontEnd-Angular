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
      nomUser: [""],
      email: [""],
      fonction: [""],
      password: [""],
      confirmpassword: [""],
    });
  }
  signUpUser() {
    let pass = this.signUpForm.get("password").value;
    let confirmpass = this.signUpForm.get("confirmpassword").value;
    let valide = false;
    if (pass === confirmpass) {
      let user = {
        email: this.signUpForm.get("email").value,
        password: pass,
        nomUser: this.signUpForm.get("nomUser").value,
        userFonction: this.signUpForm.get("fonction").value,
      };
      console.log(user);

      this.userService.addDemandeUser(user).subscribe(
        (response) => {
          console.log(response);

          document.getElementById("openModelButton").click();
        },
        (err) => {
          this.err = 1;
        }
      );
    } else {
      console.log("hell");
    }
  }

  getNomUser() {
    return this.signUpForm.get("nomUser").value;
  }
  getPassword() {
    return this.signUpForm.get("password").value;
  }
  getConfirmPass() {
    return this.signUpForm.get("confirmpassword").value;
  }
  getFunction() {
    return this.signUpForm.get("fonction").value;
  }
  getEmail() {
    this.signUpForm.get("email").value;
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
