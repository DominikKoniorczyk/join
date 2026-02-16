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
      .update({ newData })
      .eq('id', id)
    if (error) throw error;
  }
}
