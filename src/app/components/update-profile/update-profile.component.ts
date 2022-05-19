import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AmdDependency } from 'typescript';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  focus;
  focus1;
  updateProfileForm : FormGroup;
  nomUser :any;
  description : any;
  subjects : [];
  userFonction : any;
  email: any;
  id : any;
  currentUser : User
  constructor(private formBuilder : FormBuilder, 
    public userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router : Router) { }

  ngOnInit(): void {
    this.userService
      .getUserById(this.activatedRoute.snapshot.params.id)
      .subscribe((response) => {
        this.currentUser=response[0];
        this.nomUser = response[0].nomUser; 
        this.description = response[0].description;
        this.subjects = response[0].sujets;
        this.userFonction = response[0].userFonction;
        this.email=response[0].email;
        this.id=response[0].id;
        this.initUpdateUserProfile();
      });
  }

  initUpdateUserProfile(){
    this.updateProfileForm = this.formBuilder.group({
      userName: [this.nomUser],
      fonction: [this.userFonction],
      description:[this.description],
      email:[this.email],
      subjects:[this.subjects]
    });
  }

  toArray(answers: object) {
    if (answers != null) {
      return Object.keys(answers).map(key => answers[key])
    }
  }

  updateProfile(){
    let user ={
      "email":this.updateProfileForm.get('email').value,
      "userFonction": this.updateProfileForm.get('fonction').value,
      "description": this.updateProfileForm.get('description').value,
      "intrestedTopics": [
        "/api/sujets/16",
        "/api/sujets/17",
      ]
    }   
    console.log(user);
    this.userService.updateUser(this.currentUser,user).subscribe((response)=>{
      console.log(response);
    });
  }
}
