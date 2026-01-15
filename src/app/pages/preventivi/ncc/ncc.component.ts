
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { NccQuoteStoreService } from '../../../services/ncc-quote-store.service';
@Component({
  selector: 'app-ncc',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TableModule, FormsModule, ReactiveFormsModule, InputNumberModule, InputTextModule, CheckboxModule, DatePickerModule],
  templateUrl: './ncc.component.html',
  styleUrls: ['./ncc.component.scss']
})
export class NccComponent {
  nccForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private nccStore: NccQuoteStoreService) {
    const period = this.nccStore.getPeriodAsDates();
    this.nccForm = this.fb.group({
      period: [period, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.nccForm.invalid) {
      this.nccForm.markAllAsTouched();
      return;
    }

    const period = this.nccForm.value.period as Date[] | null;
    const [start, end] = Array.isArray(period) ? period : [];
    if (!start || !end) {
      this.nccForm.setErrors({ rangeIncomplete: true });
      return;
    }
    this.nccStore.update({
      periodStart: start ? start.toISOString() : undefined,
      periodEnd: end ? end.toISOString() : undefined
    });
    this.router.navigate(['/nccCity']);
  }
}
