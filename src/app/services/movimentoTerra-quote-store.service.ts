import { Injectable } from '@angular/core';

export interface MovimentoTerraQuoteDraft {
  nomeCognome?: string;
  mail?: string;
  telefono?: string;
  dettagli?: string;
}

@Injectable({ providedIn: 'root' })
export class MovimentoTerraQuoteStoreService {
  private readonly storageKey = 'movimento_terra_preventivo_draft';
  private draft: MovimentoTerraQuoteDraft;

  constructor() {
    this.draft = this.load();
  }

  getDraft(): MovimentoTerraQuoteDraft {
    return { ...this.draft };
  }

  update(partial: Partial<MovimentoTerraQuoteDraft>): void {
    this.draft = { ...this.draft, ...partial };
    this.save();
  }

  clear(): void {
    this.draft = {};
    this.save();
  }

  buildSummary(): string {
    return [
      'Movimento Terra - Richiesta preventivo',
      `Nome e Cognome: ${this.formatValue(this.draft.nomeCognome)}`,
      `Email: ${this.formatValue(this.draft.mail)}`,
      `Telefono: ${this.formatValue(this.draft.telefono)}`,
      `Dettagli: ${this.formatValue(this.draft.dettagli)}`
    ].join('\n');
  }

  private formatValue(value?: string): string {
    const trimmed = value?.trim();
    return trimmed ? trimmed : '-';
  }

  private load(): MovimentoTerraQuoteDraft {
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
        return parsed as MovimentoTerraQuoteDraft;
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
