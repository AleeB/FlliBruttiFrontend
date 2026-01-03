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

@Component({
  selector: 'app-ncc',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TableModule, FormsModule, ReactiveFormsModule, InputNumberModule, InputTextModule, CheckboxModule, TextareaModule],
  templateUrl: './movimentoTerra.component.html',
  styleUrls: ['./movimentoTerra.component.scss']
})
export class MovimentoTerraComponent {
  MovimentoTerraForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.MovimentoTerraForm = this.fb.group({
      nomeCognome: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required, Validators.minLength(10)],
      dettagli: ['']
    });
  }

  onSubmit(): void {
    if (this.MovimentoTerraForm.valid) {
      console.log('MovimentoTerraForm', this.MovimentoTerraForm.value);
    }
  }
}