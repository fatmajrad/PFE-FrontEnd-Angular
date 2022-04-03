import { User } from "src/app/models/user.model";

import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  users: User[];
  closeResult: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.userService.listeUser().subscribe((users) => {
      this.users = users;
    });
  }

  supprimerUser(u: User) {
    this.userService.supprimerDemandeUser(u.id).subscribe(() => {});
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
    this.userService.validerDemandeUser(u.id).subscribe(() => {});
    this.router.navigate(["/users-validation"]).then(() => {
      window.location.reload();
    });
  }

  refuserUser(u: User) {
    this.userService.refuserDemandeUser(u.id).subscribe(() => {});
    this.router.navigate(["/users-validation"]).then(() => {
      window.location.reload();
    });
  }

  open(content, user) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") {
            this.supprimerUser(user);
          }
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
