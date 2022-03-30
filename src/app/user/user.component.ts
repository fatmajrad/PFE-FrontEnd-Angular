import { User } from 'src/app/models/user.model';
import { UserService } from "./../services/user.service";
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  users: User[];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.listeUser().subscribe((users) => {
      this.users = users;
    });
  }

  supprimerUser(u: User) {
    let conf = confirm("Etes-vous sûr ?");
    if (conf)
      this.userService.supprimerDemandeUser(u.id).subscribe(() => {
        console.log("demande supprimée");
      });
    this.supprimerDuTableauUser(u);

  } 
  
  supprimerDuTableauUser(u: User) {
    this.users.forEach((cur, index) => {
      if (u.id === cur.id) {
        this.users.splice(index, 1);
      }
    });
  }


validerUser(u: User) {
  let conf = confirm("Etes-vous sûr ?");
  if (conf)
    this.userService.validerDemandeUser(u.id).subscribe(() => {
      console.log("demande supprimée");
    });
  this.router.navigate(["/users-validation"]).then(() => {
     window.location.reload();
   });
}
}
