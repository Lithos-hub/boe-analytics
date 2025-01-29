import type { Area, Boe, BoePostData, Keyword, MainPoint } from '~/models/boe';

import type { Database } from '~/types/supabase';
import type { BoeRepository } from './supabase.interfaces';
import type { Aspect } from '~/models/boe';

export class SupabaseServices implements BoeRepository {
  private client = useSupabaseClient<Database>();

  async getAllBoes(): Promise<{ date: string }[]> {
    const { data, error } = await this.client.from('boes').select('date');
    if (error) {
      throw new Error(`Error when getting all BOEs: ${error.message}`);
    }
    return data || [];
  }

  async checkBoeAlreadyExists(documentUrl: string): Promise<boolean> {
    const { data, error } = await this.client
      .from('boes')
      .select('url')
      .eq('url', documentUrl);

    if (error) {
      throw new Error(
        `Error when checking if BOE already exists: ${error.message}`,
      );
    }

    return !!data?.length;
  }

  async saveAndReturnBoeId({
    date,
    url,
    summary,
  }: BoePostData): Promise<number | null> {
    const { data, error } = await this.client
      .from('boes')
      .insert({
        date,
        url,
        summary,
      })
      .select()
      .single<Boe>();

    if (error) {
      throw new Error(`Error saving BOE in database: ${error.message}`);
    }

    return data?.id ?? null;
  }

  async updateAndReturnBoeId({
    date,
    url,
    summary,
  }: BoePostData): Promise<number | null> {
    const { data, error } = await this.client
      .from('boes')
      .update({
        url,
        summary,
      })
      .match({ date })
      .select()
      .single<Boe>();

    if (error) {
      throw new Error(`Error updating BOE in database: ${error.message}`);
    }

    return data?.id ?? null;
  }

  async saveAreas(areas: Area[], boeId: number): Promise<void> {
    const { error } = await this.client.from('areas').insert(
      areas.map(({ name, description }) => ({
        boe_id: boeId,
        name,
        description,
      })),
    );

    if (error) {
      console.error('Error saving areas in database:', error);
      throw error;
    }
  }
  async saveMainPoints(mainPoints: MainPoint[], boeId: number): Promise<void> {
    const { error } = await this.client.from('main_points').insert(
      mainPoints.map(({ point }) => ({
        boe_id: boeId,
        point,
      })),
    );

    if (error) {
      console.error('Error saving main points in database:', error);
      throw error;
    }
  }

  async saveKeywords(keywords: Keyword[], boeId: number): Promise<void> {
    const { error } = await this.client.from('keywords').insert(
      keywords.map(({ keyword }) => ({
        boe_id: boeId,
        keyword,
      })),
    );

    if (error) {
      console.error('Error saving keywords in database:', error);
      throw error;
    }
  }

  async saveAspects(aspects: Aspect[], boeId: number): Promise<void> {
    const formattedAspects = aspects.map(({ aspect, type, description }) => ({
      boe_id: boeId,
      aspect,
      type,
      description,
    }));

    const { error } = await this.client
      .from('aspects')
      .insert(formattedAspects);
    if (error)
      throw new Error(`Error guardando aspectos in database: ${error.message}`);
  }
}
