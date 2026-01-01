export interface LavoroSvolto {
  id: string;
  preventivoId: string;
  dipendenteId?: string;
  ore?: number;
  viaggi?: number;
  prezzoFinale?: number;
  extra?: string[]; // ZTL, pedaggi, ecc.
  createdAt: string;
}
