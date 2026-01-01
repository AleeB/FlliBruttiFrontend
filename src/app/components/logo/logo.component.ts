import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a class="app-logo" href="/">
      <img class="logo" src="assets/Logo.png" alt="F.lli Brutti" />
    </a>
  `,
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent {}
