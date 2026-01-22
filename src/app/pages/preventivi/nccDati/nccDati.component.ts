import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { AutoFocus } from "primeng/autofocus";
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";
import { finalize, forkJoin, timer } from 'rxjs';
import { QuoteEmailPayload, QuoteService } from '../../../services/quote.service';
import { NccQuoteStoreService } from '../../../services/ncc-quote-store.service';

@Component({
  selector: 'app-ncc',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TableModule, FormsModule, ReactiveFormsModule, InputNumberModule, InputTextModule, CheckboxModule, TextareaModule, AutoFocus, Toast],
  templateUrl: './nccDati.component.html',
  styleUrls: ['./nccDati.component.scss'],
  providers: [MessageService]
})
export class NccDatiComponent implements OnInit {
  nccForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private quoteService: QuoteService,
    private nccStore: NccQuoteStoreService
  ) {
    const draft = this.nccStore.getDraft();
    this.nccForm = this.fb.group({
      nome: [draft.nome ?? '', Validators.required],
      cognome: [draft.cognome ?? '', Validators.required],
      mail: [draft.mail ?? '', [Validators.required, Validators.email]],
      telefono: [draft.telefono ?? '', Validators.minLength(10)],
      dettagli: [draft.dettagli ?? '']
    });
  }

  ngOnInit(): void {
    if (!this.nccStore.hasPeriod()) {
      this.router.navigate(['/ncc']);
      return;
    }

    if (!this.nccStore.hasCities()) {
      this.router.navigate(['/nccCity']);
    }
  }

  onSubmit(): void {
    if (this.nccForm.invalid) {
      this.nccForm.markAllAsTouched();
      return;
    }

    const { nome, cognome, mail, telefono, dettagli } = this.nccForm.value;
    this.nccStore.update({
      nome: nome?.trim(),
      cognome: cognome?.trim(),
      mail: mail?.trim(),
      telefono: telefono?.trim(),
      dettagli: dettagli?.trim()
    });

    const payload: QuoteEmailPayload = {
      to: 'polentalessandro@gmail.com, alessiobrutti@outlook.com',
      subject: 'Richiesta preventivo NCC',
      body: this.nccStore.buildSummary()
    };
    const backendPayload = this.nccStore.buildBackendPayload(this.resolveClientIp());

    this.isSubmitting = true;
    forkJoin([
      this.quoteService.sendByEmail(payload),
      this.quoteService.sendNccPreventivo(backendPayload)
    ])
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Preventivo inviato!',
            detail: 'Ti contatteremo al piu presto.'
          });
          this.nccForm.reset();
          this.nccStore.clear();
          timer(2000).subscribe(() => {
            this.router.navigateByUrl('/');
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

  private resolveClientIp(): string {
    if (typeof window === 'undefined') {
      return '';
    }

    return window.location.hostname ?? '';
  }
}
