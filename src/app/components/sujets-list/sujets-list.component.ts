import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { UserService } from "./../../services/user.service";
import { SujetService } from "./../../services/sujet.service";
import { Component, OnInit } from "@angular/core";
import { Sujet } from "src/app/models/sujet.model";
import { User } from "src/app/models/user.model";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-sujets-list",
  templateUrl: "./sujets-list.component.html",
  styleUrls: ["./sujets-list.component.css"],
})
export class SujetsListComponent implements OnInit {
  constructor(
    private sujetService: SujetService,
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthService
  ) {}
  sujets: Sujet[];
  closeResult: string;
  currentSujet = new Sujet();
  currentSujetId: number;
  newSujet = new Sujet();

  ngOnInit(): void {
    this.sujetService.listeSujet().subscribe((sujets) => {
      this.sujets = sujets;
    });
  }

  supprimerSujet(s: Sujet) {
    this.sujetService.supprimerSujet(s.id).subscribe((reponse) => {
      this.sujetService.listeSujet().subscribe((sujets) => {
        this.sujets = sujets;
      });
    });
  }

  updateSujet(s: Sujet, id: Number) {
    this.sujetService.updateSujet(s, id).subscribe((reponse) => {
      this.sujetService.listeSujet().subscribe((sujets) => {
        this.sujets = sujets;
      });
    });
  }

  addSujet() {
    this.sujetService.addSujet(this.newSujet).subscribe((reponse) => {
      this.sujetService.listeSujet().subscribe((sujets) => {
        this.sujets = sujets;
      });
    });
  }
  getSujetbyNom(nom: string) {
    //this.page =1;
    console.log(
      this.sujetService.getSujetbyNom(nom).subscribe((sujets) => {
        this.sujets = sujets;
      })
    );
  }

  detailsSujets() {
    console.log("dd");
  }
  open(content, type, sujet) {
    this.currentSujet = sujet;
    if (type === "confirmationDelete") {
      this.modalService
        .open(content, { ariaLabelledBy: "confirmation-delete-modal" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") {
              this.supprimerSujet(sujet);
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (type === "modificationSujet") {
      this.modalService
        .open(content, { ariaLabelledBy: "modify-sujet" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") {
              this.currentSujetId = sujet.id;
              this.updateSujet(this.currentSujet, this.currentSujetId);
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (type === "ajouterSujet") {
      this.modalService
        .open(content, { ariaLabelledBy: "ajouter-sujet" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") {
              this.addSujet();
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else {
      this.modalService
        .open(content, { ariaLabelledBy: "details-sujet" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === "yes") {
              this.addSujet();
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
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
