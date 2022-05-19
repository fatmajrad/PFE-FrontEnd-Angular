import { User } from './../../models/user.model';
import { ConnaissanceService } from './../../services/connaissance.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { Question } from 'src/app/models/question.model';
import { QuestionService } from 'src/app/services/question.service';
import { Component, OnInit } from '@angular/core';
import { Chart, ChartDataSets, ChartOptions} from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  fromDate: NgbDate;
  toDate: NgbDate;
  hoveredDate: NgbDate;
  model1 : NgbDate;
  model2 : NgbDate;

  minDate = new  Date();

  questions : any;
  questionsTotal : any;
  questionsDate : any;

  connaissances : any;
  connaissancesTotal : any;
  connaissancesDate : any;

  users : any;
  usersTotal : any;
  usersDate : any;

  chart : any;
  
  datePipe: DatePipe = new DatePipe('en-US');

  public propOne: any;
  public propTwo: any;
  public propThree: any;

  constructor(private questionService :QuestionService, calendar: NgbCalendar, private userService : UserService, private connaissanceService: ConnaissanceService){
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);


  }

  ngOnInit(): void {
    this.getAllApi();

    forkJoin({
      requestOne: this.userService.countAllUsers(),
      requestTwo: this.connaissanceService.countAllConnaissances(),
      requestThree: this.questionService.countAllQuestions()
    })
    .subscribe(({requestOne, requestTwo, requestThree}) => {
      this.propOne = requestOne;
      this.propTwo = requestTwo;
      this.propThree = requestThree;
    });
  }
  

  createChart(){
    console.log(this.connaissancesTotal);
    this.chart = new Chart('canva', {
      type:'line',
      data:{
        labels : this.connaissancesDate,
        datasets : [
          {
          label :"Question",
          data :this.questionsTotal,
          borderWidth : 1,
          fill : false,
          backgroundColor: 'rgba(200,100,96,0.2)',
          borderColor: 'rgba(77,83,96,1)', 
          },
          {
            label : "Connaissance",
            data :this.connaissancesTotal,
            borderWidth : 1,
            fill : false,
            backgroundColor: 'rgba(255,0,0,0.3)',
            borderColor: 'red',
          },
          {
            label : "Users",
            data :this.usersTotal,
            borderWidth : 1,
            fill : false,
            backgroundColor: '#4099ff',
            borderColor: 'blue',
          }]
      } 
    })
  }

  getQuestionsIntervall(){
      let maxDate = new Date(); 
      this.minDate.setDate(maxDate.getMonth() + 7)
      let formattedminDate = this.datePipe.transform(this.minDate, 'yyyy-MM-dd');
      let formattedmaxDate = this.datePipe.transform(maxDate, 'yyyy-MM-dd');

      this.questionService.getQuestionsByDateIntervall(formattedminDate,formattedmaxDate).subscribe(questions => {
      this.questions = questions;
      this.questionsDate = this.questions.map((data : any)=>data.createdAt);
      this.questionsTotal = this.questions.map((data : any)=> data.total);
      this.createChart();
      });
  }

  getUsersIntervall(){
    let maxDate = new Date(); 
    this.minDate.setDate(maxDate.getDate() + 7)
    let formattedminDate = this.datePipe.transform(this.minDate, 'yyyy-MM-dd');
    let formattedmaxDate = this.datePipe.transform(maxDate, 'yyyy-MM-dd');


    this.userService.getUsersByDateIntervall(formattedminDate,formattedmaxDate).subscribe((users) => {
    this.users = users;
    this.usersDate = this.questions.map((data : any)=>data.demandedAt);
    this.usersTotal = this.questions.map((data : any)=> data.total);
   
    });
  }

  getConnaissancesIntervall(){
    let maxDate = new Date(); 
    this.minDate.setDate(maxDate.getDate() + 7)
    let formattedminDate = this.datePipe.transform(this.minDate, 'yyyy-MM-dd');
    let formattedmaxDate = this.datePipe.transform(maxDate, 'yyyy-MM-dd');

    this.connaissanceService.getConnaissancesByDateIntervall(formattedminDate,formattedmaxDate).subscribe(connaissances => {
     
      
     /* this.connaissances = connaissances;
      this.connaissancesDate = this.connaissances.map((data : any)=>data.createdAt);
      this.connaissancesTotal = this.connaissances.map((data : any)=> data.total);
    */
      });
  }


  isRangeStart(date: NgbDate){
    return this.model1 && this.model2 && date.equals(this.model1);
  }
  isRangeEnd(date: NgbDate){
    return this.model1 && this.model2 && date.equals(this.model2);
  }
  isInRange(date: NgbDate){
    return date.after(this.model1) && date.before(this.model2);
  }
  isActive(date: NgbDate){
    return date.equals(this.model1) || date.equals(this.model2);
  }
  endDateChanged(date){
    if (this.model1 && this.model2 && (this.model1.year > this.model2.year || this.model1.year === this.model2.year && this.model1.month > this.model2.month || this.model1.year === this.model2.year && this.model1.month === this.model2.month && this.model1.day > this.model2.day )) {
      this.model1 = this.model2;
    }
  }
  startDateChanged(date){
    if (this.model1 && this.model2 && (this.model1.year > this.model2.year || this.model1.year === this.model2.year && this.model1.month > this.model2.month || this.model1.year === this.model2.year && this.model1.month === this.model2.month && this.model1.day > this.model2.day )) {
      this.model2 = this.model1;
    }
  }
 
  getAllApi(){
    let maxDate = new Date(); 
    this.minDate.setDate(maxDate.getMonth()  -1)
    let formattedminDate = this.datePipe.transform(this.minDate, 'yyyy-MM-dd');
    let formattedmaxDate = this.datePipe.transform(maxDate, 'yyyy-MM-dd');

    this.questionService.getQuestionsByDateIntervall(formattedminDate,formattedmaxDate).subscribe(questions => {
      this.questions = questions;
      this.questionsDate = this.questions.map((data : any)=>data.createdAt);
      this.questionsTotal = this.questions.map((data : any)=> data.total);
      this.connaissanceService.getConnaissancesByDateIntervall(formattedminDate,formattedmaxDate).subscribe(connaissances => {
       
        this.connaissances = connaissances;
        this.connaissancesDate = this.connaissances.map((data : any)=>data.createdAt);
        this.connaissancesTotal = this.connaissances.map((data : any)=> data.total);
            
          this.userService.getUsersByDateIntervall(formattedminDate,formattedmaxDate).subscribe((users) => {
            this.users = users;
            this.usersDate = this.questions.map((data : any)=>data.demandedAt);
            this.usersTotal = this.questions.map((data : any)=> data.total);
            
            console.log(this.questionsDate,this.questionsTotal,this.connaissancesDate,  this.connaissancesTotal, this.usersDate,this.usersTotal)
            this.createChart()
            });
        });
      });
  }
}

  


