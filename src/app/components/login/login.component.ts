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
  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {}

  onLoggedin() {
    this.authService.login(this.user).subscribe(
      (data) => {
        let jwToken = data.token;
        this.authService.saveToken(jwToken);
        if (this.authService.isAdmin()) {
          this.router.navigate(["/dashboard"]);
        } else if (!this.authService.isValid()) {
          document.getElementById("openModelButton").click();
        } else {
          this.router.navigate(["/home"]);
        }
      },
      (err) => {
        this.err = 1;
      }
    );
  }
  open(content) {
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
