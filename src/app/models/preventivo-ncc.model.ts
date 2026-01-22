export interface PreventivoNccPayload {
  description: string;
  partenza: string;
  arrivo: string;
  userNonAutenticato: {
    name: string;
    surname: string;
    phone: string;
    ip: string;
    email: string;
  };
}
