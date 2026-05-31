
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const payload = {
        Email: this.loginForm.value.email,
        Password: this.loginForm.value.password
      };

      this.authService.login(payload).subscribe({
        next: (response) => {
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          console.error('Login error:', err);
          this.errorMessage = 'אימייל או סיסמה שגויים';
        }
      });
    }
  }
}
