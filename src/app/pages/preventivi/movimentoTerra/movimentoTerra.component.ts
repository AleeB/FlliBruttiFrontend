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
import { finalize, timer } from 'rxjs';
import { Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { MovimentoTerraQuoteStoreService } from '../../../services/movimentoTerra-quote-store.service';
import { QuoteEmailPayload, QuoteService } from '../../../services/quote.service';

@Component({
  selector: 'app-movimento-terra',
  standalone: true,
  imports: [CommonModule, FileUpload, ToastModule, RouterModule, ButtonModule, TableModule, FormsModule, ReactiveFormsModule, InputNumberModule, InputTextModule, CheckboxModule, TextareaModule],
  templateUrl: './movimentoTerra.component.html',
  styleUrls: ['./movimentoTerra.component.scss'],
  providers: [MessageService, MovimentoTerraQuoteStoreService]
})
export class MovimentoTerraComponent {
  MovimentoTerraForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private movimentoTerraStore: MovimentoTerraQuoteStoreService,
    private quoteService: QuoteService
  ) {
    const draft = this.movimentoTerraStore.getDraft();
    this.MovimentoTerraForm = this.fb.group({
      nomeCognome: [draft.nomeCognome ?? '', Validators.required],
      mail: [draft.mail ?? '', [Validators.required, Validators.email]],
      telefono: [draft.telefono ?? '', Validators.minLength(10)],
      dettagli: [draft.dettagli ?? '']
    });
  }

  onSubmit(): void {
    // Controlla se il form e valido
    if (this.MovimentoTerraForm.invalid) {
      this.MovimentoTerraForm.markAllAsTouched();
      return;
    }

    const { nomeCognome, mail, telefono, dettagli } = this.MovimentoTerraForm.value;
    this.movimentoTerraStore.update({
      nomeCognome: nomeCognome?.trim(),
      mail: mail?.trim(),
      telefono: telefono?.trim(),
      dettagli: dettagli?.trim()
    });

    const payload: QuoteEmailPayload = {
      to: 'polentalessandro@gmail.com, alessiobrutti@outlook.com',
      subject: 'Movimento Terra - Richiesta preventivo',
      body: this.movimentoTerraStore.buildSummary()
    };

    this.isSubmitting = true;
    this.quoteService
      .sendByEmail(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Preventivo Inviato!',
            detail: 'Ti contatteremo al piu presto!'
          });
          this.MovimentoTerraForm.reset();
          this.movimentoTerraStore.clear();
          timer(2000).subscribe(() => {
            // Reindirizza alla home page dopo 3 secondi
            this.router.navigate(['/']);
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Errore',
            detail: 'Invio preventivo non riuscito. Riprova piu tardi.'
          });
        }
      });
  }
}
