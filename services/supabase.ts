import type { Area, Boe, BoePostData, Keyword, MainPoint } from '~/models/boe';

import type { Database } from '~/types/supabase';
import type { BoeRepository } from './supabase.interfaces';
import type { Aspect } from '~/models/boe';

export class SupabaseServices implements BoeRepository {
  private client = useSupabaseClient<Database>();

  async getAllBoes(): Promise<{ date: string }[]> {
    const { data, error } = await this.client.from('boes').select('date');
    if (error) {
      throw new Error(`Error obteniendo BOEs: ${error.message}`);
    }
    return data || [];
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
      throw new Error(`Error creando BOE: ${error.message}`);
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
      console.error('Error saving areas:', error);
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
      console.error('Error saving main points:', error);
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
      console.error('Error saving keywords:', error);
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
    if (error) throw new Error(`Error guardando aspectos: ${error.message}`);
  }
}
