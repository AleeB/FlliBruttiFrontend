
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoFocusModule } from 'primeng/autofocus';


@Component({
  selector: 'app-ncc',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TableModule, FormsModule, ReactiveFormsModule, InputNumberModule, InputTextModule, CheckboxModule, AutoFocusModule],
  templateUrl: './nccCity.component.html',
  styleUrls: ['./nccCity.component.scss']
})
export class NccCityComponent {
  nccForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.nccForm = this.fb.group({
      cittaPartenza: ['', Validators.required],
      cittaArrivo: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.nccForm.valid) {
      console.log('nccForm', this.nccForm.value);
    }
  }
}