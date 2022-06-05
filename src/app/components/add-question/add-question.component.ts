import { element } from 'protractor';
import { QuestionService } from "./../../services/question.service";
import { SujetService } from "./../../services/sujet.service";
import { OnInit } from "@angular/core";
import { Question } from "src/app/models/question.model";
import { Sujet } from "src/app/models/sujet.model";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable } from "rxjs";
import { MatChipsModule } from "@angular/material/chips";

@Component({
  selector: "app-add-question",
  templateUrl: "./add-question.component.html",
  styleUrls: ["./add-question.component.css"],
})
export class AddQuestionComponent implements OnInit {
  @ViewChild("fruitInput") fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = [];

  focus;
  focus1;
  newQuestion = new Question();
  sujets: Sujet[];
  addQuestionForm: FormGroup;
  closeResult: string;
  quillEditor = {
    height: "300px",
  };
  
  type: string;
  strong: string;
  message: string;
  showAlertsucces = false;
  showAlerterror = false;
  formControl = new FormControl();
  filteredOptions: Observable<any[]>;
  sujetCtrl = new FormControl();
  constructor(
    private sujetService: SujetService,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private questionService: QuestionService
  ) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(""),
      debounceTime(400),
      distinctUntilChanged(),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allFruits.slice()
      )
    );
  }

  ngOnInit(): void {
    this.initForm();
    this.sujetService.listeSujet().subscribe((sujets) => {
      this.sujets = sujets;
      this.sujets.forEach((element) => {
        this.allFruits.push(element.nom);
      });
    });
  }

  initForm() {
    this.addQuestionForm = this.formBuilder.group({
      intituleQuestion: ["", [Validators.required, Validators.minLength(20)]],
      descriptionQuestion: ["", [Validators.required, Validators.minLength(20)]],
      sujet: [""],
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allFruits.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) === 0
    );
    
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.fruits.push(value.trim());
     
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = "";
    this.fruitCtrl.setValue(null);
  }

  

  isValid(desc: any) {
    return true;
  }
  
  close() {
    this.showAlertsucces = false;
    this.showAlertsucces = false;
  }
  
  
  

  AjouterQuestion() {
   let tags :any[] =[]
   this.fruits.forEach(fruit => {
     this.sujets.forEach(sujet => {
       if(fruit == sujet.nom){
         let id = "/api/sujets/"+sujet.id
         tags.push(id)
       }
     });
   }); 
   
  let question = {
      intituleQuestion: this.addQuestionForm.get("intituleQuestion").value,
      descriptionQuestion: this.addQuestionForm.get("descriptionQuestion")
        .value,
      tag: tags,
      user: "/api/users/" + this.authService.getCurrentUserId(),
      statut: "onHold",
    };
    
    this.questionService.addQuestion(question).subscribe({
      next:(res)=>{ 
       this.type="success";
       this.message="Question ajoutée avec succées";
       this.showAlertsucces=true;
        setTimeout(()=>{ this.router.navigate(["mes-questions"]); },1000);
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="L'ajout de la question a echoué";
        }
    });
  }

  saveBrouillon() {
    let tags :any[] =[]
    this.fruits.forEach(fruit => {
     this.sujets.forEach(sujet => {
       if(fruit == sujet.nom){
         let id = "/api/sujets/"+sujet.id
         tags.push(id)
       }
     });
    }); 
    let question = {
      intituleQuestion: this.addQuestionForm.get("intituleQuestion").value,
      descriptionQuestion: this.addQuestionForm.get("descriptionQuestion")
        .value,
      tag: tags,
      user: "/api/users/" + this.authService.getCurrentUserId(),
      statut: "draft",
    };
    this.questionService.addQuestion(question).subscribe({
      next:(res)=>{ 
        this.type="success";
        this.message="Brouillon enregistré avec succées";
        this.showAlertsucces=true;
        setTimeout(()=>{ this.router.navigate(["mes-questions"]); },2000);
      },
        error:()=>{
          this.showAlerterror=true;
          this.type="error";
          this.message="L'enregistrement du brouillon a echoué";
        }
    });
  }

  Annuler(content) {
    if (
      this.addQuestionForm.get("intituleQuestion").value === null ||
      this.addQuestionForm.get("descriptionQuestion").value === null ||
      this.addQuestionForm.get("sujet").value === null
    ) {
      this.router.navigate(["/mes-questions"]);
    } else {
      this.open(content);
    }
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") {
            this.saveBrouillon();
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
