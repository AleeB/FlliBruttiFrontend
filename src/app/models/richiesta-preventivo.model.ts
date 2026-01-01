export interface RichiestaPreventivo {
  id: string;
  clienteId?: string;
  telefono?: string;
  email?: string;
  descrizione: string;
  tipo: 'NCC' | 'MOVIMENTO_TERRA';
  createdAt: string;
  isDeleted?: boolean;
}
