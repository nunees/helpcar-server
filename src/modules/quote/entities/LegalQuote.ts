
export interface LegalQuote{
  id: string;
  hashId: string;
  is_juridian: boolean;
  user_id: string;
  vehicle_id: string;
  insurance_company_id: number;
  insurance_type_id?: number;
  service_type_id: number;
  franchise_price?: number;
  service_price?: number;
  service_description?: string;
  user_notes?: string;
  partner_notes?: string;
  status: string;
  locations: string[];
}