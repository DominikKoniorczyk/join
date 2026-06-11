import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../environment/supabasekeys';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  supabaseClient: SupabaseClient;
  colors: string[] = [
    '#ff7a00',
    '#ff5eb3',
    '#6e52ff',
    '#9327ff',
    '#00bee8',
    '#1fd7c1',
    '#ffa35e',
    '#fc71ff',
    '#ffc701',
    '#0038ff',
    '#c3ff2b',
    '#ffe62b',
    '#ff4646',
    '#ffbb2b',
  ];

  constructor() {
    this.supabaseClient = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey,
    );
  }

  /**
   * Generates a random hex color string from the predefined colors array.
   * @returns {string} A hex color code (e.g., '#ff7a00').
   */
  getRandomeColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  /**
   * Fetches data from a specified Supabase table.
   *
   * This method queries the provided table using the Supabase client
   * and returns the selected columns. If no selector is provided,
   * all columns (`*`) will be retrieved.
   *
   * @param {string} tableName - The name of the database table to query.
   * @param {string} [selector='*'] - The column selector string (e.g. '*', 'id,name').
   *
   * @returns {Promise<any[] | null>}
   * A promise that resolves to:
   * - An array of records if the query is successful (empty array if no data is found).
   * - `null` if an error occurs during the query.
   */
  async getDataFromTable(tableName: string, selector: string = '*') {
    const { data, error } = await this.supabaseClient
      .from(tableName)
      .select(selector) as unknown as { data: any, error: any };
    if (error) {
      console.error(error);
      return null;
    }
    return data || [];
  }

  /**
   * Uploads JSON data to a specified Supabase table.
   *
   * This method inserts the provided JSON object or array of objects
   * into the given table using the Supabase client.
   *
   * @async
   * @param {string} tableName - The name of the database table where the data should be inserted.
   * @param {any} jsonData - The JSON object or array of objects to insert into the table.
   * @returns {Promise<any>} A promise that resolves with the inserted data returned by Supabase.
   *
   * @throws {Error} Throws an error if the insert operation fails.
   *
   * @example
   * await uploadJSONToTable('users', {
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * });
   *
   * @example
   * await uploadJSONToTable('users', [
   *   { name: 'John Doe', email: 'john@example.com' },
   *   { name: 'Jane Doe', email: 'jane@example.com' }
   * ]);
   */
  async uploadJSONToTable(tableName: string, jsonData: any) {
    const { data, error } = await this.supabaseClient
      .from(tableName)
      .insert(jsonData)
    if (error) throw error;
    return data;
  }

  /**
   * Deletes a row from the specified database table by its ID.
   *
   * @param {string} tableName - The name of the table from which the row should be deleted.
   * @param {number} id - The unique identifier of the row to delete.
   * @returns {Promise<void>} A promise that resolves when the delete operation has completed.
   *
   * @throws Will throw an error if the delete operation fails.
   */
  async deleteRow(tableName: string, id: number) {
    const { data, error } = await this.supabaseClient
      .from(tableName)
      .delete()
      .eq('id', id)
    if (error) throw error;
  }

  /**
   * Updates a row in the specified table by its ID.
   *
   * @async
   * @param {string} tableName - The name of the table where the row should be updated.
   * @param {any} newData - An object containing the updated field values.
   * @param {number} id - The unique identifier of the row to update.
   *
   * @throws Will throw an error if the update operation fails.
   *
   * @returns {Promise<void>} Resolves when the update operation completes successfully.
   */
  async updateRow(tableName: string, newData: any, id: number) {
    const { error } = await this.supabaseClient
      .from(tableName)
      .update(newData)
      .eq('id', id)
    if (error) throw error;
  }

  /**
   * Registers a new user using email and password via Supabase authentication.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<import('@supabase/supabase-js').AuthResponse>}
   * A promise resolving to the Supabase authentication response containing user and session information.
   */
  async signUpUser(name: string, email: string, password: string) {
    this.uploadJSONToTable("users", { name: name, email: email, color: this.getRandomeColor() });
    return await this.supabaseClient.auth.signUp({ email: email, password: password });
  }

  /**
   * Returns a registered email adress.
   */
  async returnEmailExists(email: string) {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    return !!data;
  }

  /**
   * Signs in an existing user using email and password via Supabase authentication.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<import('@supabase/supabase-js').AuthTokenResponsePassword>}
   * A promise resolving to the Supabase authentication response containing the session and user data.
   */
  async signInUser(email: string, password: string) {
    return await this.supabaseClient.auth.signInWithPassword({ email: email, password: password });
  }

  /**
   * Retrieves the currently authenticated user from Supabase.
   *
   * @returns {Promise<User | null>} A promise resolving to the user object, or null if no user is logged in.
   */
  async getUser(): Promise<User | null> {
    const { data } = await this.supabaseClient.auth.getUser();
    return data.user ?? null;
  }

  /**
   * Signs out the currently authenticated user from Supabase.
   *
   * @returns {Promise<import('@supabase/supabase-js').ApiResponse>} A promise resolving to the sign-out response.
   */
  async logOut() {
    return await this.supabaseClient.auth.signOut();
  }

  /**
   * Fetches a user from the "users" table based on their email address.
   *
   * @param {string} email - The email address of the user to retrieve.
   * @returns {Promise<any[] | null>} A promise resolving to an array of user records, or null if an error occurs.
   */
  async getLoggedInUser(email: string) {
    const { data, error } = await this.supabaseClient
      .from("users")
      .select("*")
      .eq("email", email)
    if (error) {
      console.error(error);
      return null;
    }
    return data || [];
  }
}


