/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * CloudPayments Widget TypeScript Declarations
 * @see https://developers.cloudpayments.ru/#platezhnyy-vidzhet
 */

interface CloudPaymentsRecurrent {
  interval: 'Day' | 'Week' | 'Month';
  period: number;
  amount?: number;
  startDate?: string;
  maxPeriods?: number;
}

interface CloudPaymentsUserInfo {
  accountId?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  [key: string]: any;
}

interface CloudPaymentsIntentParams {
  publicTerminalId: string;
  description: string;
  amount: number;
  currency: string;
  email?: string;
  skin?: 'classic' | 'modern';
  autoClose?: number;
  paymentSchema?: 'Single' | 'Dual';
  userInfo?: CloudPaymentsUserInfo;
  recurrent?: CloudPaymentsRecurrent;
  metadata?: Record<string, any>;
  data?: Record<string, any>;
  successRedirectUrl?: string;
  failRedirectUrl?: string;
  invoiceId?: string;
  externalId?: string;
  emailBehavior?: 'Required' | 'Hidden' | 'Optional';
  retryPayment?: boolean;
  [key: string]: any;
}

interface CloudPaymentsWidgetResult {
  success: boolean;
  reason?: string;
  [key: string]: any;
}

declare class CloudPaymentsWidget {
  oncomplete?: (result: CloudPaymentsWidgetResult) => void;
  start(params: CloudPaymentsIntentParams): Promise<CloudPaymentsWidgetResult>;
}

declare namespace cp {
  class CloudPayments extends CloudPaymentsWidget { }
}

interface Window {
  cp: typeof cp;
}
