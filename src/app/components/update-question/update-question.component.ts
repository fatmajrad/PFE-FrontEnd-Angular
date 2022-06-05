import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatAutocomplete, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map, startWith } from "rxjs/operators";
import { Question } from "src/app/models/question.model";
import { Sujet } from "src/app/models/sujet.model";
import { AuthService } from "src/app/services/auth.service";
import { QuestionService } from "src/app/services/question.service";
import { SujetService } from "src/app/services/sujet.service";

@Component({
  selector: "app-update-question",
  templateUrl: "./update-question.component.html",
  styleUrls: ["./update-question.component.css"],
})
export class UpdateQuestionComponent implements OnInit {
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
  currrentQuestionId: Number;
  sujets: Sujet[];
  currentQuestion: Question;
  formControl = new FormControl();
  updateQuestionForm: FormGroup;
  closeResult: string;
  quillEditor = {
    height: "300px",
  };

  constructor(
    private sujetService: SujetService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allFruits.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) === 0
    ); 
  }

  ngOnInit(): void {
    this.questionService.consulterQuestion(this.activatedRoute.snapshot.params.id).subscribe((response) => {
        this.initForm(response)
        this.currrentQuestionId = response.id,
        this.currentQuestion = response
        this.currentQuestion.tag.forEach(tag => {
          this.fruits.push(tag.nom)
        });
      });
    this.sujetService.listeSujet().subscribe((sujets) => {
      this.sujets = sujets;
      this.sujets.forEach((element) => {
        this.allFruits.push(element.nom);
      });
    });
    let sujets =this.currentQuestion.tag
    sujets.forEach(element => {
      this.fruits.push(element.nom);
    })
   console.log(this.fruits);
   
  }
  initForm(x) {
    this.updateQuestionForm = this.formBuilder.group({
      test: [""],
      intituleQuestion: [],
      descriptionQuestion: [],
      sujet: [],
    });
  }

  isValid(desc: any) {
    return true;
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
  updateQuestion() {
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
      intituleQuestion: this.updateQuestionForm.get("intituleQuestion").value,
      descriptionQuestion: this.updateQuestionForm.get("descriptionQuestion").value,
      tag: tags,
    };
    this.questionService.updateQuestion(question, this.currrentQuestionId).subscribe((response) => console.log(response));
    this.router.navigate(["/questions-list"]);
  }

  Annuler(content) {
    if (
      this.updateQuestionForm.get("intituleQuestion").value === null ||
      this.updateQuestionForm.get("descriptionQuestion").value === null ||
      this.updateQuestionForm.get("sujet").value === null
    ) {
      this.open(content);
    } else {
      this.router.navigate(["/sujets-list"]);
    }
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === "yes") {
            this.router.navigate(["/sujets-list"]);
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
