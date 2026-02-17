export interface SupabaseContactsInterface {
  id: number;
  created_at: string;
  name: string;
  phone_number: number;
  email: string;
  color: string;
}

export interface NewContactsInterface {
  name: string;
  phone_number: number;
  email: string;
  color: string;
}
