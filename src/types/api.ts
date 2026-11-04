export type Role = 'USER' | 'ADMIN';

export interface UserDto {
  id: number;
  email: string;
  role: Role;
}

export interface UserRequestDto {
  email: string;
  password: string;
  role: Role;
}

export interface AuthRequestDto {
  email: string;
  password: string;
}

export interface CustomerDto {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
}

export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'OVERDUE';

export interface InvoiceItemDto {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
}

export interface InvoiceDto {
  id?: number;
  customerId: number;
  customerName?: string;
  description: string;
  amount?: number;
  status: InvoiceStatus;
  items: InvoiceItemDto[];
}

export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp?: string;
}

export type FieldErrors = Record<string, string>;

export interface ParsedApiError {
  status: number;
  message: string;
  fieldErrors?: FieldErrors;
}
