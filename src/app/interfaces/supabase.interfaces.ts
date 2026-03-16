/**
 * Represents a contact stored in the Supabase database.
 */
 export interface SupabaseContactsInterface {
  id: number;
  created_at: string;
  name: string;
  phone_number: number;
  email: string;
  color: string;
}

/**
 * Represents a new contact to be added (without database-assigned ID or creation timestamp).
 */
 export interface NewContactsInterface {
  name: string;
  phone_number: number;
  email: string;
  color: string;
}
