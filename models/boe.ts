/**

Table boes

id (Primary Key, Auto Increment)
date (Date, Unique) - The date of the analyzed BOE.
url (Text) - The url of the BOE.
created_at (Timestamp) - The timestamp when the analysis was generated.

Table summaries

id (Primary Key, Auto Increment)
boe_id (Foreign Key) - References boes.id.
summary (Text) - The summary of the BOE.

Table areas

id (Primary Key, Auto Increment)
boe_id (Foreign Key) - References boes.id.
name (Text) - The name of the area.
description (Text) - The description of the area.

Table statistics

id (Primary Key, Auto Increment)
boe_id (Foreign Key) - References boes.id.
type (Enum: 'positive', 'negative', 'neutral') - Type of statistic.
count (Integer) - The count of positive, negative, or neutral aspects.

Table main_points

id (Primary Key, Auto Increment)
boe_id (Foreign Key) - References boes.id.
point (Text) - A main point from the BOE.

Table keywords

id (Primary Key, Auto Increment)
boe_id (Foreign Key) - References boes.id.
keyword (Text) - A keyword from the BOE.

Table aspects

id (Primary Key, Auto Increment)
boe_id (Foreign Key) - References boes.id.
type (Enum: 'positive', 'negative', 'neutral') - Type of aspect.
aspect (Text) - A positive, negative, or neutral aspect from the BOE.

 */

export interface BoeColumn {
  id?: number;
  boe_id?: number;
}

export interface Boe {
  id: number;
  date: string;
  url: string;
}

export interface Area extends BoeColumn {
  name: string;
  description: string;
}

export interface Statistic extends BoeColumn {
  type: string;
  count: number;
}

export interface MainPoint extends BoeColumn {
  point: string;
}

export interface Keyword extends BoeColumn {
  keyword: string;
}

export interface Summary extends BoeColumn {
  summary: string;
}

export interface Aspect extends BoeColumn {
  type: string;
  aspect: string;
  description: string;
}

export interface BoeResponse {
  id: number;
  date: string;
  url: string;
  summary: string | null;
  summaries: Summary[] | null;
  statistics: Statistic[] | null;
  main_points: MainPoint[] | null;
  keywords: Keyword[] | null;
  aspects: Aspect[] | null;
  areas: Area[] | null;
}
