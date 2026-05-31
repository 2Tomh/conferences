import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-root',
  templateUrl: './admin-root.component.html',
  styleUrls: ['./admin-root.component.css']
})
export class AdminRootComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
