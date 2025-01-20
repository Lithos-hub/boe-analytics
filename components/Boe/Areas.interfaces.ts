import type { Area } from "~/models/boe";

export interface AreasProps {
  areas: Area[] | null;
  isLoadingAreas: boolean;
}
