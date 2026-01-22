export interface PreventivoNccPayload {
  description: string;
  partenza: string;
  arrivo: string;
  userNonAutenticato: {
    name: string;
    surname: string;
    phoneNumber: string;
    ip: string;
    email: string;
  };
}
