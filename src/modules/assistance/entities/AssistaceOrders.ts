export interface AssistanceOrders{
  id?: string;
  user_id: string;
  assistance_status_id: String;
  order_status: number;
  latitude: string;
  longitude: string;
  total_price: number;
  total_miles: number;
  created_at?: Date;
  updated_at?: Date;
  assistance_status?: {
    id: string;
    user_id: string;
    status: string;
    service_id: string;
    latitude: string;
    longitude: string;
    milesFee: number;
    price: number;
    busy: boolean;
    created_at: Date;
    updated_at?: Date;
    businessCategoriesId: string;
    businessServicesId: string;
  };
  Users?: {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    cpf: string;
    cnpj: string;
    avatar: string;
    created_at: Date;
    updated_at?: Date;
  };
}