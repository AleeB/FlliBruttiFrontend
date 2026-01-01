import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-preventivi',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './preventivi.component.html',
  styleUrls: ['./preventivi.component.scss']
})
export class PreventiviComponent {}