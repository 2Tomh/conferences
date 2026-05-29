import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-nav-bar',
  templateUrl: './admin-nav-bar.component.html',
  styleUrls: ['./admin-nav-bar.component.css']
})
export class AdminNavBarComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }


  ngOnInit(): void {
  }
  onLogout() {
    this.authService.logOut();
    this.router.navigate(['/admin/login']);
  }
}
