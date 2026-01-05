
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
import { AutoFocus } from "primeng/autofocus";
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-ncc',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TableModule, FormsModule, ReactiveFormsModule, InputNumberModule, InputTextModule, CheckboxModule, TextareaModule, AutoFocus],
  templateUrl: './nccDati.component.html',
  styleUrls: ['./nccDati.component.scss'],
  providers: [MessageService]
})
export class NccDatiComponent {
  nccForm: FormGroup;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.nccForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.minLength(10)],
      dettagli: ['']
    });
  }


  onSubmit(): void {
    if (this.nccForm.valid) {
      console.log('nccForm', this.nccForm.value);
      this.messageService.add({
        severity: 'success',
        summary: 'Preventivo Inviato',
        detail: 'Il tuo preventivo è stato inviato con successo.'
      });
      
    }
  }
}