import { jsPDF } from "jspdf";
import { element } from "protractor";
import { User } from "./../../models/user.model";
import { ConnaissanceService } from "./../../services/connaissance.service";
import { UserService } from "src/app/services/user.service";
import { Subscription } from "rxjs/Subscription";
import { Question } from "src/app/models/question.model";
import { QuestionService } from "src/app/services/question.service";
import { Component, OnInit } from "@angular/core";
import { Chart, ChartDataSets, ChartOptions } from "chart.js";
import { Color, Label } from "ng2-charts";
import { NgbCalendar, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { forkJoin } from "rxjs";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LOADIPHLPAPI } from "dns";


@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  fromDate: NgbDate;
  toDate: NgbDate;
  hoveredDate: NgbDate;
  closeResult: string;
  model1: NgbDate;
  model2: NgbDate;

  focus;
  focus1;
  focus2;
  focus3;
  focus4;

  minDate = new Date();

  questions: any;
  questionsTotal: any;
  questionsDate: any;

  connaissances: any;
  connaissancesTotal: any;
  connaissancesDate: any;

  users: any;
  usersTotal: any;
  usersDate: any;

  chart: any;
  startDate: string;
  endDate: string;
  datePipe: DatePipe = new DatePipe("en-US");
  datePickerForm: FormGroup;
  elements: FormGroup;

  hideConnaissance: any;
  hideQuestion: any;
  hideUsers: any;

  public propOne: any;
  public propTwo: any;
  public propThree: any;

  bgColor = {
    id: "bgColor",
    beforeDraw: (chart, options) => {
      const { ctx, width, height } = chart;
      ctx.fillStyle = "option.backgroundColor";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
    private modalService: NgbModal,
    calendar: NgbCalendar,
    private userService: UserService,
    private connaissanceService: ConnaissanceService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), "d", 10);

    this.elements = formBuilder.group({
      users: true,
      questions: true,
      connaissances: true,
    });
  }

  ngOnInit(): void {
    let maxDate = new Date();
    this.minDate.setDate(maxDate.getDay() - 7);
  
    this.startDate = this.datePipe.transform(this.minDate, "yyyy-MM-dd");
    this.endDate = this.datePipe.transform(maxDate, "yyyy-MM-dd");
   // this.getAllApi(this.startDate, this.endDate);
    console.log("t3adina");
    
    this.initDatePickerForm();
    this.userService.countAllUsers().subscribe((response)=>{
     this.propOne=response
   })
   this.connaissanceService.countAllConnaissances().subscribe((response)=>{
    this.propThree=response
   })
   this.questionService.countAllQuestions().subscribe((response)=>{
   
    this.propTwo=response
   })
 
  }
  initDatePickerForm(){
    this.datePickerForm = this.formBuilder.group({
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
    });
  }

  downloadPDF() {
    let chart = document.getElementById("canva") as HTMLCanvasElement;
    let imgChart = chart.toDataURL("image/jpeg", 1.0);
    let pdf = new jsPDF();
    pdf.setFontSize(12);
    pdf.text("Evolution cette semaine", 10, 10);
    pdf.addImage(imgChart, "JPEG", 15, 15, 280, 70);
    pdf.save("chart.pdf");
  }

  downloadPNG() {
    let imgLink = document.createElement("a");
    let chart = document.getElementById("canva") as HTMLCanvasElement;
    imgLink.download = "chart.png";
    imgLink.href = chart.toDataURL("image/png", 1);
    imgLink.click();
  }
  resetChart() {
    let maxDate = new Date();
    this.minDate.setDate(maxDate.getMonth() - 1);
    let formattedminDate = this.datePipe.transform(this.minDate, "yyyy-MM-dd");
    let formattedmaxDate = this.datePipe.transform(maxDate, "yyyy-MM-dd");
    this.getAllApi(formattedminDate, formattedmaxDate);
   this.datePickerForm.reset();
  }

  chargerChart() {
    console.log("3ella");
    let startDate = this.datePickerForm.get("startDate").value;
    let endDate = this.datePickerForm.get("endDate").value;
    console.log(startDate,endDate);
     
     this.endDate = endDate.year + "-" + endDate.month + "-" + endDate.day;
     this.startDate = startDate.year + "-" + startDate.month + "-" + startDate.day;
     console.log(this.startDate,this.endDate);
    
    
    this.getAllApi(this.startDate, this.endDate);
  }
  createChart() {
    this.chart = new Chart("canva", {
      type: "line",
      data: {
        labels: this.questionsDate,
        datasets: [
          {
            label: "Question",
            data: this.questionsTotal,
            borderWidth: 1,
            fill: false,
           
            backgroundColor: "white",
            borderColor: "rgb(255, 159, 64)",
          },
          {
            label: "Connaissance",
            data: this.connaissancesTotal,
            borderWidth: 1,
            fill: false,
           
            borderColor: "rgb(75, 192, 192)",
          },
          {
            label: "Users",
            data: this.usersTotal,
            borderWidth: 1,
            fill: false,

            borderColor: "rgb(153, 102, 255)",
          },
        ],
      },
      plugins: [this.bgColor],
    });
  }
  // charger(){
  //   this.getAllApi(this.datePickerForm.get('startDate').value,this.datePickerForm.get('endDate').value )
  // }

  
  getQuestionsIntervall() {
    let maxDate = new Date();
    this.minDate.setDate(maxDate.getMonth() + 7);
    let formattedminDate = this.datePipe.transform(this.minDate, "yyyy-MM-dd");
    let formattedmaxDate = this.datePipe.transform(maxDate, "yyyy-MM-dd");

    this.questionService
      .getQuestionsByDateIntervall(formattedminDate, formattedmaxDate)
      .subscribe((questions) => {
        this.questions = questions;
        this.questionsDate = this.questions.map((data: any) => data.createdAt);
        this.questionsTotal = this.questions.map((data: any) => data.total);
        this.createChart();
      });
  }

  getUsersIntervall() {
    let maxDate = new Date();
    this.minDate.setDate(maxDate.getDate() + 7);
    let formattedminDate = this.datePipe.transform(this.minDate, "yyyy-MM-dd");
    let formattedmaxDate = this.datePipe.transform(maxDate, "yyyy-MM-dd");

    this.userService
      .getUsersByDateIntervall(formattedminDate, formattedmaxDate)
      .subscribe((users) => {
        this.users = users;
        this.usersDate = this.questions.map((data: any) => data.demandedAt);
        this.usersTotal = this.questions.map((data: any) => data.total);
      });
  }

  getConnaissancesIntervall() {
    let maxDate = new Date();
    this.minDate.setDate(maxDate.getDate() + 7);
    let formattedminDate = this.datePipe.transform(this.minDate, "yyyy-MM-dd");
    let formattedmaxDate = this.datePipe.transform(maxDate, "yyyy-MM-dd");

    this.connaissanceService
      .getConnaissancesByDateIntervall(formattedminDate, formattedmaxDate)
      .subscribe((connaissances) => {});
  }

  toggleEditable1(event) {
    if (event.target.checked) {
     
    }
  }
  toggleEditable2(event) {
    if (event.target.checked) {
     
    }
  }
  toggleEditable3(event) {
    if (event.target.checked) {
   
    } else {
     
    }
  }
  getAllApi(formattedminDate, formattedmaxDate) {
   
    this.questionService.getQuestionsByDateIntervall(formattedminDate, formattedmaxDate).subscribe((questions) => {
        this.questions = questions;
        console.log("quess",questions);
        this.questionsDate = questions.map((data: any) => data.createdAt);
        this.questionsTotal = questions.map((data: any) => data.total);
        this.connaissanceService.getConnaissancesByDateIntervall(formattedminDate, formattedmaxDate).subscribe((connaissances) => {
          console.log("conn",connaissances);
          this.connaissances = connaissances;
          this.connaissancesTotal = connaissances.map(
            (data: any) => data.total
          );
          this.userService.getUsersByDateIntervall(formattedminDate, formattedmaxDate).subscribe((users) => {
            console.log("users",users);
            this.users = users;
            this.usersTotal =users.map((data: any) => data.total);
            setTimeout(()=>{ this.createChart() },5000);
          });
        });
      });
    
  }

  open(content, type, modalDimension) {
    if (modalDimension === "sm" && type === "modal_mini") {
      this.modalService
        .open(content, {
          windowClass: "modal-mini",
          size: "sm",
          centered: true,
        })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (modalDimension === "" && type === "Notification") {
      this.modalService
        .open(content, { windowClass: "modal-danger", centered: true })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else {
      this.modalService.open(content, { centered: true }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
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
  isRangeStart(date: NgbDate) {
    return this.model1 && this.model2 && date.equals(this.model1);
  }
  isRangeEnd(date: NgbDate) {
    return this.model1 && this.model2 && date.equals(this.model2);
  }
  isInRange(date: NgbDate) {
    return date.after(this.model1) && date.before(this.model2);
  }
  isActive(date: NgbDate) {
    return date.equals(this.model1) || date.equals(this.model2);
  }
  endDateChanged(date) {
    if (
      this.model1 &&
      this.model2 &&
      (this.model1.year > this.model2.year ||
        (this.model1.year === this.model2.year &&
          this.model1.month > this.model2.month) ||
        (this.model1.year === this.model2.year &&
          this.model1.month === this.model2.month &&
          this.model1.day > this.model2.day))
    ) {
      this.model1 = this.model2;
    }
  }
  startDateChanged(date) {
    if (
      this.model1 &&
      this.model2 &&
      (this.model1.year > this.model2.year ||
        (this.model1.year === this.model2.year &&
          this.model1.month > this.model2.month) ||
        (this.model1.year === this.model2.year &&
          this.model1.month === this.model2.month &&
          this.model1.day > this.model2.day))
    ) {
      this.model2 = this.model1;
    }
  }
}
