import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { NG_ASYNC_VALIDATORS } from "@angular/forms";
import { analyzeAndValidateNgModules } from "@angular/compiler";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class UserService {
  apiURL: string = "http://localhost:8000/api/users";
  api:string = "http://localhost:8000";
  constructor(private http: HttpClient, private router: Router) {}
  emtyBody: any;

  listeUser(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURL);
  }

  addDemandeUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiURL, user, httpOptions);
  }

  supprimerDemandeUser(id: number) {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete(url, httpOptions);
  }

  validerDemandeUser(id: number) {
    const url = `${this.apiURL}/${id}` + "/validate";
    this.emtyBody = {};
    return this.http.put(url, this.emtyBody, httpOptions);
  }
  refuserDemandeUser(id: number) {
    const url = `${this.apiURL}/${id}` + "/decline";
    this.emtyBody = {};
    return this.http.put(url, this.emtyBody, httpOptions);
  }

  getUserById(id:number){
    const url = `${this.api}${id}`;
    console.log(url);    
    return this.http.get(url, httpOptions);
  }
}
