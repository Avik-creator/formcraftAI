// Temporary type shim until '@polar-sh/nextjs' is installed
declare module '@polar-sh/nextjs' {
  import type { NextRequest, NextResponse } from 'next/server';

  type EnvString = string | undefined;

  export function Checkout(config: {
    accessToken: EnvString;
    successUrl?: EnvString;
    server?: 'sandbox' | 'production';
    theme?: 'dark' | 'light' | 'system' | string;
  }): (req: NextRequest) => Promise<NextResponse> | NextResponse;

  export function CustomerPortal(config: {
    accessToken: EnvString;
    getCustomerId: (req: NextRequest) => string | Promise<string>;
    server?: 'sandbox' | 'production';
  }): (req: NextRequest) => Promise<NextResponse> | NextResponse;

  type WebhookEvent<T = any> = { type: string; data: T };

  export function Webhooks(config: {
    webhookSecret: string;
    onPayload?: (payload: WebhookEvent) => Promise<void> | void;
    onCheckoutCreated?: (event: WebhookEvent) => Promise<void> | void;
    onCheckoutUpdated?: (event: WebhookEvent) => Promise<void> | void;
    onOrderCreated?: (event: WebhookEvent) => Promise<void> | void;
    onOrderPaid?: (event: WebhookEvent) => Promise<void> | void;
    onOrderRefunded?: (event: WebhookEvent) => Promise<void> | void;
    onRefundCreated?: (event: WebhookEvent) => Promise<void> | void;
    onRefundUpdated?: (event: WebhookEvent) => Promise<void> | void;
    onSubscriptionCreated?: (event: WebhookEvent) => Promise<void> | void;
    onSubscriptionUpdated?: (event: WebhookEvent) => Promise<void> | void;
    onSubscriptionActive?: (event: WebhookEvent) => Promise<void> | void;
    onSubscriptionCanceled?: (event: WebhookEvent) => Promise<void> | void;
    onSubscriptionRevoked?: (event: WebhookEvent) => Promise<void> | void;
    onSubscriptionUncanceled?: (event: WebhookEvent) => Promise<void> | void;
    onProductCreated?: (event: WebhookEvent) => Promise<void> | void;
    onProductUpdated?: (event: WebhookEvent) => Promise<void> | void;
    onOrganizationUpdated?: (event: WebhookEvent) => Promise<void> | void;
    onBenefitCreated?: (event: WebhookEvent) => Promise<void> | void;
    onBenefitUpdated?: (event: WebhookEvent) => Promise<void> | void;
    onBenefitGrantCreated?: (event: WebhookEvent) => Promise<void> | void;
    onBenefitGrantUpdated?: (event: WebhookEvent) => Promise<void> | void;
    onBenefitGrantRevoked?: (event: WebhookEvent) => Promise<void> | void;
    onCustomerCreated?: (event: WebhookEvent) => Promise<void> | void;
    onCustomerUpdated?: (event: WebhookEvent) => Promise<void> | void;
    onCustomerDeleted?: (event: WebhookEvent) => Promise<void> | void;
    onCustomerStateChanged?: (event: WebhookEvent) => Promise<void> | void;
  }): (req: NextRequest) => Promise<NextResponse> | NextResponse;
}


