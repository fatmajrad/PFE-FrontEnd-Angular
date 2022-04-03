import { UserService } from './../../services/user.service';
import { SujetService } from './../../services/sujet.service';
import { Component, OnInit } from '@angular/core';
import { Sujet } from 'src/app/models/sujet.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-sujets-list',
  templateUrl: './sujets-list.component.html',
  styleUrls: ['./sujets-list.component.css']
})
export class SujetsListComponent implements OnInit {

  constructor(private sujetService : SujetService) { }
  sujets : Sujet[];
  
  ngOnInit(): void {
    this.sujetService.listeSujet().subscribe(sujets => {
      this.sujets = sujets;
      });
  }

}
