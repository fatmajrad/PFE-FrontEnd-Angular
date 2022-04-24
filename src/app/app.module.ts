import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { LandingComponent } from './components/landing/landing.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './components/home/home.module';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { QuestionsListComponent } from './components/questions-list/questions-list.component';
import { MatCardModule} from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@angular/flex-layout';
import { SujetsListComponent } from './components/sujets-list/sujets-list.component';
import { DeleteConfirmationDialogComponent } from './components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ConnaissancesListComponent } from './components/connaissances-list/connaissances-list.component';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddQuestionComponent } from './components/add-question/add-question.component';
import { ListReponseComponent } from './components/list-reponse/list-reponse.component';
import { QuillModule } from 'ngx-quill';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MesQuestionsComponent } from './components/mes-questions/mes-questions.component';
import { UpdateQuestionComponent } from './components/update-question/update-question.component';
import { ListValidationQuestionsComponent } from './components/list-validation-questions/list-validation-questions.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    UserComponent,
    QuestionsListComponent,
    SujetsListComponent,
    DeleteConfirmationDialogComponent,
    ConnaissancesListComponent,
    AddQuestionComponent,
    ListReponseComponent,
    MesQuestionsComponent,
    UpdateQuestionComponent,
    ListValidationQuestionsComponent,
   
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    HomeModule,
    HttpClientModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    FlexModule,
    NgbModule,
    MatIconModule,
    MatMenuModule,
    BrowserAnimationsModule,
    QuillModule.forRoot(),
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
