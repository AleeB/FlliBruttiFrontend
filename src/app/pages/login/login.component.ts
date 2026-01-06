import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { AutoFocusModule } from 'primeng/autofocus';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, PasswordModule, AutoFocusModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';

  login() {
    if (!this.username || !this.password) {
      alert('Inserire username e password per accedere!');
      return;
    }
    // TODO: call AuthService.login and handle JWT
    console.log('login', this.username);

    
  }
}
