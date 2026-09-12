export type ProgramRequestStatus = "yeni" | "inceleniyor" | "tamamlandi";

export type ProgramRequest = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  kvkkConsent?: boolean;
  marketingConsent?: boolean;
  description: string;
  category: string;
  aiSummary: string;
  aiQuestions: string[];
  status: ProgramRequestStatus;
  createdAt: string;
  ip?: string;
};