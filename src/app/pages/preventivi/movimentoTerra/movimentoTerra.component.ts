import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
// import { CalendarModule } from 'primeng/datepicker';

@Component({
  selector: 'app-ncc',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TableModule, FormsModule, ReactiveFormsModule, InputNumberModule, InputTextModule, CheckboxModule, TextareaModule, CalendarModule],
  templateUrl: './movimentoTerra.component.html',
  styleUrls: ['./movimentoTerra.component.scss']
})
export class MovimentoTerraComponent {
  nccForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.nccForm = this.fb.group({
      nomeCognome: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      periodo: [null, Validators.required],
      dettagli: ['']
    });
  }

  onSubmit(): void {
    if (this.nccForm.valid) {
      console.log('nccForm', this.nccForm.value);
    }
  }
}