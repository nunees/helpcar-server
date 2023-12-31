export interface IUserReturnDTO {
  id?: string;
  cpf: string;
  mobile_phone: string;
  birth_date: Date;
  name: string;
  last_name: string;
  username: string;
  password: string | null;
  email: string;
  avatar: string;
  isPartner?: boolean;
  genderId?: number;
}
