export interface UserDocument {
  label?: string;
  type?: string;
  pictures?: string[];
  file?: { uri: string; name: string; mimeType?: string };
}

export interface AnalysisData {
  error?: boolean;
  message?: string;
  verdict?: string;
  total_savings?: number | string;
  out_of_pocket?: number | string;
  brand_cost?: number | string;
  generic_cost?: number | string;
  generic_name?: string;
  drug_name?: string;
  provincial_program?: string;
  provincial_link?: string;
  provincial_covered?: boolean;
}
