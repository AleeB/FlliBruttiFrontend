
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoFocusModule } from 'primeng/autofocus';
import { NccQuoteStoreService } from '../../../services/ncc-quote-store.service';


@Component({
  selector: 'app-ncc',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TableModule, FormsModule, ReactiveFormsModule, InputNumberModule, InputTextModule, CheckboxModule, AutoFocusModule],
  templateUrl: './nccCity.component.html',
  styleUrls: ['./nccCity.component.scss']
})
export class NccCityComponent implements OnInit {
  nccForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private nccStore: NccQuoteStoreService) {
    const draft = this.nccStore.getDraft();
    this.nccForm = this.fb.group({
      cittaPartenza: [draft.cittaPartenza ?? '', Validators.required],
      cittaArrivo: [draft.cittaArrivo ?? '', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.nccStore.hasPeriod()) {
      this.router.navigate(['/ncc']);
    }
  }

  onSubmit(): void {
    if (this.nccForm.invalid) {
      this.nccForm.markAllAsTouched();
      return;
    }

    const { cittaPartenza, cittaArrivo } = this.nccForm.value;
    this.nccStore.update({
      cittaPartenza: cittaPartenza?.trim(),
      cittaArrivo: cittaArrivo?.trim()
    });
    this.router.navigate(['/nccDati']);
  }
}
