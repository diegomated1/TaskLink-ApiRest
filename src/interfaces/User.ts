export interface User {
  id: string;
  identification_type_id: number;
  identification: string;
  fullname: string;
  email: string;
  email_verified: boolean;
  registration_date: Date;
  avatar_url: string | null;
  phone: string;
  birthdate: string;
  password: string;
  provider: boolean;
  email_code: number | null;
  email_code_generate: number | null;
  role_id: number;
}