import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user.model";

import { Router } from "@angular/router";
import { Token } from "@angular/compiler";
import { tokenize } from "@angular/compiler/src/ml_parser/lexer";
import { AuthService } from "src/app/services/auth.service";
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
  
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onLoggedin()
{
  this.authService.login(this.user).subscribe((data)=> {
    let jwToken = data.token;
    this.authService.saveToken(jwToken);
    this.router.navigate(['home']);
    },(err)=>{ this.err = 1;
    });
}}
