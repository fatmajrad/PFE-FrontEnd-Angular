import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Role } from "../models/role.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";


const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  
  apiURL: string = "http://localhost:8000/api";

  public loggedUser: string;
  public isloggedIn: Boolean = false;
  public roles: Role[];
  token: string;
  private helper = new JwtHelperService();
  statutUser : boolean;
  id:Number = null;

  constructor(private router: Router, private http: HttpClient) {}
  login(user: User) {
    return this.http.post<User>(this.apiURL + "/login", user);
  }

  getUserFromDB(username: string): Observable<User> {
    const url = `${this.apiURL}/${username}`;
    return this.http.get<User>(url);
  }
  saveToken(jwt: string) {
    localStorage.setItem("jwt", jwt);
    this.token = jwt;
    this.isloggedIn = true;
    this.decodeJWT();
  }
  decodeJWT() {
    if (this.token == undefined) return;
    const decodedToken = this.helper.decodeToken(this.token);
    this.statutUser=decodedToken.statutValidation;
  
      this.roles = decodedToken.roles;
      this.loggedUser = decodedToken.email;
      this.id=decodedToken.id;
      localStorage.setItem("isloggedIn", String(this.isloggedIn));
  }
  loadToken() {
    this.token = localStorage.getItem("jwt");
    this.decodeJWT();
  }

  getToken(): string {
    return this.token;
  }

  logout() {
    this.loggedUser = undefined;
    this.id=null;
    this.roles = undefined;
    this.token= undefined;
    this.isloggedIn = false;
    localStorage.removeItem('jwt');
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('isloggedIn');
    this.router.navigate(['/login']);    
  }
  signIn(user: User) {
    
    this.loggedUser = user.email;
    this.isloggedIn = true;
    this.roles = user.roles;
    
    localStorage.setItem("loggedUser", this.loggedUser);
    localStorage.setItem("isloggedIn", String(this.isloggedIn));
}
  isAdmin():Boolean{
    let admin: Boolean = false;
    if (this.loggedUser=="admin@gmail.com"){
      admin = true
    }
    return admin
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

  getCurrentUserId():Number{
    return this.id;
  }
  
    isValid(){
      let valid:Boolean = false;
      if(this.statutUser){
        valid= true
      }else{
        valid=false
      }
      return valid;
    }
  
}
