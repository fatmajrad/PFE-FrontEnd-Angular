
import { QuestionService } from './../../services/question.service';
import { SujetService } from './../../services/sujet.service';
import {  OnInit } from '@angular/core';
import { Question } from 'src/app/models/question.model';
import { Sujet } from 'src/app/models/sujet.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild} from '@angular/core';

import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {MatChipsModule} from '@angular/material/chips'


@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {
  @ViewChild('sujetInput') fruitInput: ElementRef<HTMLInputElement>;

  focus;
  focus1;
  newQuestion = new Question();
  sujets: Sujet[];
  
  addQuestionForm: FormGroup;
  closeResult: string;
  quillEditor={
     height:'300px'
  }
  type: string;
  strong: string;
  message: string;
  showAlertsucces = false;
  showAlerterror = false;
  options=[];
  formControl = new FormControl();
  filteredOptions: Observable<any[]>;
  separatorKeysCodes: number[] =  [ENTER, COMMA];
  sujetCtrl = new FormControl();
  constructor(private sujetService: SujetService, private router: Router, private modalService: NgbModal, private formBuilder: FormBuilder, private authService: AuthService, private questionService: QuestionService) { 
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
            return this.filter(val || '')
       }) 
    )
   }
   filter(val: string): Observable<any[]> {
    // call the service which makes the http-request
    return this.sujetService.getSujetAuto()
     .pipe(
       map(response => response.filter(option => { 
         return option.nom.toLowerCase().indexOf(val.toLowerCase()) === 0
       }))
     )
   }  

   /*add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.sujets.push({nom:value,id:null,descriptionSujet:''});
    }

    // Clear the input value
    event.chipInput!.clear();

    this.sujetCtrl.setValue(null);
  }
  /*add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.sujets.push({nom:value,id:null,descriptionSujet:''});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }*/
  remove(value: string): void {
    const index = this.sujets.indexOf({nom:value,id:null,descriptionSujet:''});

    if (index >= 0) {
      this.sujets.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.sujets.push({nom:event.option.viewValue,id:null,descriptionSujet:''});
    this.fruitInput.nativeElement.value = '';
    this.sujetCtrl.setValue(null);
  }

  //private _filter(value: string): string[] {
    ///const filterValue = value.toLowerCase();

   // return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
   //Sreturn '';
  


  ngOnInit(): void {
    this.initForm();
    this.sujetService.listeSujet().subscribe(sujets => {
      this.sujets = sujets;

    });
  }

  initForm() {
    this.addQuestionForm = this.formBuilder.group({
      intituleQuestion: [''],
      descriptionQuestion: [''],
      sujet: [''],
    });


  }


  isValid(desc: any) {
    return true;
  }

  AjouterQuestion() {
    console.log(this.authService.getCurrentUserId());
    let question = {
      "intituleQuestion": this.addQuestionForm.get('intituleQuestion').value,
      "descriptionQuestion": this.addQuestionForm.get('descriptionQuestion').value,
      "tag": [
        "/api/sujets/9"
      ],
      "user": "/api/users/"+this.authService.getCurrentUserId(),
      "brouillon": false,
      "statutValidation": false
    }
    console.log(question);
    this.questionService.addQuestion(question).subscribe((response) => {console.log(response)});
    this.router.navigate(['mes-questions']);}

  close() {
    this.showAlertsucces=false;
    this.showAlertsucces=false;
  }

  saveBrouillon(){
    console.log(this.authService.getCurrentUserId());
    let question = {
      "intituleQuestion": this.addQuestionForm.get('intituleQuestion').value,
      "descriptionQuestion": this.addQuestionForm.get('descriptionQuestion').value,
      "tag": [
        "/api/sujets/9"
      ],
      "user": "/api/users/"+this.authService.getCurrentUserId(),
      "brouillon": true,
      "statutValidation": false
    }
    console.log(question);
    this.questionService.addQuestion(question).subscribe((response) => {console.log(response)});
    this.router.navigate(['mes-questions']);}


  Annuler(content) {
    if (this.addQuestionForm.get('intituleQuestion').value === null ||
      this.addQuestionForm.get('descriptionQuestion').value === null||
      this.addQuestionForm.get('sujet').value === null) {
        this.open(content);
    }
    else {
      this.router.navigate(["/mes-questions"]);
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
            this.router.navigate(["/mes-questions"]);
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
