export interface ICreateQuoteDTO {
  is_juridical: boolean;
  user_id: string;
  vehicle_id: string;
  insurance_type_id?: number | null;
  insurance_company_id?: number | null;
  service_type_id: number | null ;
  franchise_price?: number | null;
  service_price?: number;
  user_notes?: string | null;
  partner_notes?: string | null;
}