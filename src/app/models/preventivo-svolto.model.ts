export interface PreventivoSvolto {
  id: string;
  richiestaId: string;
  accettato: boolean;
  prezzo: number;
  note?: string;
  calendarEventId?: string; // if scheduled
  createdAt: string;
}
