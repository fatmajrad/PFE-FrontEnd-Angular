import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

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
    const url="http://localhost:8000/api/users/allUsers"
    return this.http.get<User[]>(url);
  }

  addDemandeUser(user:any): Observable<any> {
    return this.http.post<any>(this.apiURL, user, httpOptions);
  }

  updateUser(user:User,body){
    const url = `${this.apiURL}/${user.id}`
    return this.http.put(url,body,httpOptions);
  }

  supprimerDemandeUser(id: Number) {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete(url, httpOptions);
  }
 
  
  validerDemandeUser(id: Number) {
    const url = `${this.apiURL}/${id}` + "/validate";
    this.emtyBody = {};
    return this.http.put(url, this.emtyBody, httpOptions);
  }
  
  refuserDemandeUser(id: Number) {
    const url = `${this.apiURL}/${id}` + "/decline";
    this.emtyBody = {};
    return this.http.put(url, this.emtyBody, httpOptions);
  }

  getUserById(id:Number){
    const url = "http://localhost:8000/api/users?page=1&id="+id;
    console.log(url);    
    return this.http.get(url, httpOptions);
  }

  getUsersByDateIntervall(minDate , maxDate){
    const url = "http://localhost:8000/api/users/valide/"+minDate+"/"+maxDate+"/countdate"
    return this.http.get<User[]>(url);
  }

  countAllUsers(){
    const url = "http://localhost:8000/api/users/valide/count"
    return this.http.get<User[]>(url);
  }

  countUsersByStaut(statut){
    const url = "http://localhost:8000/api/users/"+statut+"/count"
    return this.http.get<User[]>(url);
  }

  getUsersByStaut(statut){
    console.log(statut);
    const url = "http://localhost:8000/api/users?page=1&statut="+statut
    console.log(url);
    
    return this.http.get<User[]>(url);
  }

  getUsersByUserName(name){
    const url="http://localhost:8000/api/users?page=1&nomUser="+name
    return this.http.get<User[]>(url);
  }

  getUserByEmail(email){
    const url ="http://localhost:8000/api/users?page=1&email="+email
    console.log(url);
    
    return this.http.get<User[]>(url);
  }

  sendVerificationMail(id,body){
    const url = `${this.apiURL}/${id}` + "/verifEmail";
    return this.http.put(url,body, httpOptions);
  }

  resetPassword(id,body){
    const url = `${this.apiURL}/${id}` + "/reset_password";
    return this.http.put(url,body, httpOptions);
  }
}
