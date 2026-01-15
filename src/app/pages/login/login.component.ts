import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { AutoFocusModule } from 'primeng/autofocus';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, PasswordModule, AutoFocusModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    this.errorMessage = '';
    const email = this.email.trim();

    if (!email || !this.password) {
      this.errorMessage = 'Inserire email e password per accedere.';
      return;
    }

    this.isSubmitting = true;
    this.authService
      .login(email, this.password)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/utente']);
        },
        error: (err: Error) => {
          this.password = '';
          this.errorMessage = err.message || 'Login fallito.';
        }
      });
  }
}
