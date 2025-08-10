// Temporary type shim until '@polar-sh/nextjs' is installed
declare module '@polar-sh/nextjs' {
  import type { NextRequest, NextResponse } from 'next/server';

  type EnvString = string | undefined;

  // Minimal Polar type models used by our app
  export type PolarMetadata = Record<string, string>;

  export interface PolarCustomer {
    id: string;
    metadata?: PolarMetadata;
    externalId?: string;
  }

  export interface PolarSubscription {
    customer?: PolarCustomer;
  }

  export interface PolarOrder {
    customer?: PolarCustomer;
    metadata?: PolarMetadata;
  }

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

  type WebhookEvent<T = unknown> = { type: string; data: T };

  export function Webhooks(config: {
    webhookSecret: string;
    onPayload?: (payload: WebhookEvent) => Promise<void> | void;
    onCheckoutCreated?: (event: WebhookEvent) => Promise<void> | void;
    onCheckoutUpdated?: (event: WebhookEvent) => Promise<void> | void;
    onOrderCreated?: (event: WebhookEvent<PolarOrder>) => Promise<void> | void;
    onOrderPaid?: (event: WebhookEvent<PolarOrder>) => Promise<void> | void;
    onOrderRefunded?: (event: WebhookEvent<PolarOrder>) => Promise<void> | void;
    onRefundCreated?: (event: WebhookEvent) => Promise<void> | void;
    onRefundUpdated?: (event: WebhookEvent) => Promise<void> | void;
    onSubscriptionCreated?: (event: WebhookEvent<PolarSubscription>) => Promise<void> | void;
    onSubscriptionUpdated?: (event: WebhookEvent<PolarSubscription>) => Promise<void> | void;
    onSubscriptionActive?: (event: WebhookEvent<PolarSubscription>) => Promise<void> | void;
    onSubscriptionCanceled?: (event: WebhookEvent<PolarSubscription>) => Promise<void> | void;
    onSubscriptionRevoked?: (event: WebhookEvent<PolarSubscription>) => Promise<void> | void;
    onSubscriptionUncanceled?: (event: WebhookEvent<PolarSubscription>) => Promise<void> | void;
    onProductCreated?: (event: WebhookEvent) => Promise<void> | void;
    onProductUpdated?: (event: WebhookEvent) => Promise<void> | void;
    onOrganizationUpdated?: (event: WebhookEvent) => Promise<void> | void;
    onBenefitCreated?: (event: WebhookEvent) => Promise<void> | void;
    onBenefitUpdated?: (event: WebhookEvent) => Promise<void> | void;
    onBenefitGrantCreated?: (event: WebhookEvent) => Promise<void> | void;
    onBenefitGrantUpdated?: (event: WebhookEvent) => Promise<void> | void;
    onBenefitGrantRevoked?: (event: WebhookEvent) => Promise<void> | void;
    onCustomerCreated?: (event: WebhookEvent<PolarCustomer>) => Promise<void> | void;
    onCustomerUpdated?: (event: WebhookEvent<PolarCustomer>) => Promise<void> | void;
    onCustomerDeleted?: (event: WebhookEvent<PolarCustomer>) => Promise<void> | void;
    onCustomerStateChanged?: (event: WebhookEvent<PolarCustomer>) => Promise<void> | void;
  }): (req: NextRequest) => Promise<NextResponse> | NextResponse;
}


