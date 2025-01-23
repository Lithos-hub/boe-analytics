import type { Aspect, Boe, BoePostData, Keyword, MainPoint } from "~/models/boe";

import type { Area } from "~/models/boe";

export interface BoeRepository {
    getAllBoes(): Promise<{ date: string }[]>;
    saveAndReturnBoeId(data: BoePostData): Promise<number | null>;
    saveAspects(aspects: Aspect[], boeId: number): Promise<void>;
    saveKeywords(keywords: Keyword[], boeId: number): Promise<void>;
    saveAreas(areas: Area[], boeId: number): Promise<void>;
    saveMainPoints(mainPoints: MainPoint[], boeId: number): Promise<void>;
  }