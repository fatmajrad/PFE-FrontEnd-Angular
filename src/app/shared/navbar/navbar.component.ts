import { Question } from './../../models/question.model';
import { QuestionService } from './../../services/question.service';
import { AuthService } from "./../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import {
  Router,
  NavigationEnd,
  NavigationStart,
  ActivatedRoute,
} from "@angular/router";
import { Location, PopStateEvent } from "@angular/common";
import { UserService } from "src/app/services/user.service";
import { Observable } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  public isCollapsed = true;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  filteredOptions: Observable<Question[]>;
  separatorKeysCodes: number[] =   [ENTER, COMMA];
  questionSrearchForm : FormGroup;
  formControl = new FormControl();
  questions : Question []=[];
  constructor(
    public location: Location,
    private router: Router,
    public authService: AuthService,
    public userService: UserService,
    private activatedRoute: ActivatedRoute,
    private questionService:QuestionService,
    private formBuilder : FormBuilder
  ) {
    // this.filteredOptions = this.formControl.valueChanges.pipe(
    //     startWith(""),
    //     debounceTime(400),
    //     distinctUntilChanged(),
    //     switchMap((val) => {
    //       return this.filter(val || "");
    //     })
    //   );
  }
  // filter(val: string): Observable<any[]> {
  //   return this.questionService.listeValidatedQuestions().pipe(
  //     map((response) =>
  //       response.filter((option) => {
  //         return option.intituleQuestion.toLowerCase().indexOf(val.toLowerCase()) === 0;
  //       })));
  // }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
      if (event instanceof NavigationStart) {
        if (event.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      } else if (event instanceof NavigationEnd) {
        if (event.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else window.scrollTo(0, 0);
      }
    });
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.questionSrearchForm = this.formBuilder.group({
        intituleQuestion:[""]
    })
   this.initQuestionSearchForm();
   this.filteredOptions = this.formControl.valueChanges
    .pipe(
    debounceTime(400),
     startWith<string | Question>(''),
     map(value => typeof value === 'string' ? value : value.intituleQuestion),
     map(intituleQuestion => intituleQuestion ? this._filter(intituleQuestion) : this.questions.slice())
   );
  }

  isHome() {
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee === "#/home") {
      return true;
    } else {
      return false;
    }
  }
  isDocumentation() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee === "#/documentation") {
      return true;
    } else {
      return false;
    }
  }
  initQuestionSearchForm(){
    this.questionService.listeValidatedQuestions().subscribe((response)=>{
        this.questions=response
    })
  }

  getUserName() {
    this.authService.getUserName();
  }

  redrirectProfile() {
    let id = this.authService.getCurrentUserId();
    this.router.navigate(["/user-profile/" + id]);
  }
  getQuestionDetail(event){ 
   this.questions.forEach(element => {
       if(element.intituleQuestion===event){
           this.questionSrearchForm.reset();
           this.router.navigate(['/reponse-list/'+element.id])
       }
   });
   
  }

  private _filter(intituleQuestion: string): Question[] {
    const filterValue = intituleQuestion.toLowerCase();
    return this.questions.filter(option => {
      return option.intituleQuestion.toLowerCase().split(' ').some(substr => substr.startsWith(filterValue));
    });
  }
  displayFn(question?: Question): string | undefined {
    return question ? question.intituleQuestion : undefined;
  }
}
