export enum NODE_ENV {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export enum ApiPath {
  BASE = 'api',

  // Auth route
  AUTH = 'auth',
  GOOGLE = 'google',
  GOOGLE_REDIRECT = 'google/redirect',
  REGISTER = 'register',
  LOGIN = 'login',

  // Role route
  ROLES = 'roles',

  // Account route
  ACCOUNTS = 'accounts',
  BOOKING_HISTORY = 'booking-history',

  // Customer route
  CUSTOMERS = 'customers',

  // Airport route
  AIRPORTS = 'airports',

  // Aircraft route
  AIRCRAFTS = 'aircrafts',

  // Flight route
  FLIGHTS = 'flights',
  SEARCH = 'search',

  // Invoice route
  INVOICES = 'invoices',
  VERIFY_TRANSACTION = 'verify-transaction',

  // Seat route
  SEATS = 'seats',

  // Ticket route
  TICKETS = 'tickets',
  RETRIEVE = 'retrieve',
  CANCEL = 'cancel',
  SEND_EMAIL = 'send-email',
  SEND_PAYMENT_EMAIL = 'send-payment-email',
}

export const JWT_SECRET = 'jwtsecret'

export enum RoleEnum {
  CUSTOMER = 'Customer',
  EMPLOYEE = 'Employee',
  ADMINISTRATOR = 'Administrator',
}

export enum InvoiceStatusEnum {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

export enum TicketStatusEnum {
  PENDING = 'Pending',
  ISSUED = 'Issued',
  CANCELLED = 'Cancelled',
}

export enum RolesEnum {
  CUSTOMER = 'None',
  AUTHENTICATED_CUSTOMER = 'Customer',
  EMPLOYEE = 'Employee',
  ADMINISTRATOR = 'Administrator',
}

export enum GenderEnum {
  MALE = 'Male',
  FEMALE = 'Female',
}
