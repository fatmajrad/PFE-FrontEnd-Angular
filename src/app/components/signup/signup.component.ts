import { UserService } from "src/app/services/user.service";
import { Component, OnInit } from "@angular/core";
import { User } from "../../models/user.model";
import { Router } from "@angular/router";
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

  newUser = new User();
  apiURL: string = "http://localhost:8080/produits/api";

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {}

  signUpUser() {
    this.userService.addDemandeUser(this.newUser).subscribe((user) => {});
    this.router.navigate(["/"]);
  }
}
