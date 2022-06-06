import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Role } from "../models/role.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  apiURL: string = "http://localhost:8000/api";

  public loggedUser: string;
  public isloggedIn: Boolean = false;
  public roles: Role[];
  public userName: string; 
  token: string;
  private helper = new JwtHelperService();
  statutUser: boolean;
  id: Number = null;
  admin = false;
  constructor(private router: Router, private http: HttpClient) {}
  login(user: User) {
    console.log(user);
    return this.http.post<User>(this.apiURL + "/login", user);
  }

  
  saveToken(jwt: string) {
    localStorage.setItem("jwt", jwt);
    this.token = jwt;
    this.decodeJWT();
  }
  decodeJWT() {
    if (this.token == undefined) return;
    const decodedToken = this.helper.decodeToken(this.token);
    this.userName=decodedToken.name;
    this.roles = decodedToken.roles;
    this.loggedUser = decodedToken.email;
    this.id = decodedToken.id;
    if(this.isValid()|| this.isAdmin()){
      this.isloggedIn = true;
      localStorage.setItem("isAdmin",String(this.admin))
      localStorage.setItem("isloggedIn",String( this.isloggedIn));
      localStorage.setItem("roles", String(this.roles));
      localStorage.setItem("loggedUser", String(this.loggedUser));
      localStorage.setItem("LoggedUserId",String(this.id))
      localStorage.setItem("userName",this.userName)
    } 
  }
  loadToken() {
    this.token = localStorage.getItem("jwt");
    this.decodeJWT();
  }

  getUserFromDB(username: string): Observable<User> {
    const url = `${this.apiURL}/${username}`;
    return this.http.get<User>(url);
  }
  getToken(): string {
    return this.token;
  }

  logout() {
    this.loggedUser = undefined;
    this.id = null;
    this.roles = undefined;
    this.token = undefined;
    this.isloggedIn = false;
  
    
    localStorage.removeItem("jwt");
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("isloggedIn");
    localStorage.removeItem("roles");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("LoggedUserId");
    this.router.navigate(["/login"]);
  }
  signIn(user: User) {
    this.loggedUser = user.email;
    this.isloggedIn = true;
    this.roles = user.roles;  
  }
  isAdmin(): Boolean {
   if(localStorage.getItem("loggedUser")==="admin@gmail.com"){
     this.admin=true
   }else{
     this.admin=false
   }
   return this.admin
  }

  isValid(): Boolean {
    let valid: Boolean;
    let x = 0;
    this.roles.forEach((element) => {
      if (String(element) === "ROLE_EDITOR") {
        x = x + 1;
      }
    });
    if (x === 0) {
      valid = false;
    } else {
      valid = true;
      x = 0;
    }
    return valid;
  }

  currentRole(){
    return this.roles.find( r => r.role == "ROLE_USER");
  }

  getLoggedUser() {
    return localStorage.getItem("loggedUser");
  }

  setLoggedUserFromLocalStorage(login: string) {
    this.loggedUser = login;
    this.isloggedIn = true;
    this.getUserRoles(login);
  }

  getUserRoles(email: string) {
    this.getUserFromDB(email).subscribe((user: User) => {
      this.roles = user.roles;
    });
  }

  getCurrentUserId() {
    let userId :Number = +localStorage.getItem("LoggedUserId");
    return Number(localStorage.getItem("LoggedUserId"));
  }
  getUserName(){
      return  localStorage.getItem("userName")
}
}