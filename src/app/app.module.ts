import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { QuestionsListComponent } from './questions-list/questions-list.component';
import { TopicsListComponent } from './topics-list/topics-list.component';
import { MatCardModule} from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
//import { FlexLayoutModule } from '@angular/flex-layout';


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
    TopicsListComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HomeModule,
    HttpClientModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
   // FlexLayoutModule,
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
