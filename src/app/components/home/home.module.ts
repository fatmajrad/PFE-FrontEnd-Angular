import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { SectionsModule } from 'src/app/sections/sections.module';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        RouterModule,
        SectionsModule,
        ReactiveFormsModule,
        FormsModule
    ],
    declarations: [ HomeComponent ],
    exports:[ HomeComponent ],
    providers: []
})
export class HomeModule { }
