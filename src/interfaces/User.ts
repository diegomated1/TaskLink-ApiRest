export interface User {
  id: string;
  identificationTypeId: number;
  identification: string;
  fullname: string;
  email: string;
  emailVerified: boolean;
  registration_date: Date;
  avatarUrl: string | null;
  phone: string;
  birthdate: string;
  password: string;
  roleId: number;
}