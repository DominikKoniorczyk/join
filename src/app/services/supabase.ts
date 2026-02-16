import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(
      'https://ndtlhvbchxbiuaftuowb.supabase.co',
      'sb_publishable_WuxJeCPnwQLmUudBbPIw8A_Ch0Wc3NV',
    );
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
   *                                   Defaults to '*' which selects all columns.
   *
   * @returns {Promise<any[] | null>}
   * A promise that resolves to:
   * - An array of records if the query is successful (empty array if no data is found).
   * - `null` if an error occurs during the query.
   *
   * @example
   * const users = await getDataFromTable('users');
   *
   * @example
   * const userNames = await getDataFromTable('users', 'id, name');
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
   * Uploads a JSON object to the specified table using an upsert operation.
   *
   * This method inserts a new row into the given table or updates an existing row
   * if a conflict occurs. The JSON payload is stored in the `data` column.
   *
   * @async
   * @param {string} tableName - The name of the target database table.
   * @param {any} jsonData - The JSON object to be inserted or updated.
   * @returns {Promise<any>} A promise that resolves with the inserted or updated row.
   *
   * @throws {Error} Throws an error if the database operation fails.
   *
   * @example
   * const result = await uploadJSONToTable('users', { id: 1, name: 'John' });
   * console.log(result);
   */
  async uploadJSONToTable(tableName: string, jsonData: any) {
    const { data, error } = await this.supabaseClient
      .from(tableName)
      .upsert(
        [{ data: jsonData }],
        { onConflict: jsonData }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
