import { ReclamationListComponent } from './components/reclamation-list/reclamation-list.component';
import { LoginGuard } from './gards/login.guard';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { QuestionsListComponent } from './components/questions-list/questions-list.component';
import { SujetsListComponent } from './components/sujets-list/sujets-list.component';
import { ConnaissancesListComponent } from './components/connaissances-list/connaissances-list.component';
import { AddQuestionComponent } from './components/add-question/add-question.component';
import { ListReponseComponent } from './components/list-reponse/list-reponse.component';
import { MesQuestionsComponent } from './components/mes-questions/mes-questions.component';
import { UpdateQuestionComponent } from './components/update-question/update-question.component';
import { ListValidationQuestionsComponent } from './components/list-validation-questions/list-validation-questions.component';
import { PublishQuestionComponent } from './components/publish-question/publish-question.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { SujetQuestionsListComponent } from './components/sujet-questions-list/sujet-questions-list.component';
import { SujetConnaissanceListComponent } from './components/sujet-connaissance-list/sujet-connaissance-list.component';

const routes: Routes =[
    { path: 'home',             component: HomeComponent },
    { path: 'user-profile/:id',     component: ProfileComponent },
    { path: 'register',           component: SignupComponent },
    { path: 'landing',          component: LandingComponent },
    { path: 'login',          component: LoginComponent},
  //  { path: '', redirectTo: 'reponse-li', pathMatch: 'full' },
    { path: 'users-validation',          component: UserComponent },
    { path: 'questions-list',          component: QuestionsListComponent },
    { path: 'sujets-list',          component: SujetsListComponent },
    { path: 'connaissances-list',          component: ConnaissancesListComponent },
    { path: 'add-question',          component: AddQuestionComponent },
    { path: 'reponse-list/:id',          component: ListReponseComponent }, 
    { path: 'update-question/:id',          component: UpdateQuestionComponent},
    { path: 'validation-questions',          component: ListValidationQuestionsComponent},
    { path: 'mes-questions',          component: MesQuestionsComponent},
    { path: 'publish-question/:id',          component: PublishQuestionComponent},
    { path: 'dashboard',          component: DashboardComponent},
    { path: 'update-profile/:id',          component: UpdateProfileComponent},
    { path: 'reclamation',          component: ReclamationListComponent},
    { path: 'sujet-questions-list/:id',          component: SujetQuestionsListComponent},
    { path: 'sujet-connaissance-list/:id',          component: SujetConnaissanceListComponent},


];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule {
}