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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-movimento-terra',
  standalone: true,
  imports: [CommonModule, FileUpload, ToastModule, RouterModule, ButtonModule, TableModule,  FormsModule, ReactiveFormsModule, InputNumberModule, InputTextModule, CheckboxModule, TextareaModule],
  templateUrl: './movimentoTerra.component.html',
  styleUrls: ['./movimentoTerra.component.scss'],
  providers: [MessageService]
})
export class MovimentoTerraComponent {
  MovimentoTerraForm: FormGroup;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.MovimentoTerraForm = this.fb.group({
      nomeCognome: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.minLength(10)],
      dettagli: ['']
    });
  }

  onSubmit(): void {
    if (this.MovimentoTerraForm.valid) {
      console.log('MovimentoTerraForm', this.MovimentoTerraForm.value);
      this.messageService.add({
        severity: 'success',
        summary: 'Preventivo Inviato!',
        detail: 'Ti contatteremo al più presto!'
      });
      this.MovimentoTerraForm.reset();
      timer(2000).subscribe(() => {
        // Reindirizza alla home page dopo 3 secondi
        window.location.href = '/';
      });
    } else { // Da gestire il caso in cui il form non è valido
      this.messageService.add({
        severity: 'error',
        summary: 'Errore',
        detail: 'Si è verificato un errore durante l\'invio del preventivo. Riprova più tardi.'
      });
    }
  }
}