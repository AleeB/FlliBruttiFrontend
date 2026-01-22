import { Injectable } from '@angular/core';
import { PreventivoNccPayload } from '../models/preventivo-ncc.model';

export interface NccQuoteDraft {
  periodStart?: string;
  periodEnd?: string;
  cittaPartenza?: string;
  cittaArrivo?: string;
  nome?: string;
  cognome?: string;
  mail?: string;
  telefono?: string;
  dettagli?: string;
}

@Injectable({ providedIn: 'root' })
export class NccQuoteStoreService {
  private readonly storageKey = 'ncc_preventivo_draft';
  private draft: NccQuoteDraft;

  constructor() {
    this.draft = this.load();
  }

  getDraft(): NccQuoteDraft {
    return { ...this.draft };
  }

  update(partial: Partial<NccQuoteDraft>): void {
    this.draft = { ...this.draft, ...partial };
    this.save();
  }

  clear(): void {
    this.draft = {};
    this.save();
  }

  hasPeriod(): boolean {
    return Boolean(this.draft.periodStart && this.draft.periodEnd);
  }

  hasCities(): boolean {
    return Boolean(this.draft.cittaPartenza && this.draft.cittaArrivo);
  }

  getPeriodAsDates(): Date[] | null {
    if (!this.draft.periodStart || !this.draft.periodEnd) {
      return null;
    }

    const start = new Date(this.draft.periodStart);
    const end = new Date(this.draft.periodEnd);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return null;
    }

    return [start, end];
  }

  buildSummary(): string {
    return [
      'NCC - Richiesta preventivo',
      `Periodo: ${this.formatDate(this.draft.periodStart)} - ${this.formatDate(this.draft.periodEnd)}`,
      `Citta partenza: ${this.formatValue(this.draft.cittaPartenza)}`,
      `Citta arrivo: ${this.formatValue(this.draft.cittaArrivo)}`,
      `Nome: ${this.formatValue(this.draft.nome)}`,
      `Cognome: ${this.formatValue(this.draft.cognome)}`,
      `Email: ${this.formatValue(this.draft.mail)}`,
      `Telefono: ${this.formatValue(this.draft.telefono)}`,
      `Dettagli: ${this.formatValue(this.draft.dettagli)}`
    ].join('\n');
  }

  buildBackendPayload(ip?: string): PreventivoNccPayload {
    const periodLabel = this.formatPeriodForPayload();
    const details = this.normalizeValue(this.draft.dettagli);
    const descriptionParts = [];
    if (periodLabel) {
      descriptionParts.push(`Periodo: ${periodLabel}`);
    }
    if (details) {
      descriptionParts.push(`Dettagli: ${details}`);
    }

    return {
      description: descriptionParts.join('\n'),
      partenza: this.normalizeValue(this.draft.cittaPartenza),
      arrivo: this.normalizeValue(this.draft.cittaArrivo),
      userNonAutenticato: {
        name: this.normalizeValue(this.draft.nome),
        surname: this.normalizeValue(this.draft.cognome),
        phoneNumber: this.normalizeValue(this.draft.telefono),
        ip: this.normalizeValue(ip),
        email: this.normalizeValue(this.draft.mail)
      }
    };
  }

  private normalizeValue(value?: string): string {
    return value?.trim() ?? '';
  }

  private formatValue(value?: string): string {
    const trimmed = value?.trim();
    return trimmed ? trimmed : '-';
  }

  private formatDate(value?: string): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    const day = this.pad2(date.getDate());
    const month = this.pad2(date.getMonth() + 1);
    return `${day}/${month}/${date.getFullYear()}`;
  }

  private pad2(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  private formatPeriodForPayload(): string {
    const start = this.formatDateForPayload(this.draft.periodStart);
    const end = this.formatDateForPayload(this.draft.periodEnd);
    if (!start || !end) {
      return '';
    }
    return `${start} - ${end}`;
  }

  private formatDateForPayload(value?: string): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const day = this.pad2(date.getDate());
    const month = this.pad2(date.getMonth() + 1);
    return `${day}/${month}/${date.getFullYear()}`;
  }

  private load(): NccQuoteDraft {
    const storage = this.getStorage();
    if (!storage) {
      return {};
    }

    const raw = storage.getItem(this.storageKey);
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed as NccQuoteDraft;
      }
    } catch {
      return {};
    }

    return {};
  }

  private save(): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    storage.setItem(this.storageKey, JSON.stringify(this.draft));
  }

  private getStorage(): Storage | null {
    return typeof localStorage === 'undefined' ? null : localStorage;
  }
}
