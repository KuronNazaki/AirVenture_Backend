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
  ROLE = 'roles',

  // Account route
  ACCOUNT = 'accounts',
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
