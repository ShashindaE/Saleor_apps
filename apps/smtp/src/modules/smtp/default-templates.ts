import { MessageEventTypes } from "../event-handlers/message-event-types";

const brandLogoSection = `<mj-section padding-bottom="24px" css-class="header-section">
  <mj-column>
    {{#if logoUrl}}
      <mj-image src="{{logoUrl}}" alt="PMTraders" width="120px" align="center" />
    {{/if}}
  </mj-column>
</mj-section>`;

const premiumFooterSection = `<mj-section padding-top="40px" padding-bottom="24px">
  <mj-column>
    <mj-text align="center" font-size="12px" color="#666666">
      © 2024 PMTraders. All rights reserved.
    </mj-text>
    <mj-text align="center" font-size="12px" color="#666666">
      Questions? Reply to this email.
    </mj-text>
  </mj-column>
</mj-section>`;

const addressSection = `<mj-section padding="0px 24px 24px 24px">
  <mj-column width="48%">
    <mj-text font-weight="bold" font-size="14px" color="#18181b" padding-bottom="8px">Billing Address</mj-text>
    <mj-text font-size="14px" color="#52525b" line-height="1.5">
      {{#if order.billingAddress}}
        {{ order.billingAddress.streetAddress1 }}<br/>
        {{ order.billingAddress.city }} {{ order.billingAddress.postalCode }}
      {{else}}
        No billing address
      {{/if}}
    </mj-text>
  </mj-column>
  <mj-column width="4%">
  </mj-column>
  <mj-column width="48%">
    <mj-text font-weight="bold" font-size="14px" color="#18181b" padding-bottom="8px">Shipping Address</mj-text>
    <mj-text font-size="14px" color="#52525b" line-height="1.5">
      {{#if order.shippingAddress}}
        {{ order.shippingAddress.streetAddress1}}<br/>
        {{ order.shippingAddress.city }} {{ order.shippingAddress.postalCode }}
      {{else}}
        No shipping required
      {{/if}}
    </mj-text>
  </mj-column>
</mj-section>`;

const addressSectionForNotify = `<mj-section padding="0px 24px 24px 24px">
  <mj-column width="48%">
    <mj-text font-weight="bold" font-size="14px" color="#18181b" padding-bottom="8px">Billing Address</mj-text>
    <mj-text font-size="14px" color="#52525b" line-height="1.5">
      {{#if order.billing_address}}
        {{ order.billing_address.street_address_1 }}<br/>
        {{ order.billing_address.city }} {{ order.billing_address.postal_code }}
      {{else}}
        No billing address
      {{/if}}
    </mj-text>
  </mj-column>
  <mj-column width="4%">
  </mj-column>
  <mj-column width="48%">
    <mj-text font-weight="bold" font-size="14px" color="#18181b" padding-bottom="8px">Shipping Address</mj-text>
    <mj-text font-size="14px" color="#52525b" line-height="1.5">
      {{#if order.shipping_address}}
        {{ order.shipping_address.street_address_1}}<br/>
        {{ order.shipping_address.city }} {{ order.shipping_address.postal_code }}
      {{else}}
        No shipping required
      {{/if}}
    </mj-text>
  </mj-column>
</mj-section>`;

const orderLinesSection = `<mj-section padding="0px 24px">
  <mj-column>
    <mj-table padding="0">
      <tr style="border-bottom:1px solid #e4e4e7; text-align:left;">
        <th style="padding: 12px 0; font-weight: 600; color: #71717a; font-size: 12px; text-transform: uppercase;">Item</th>
        <th style="padding: 12px 0; font-weight: 600; color: #71717a; font-size: 12px; text-transform: uppercase; text-align: right;">Qty/Wt</th>
        <th style="padding: 12px 0; font-weight: 600; color: #71717a; font-size: 12px; text-transform: uppercase; text-align: right;">Price</th>
      </tr>
      {{#each order.lines }}
        <tr style="border-bottom:1px solid #f4f4f5;">
          <td style="padding: 12px 0; color: #18181b; font-size: 14px; font-weight: 500;">
            {{ this.productName }} <span style="color: #71717a; font-weight: 400;">- {{ this.variantName }}</span>
          </td>
          <td style="padding: 12px 0; color: #18181b; font-size: 14px; text-align: right;">
            {{ this.quantity }}
          </td>
          <td style="padding: 12px 0; color: #18181b; font-size: 14px; text-align: right;">
             {{ this.totalPrice.gross.amount }} {{ this.totalPrice.gross.currency }}
          </td>
        </tr>
      {{/each}}
      <tr>
        <td colspan="2" style="padding: 16px 0 8px 0; text-align: right; color: #71717a; font-size: 14px;">Shipping</td>
        <td style="padding: 16px 0 8px 0; text-align: right; color: #18181b; font-size: 14px;">
          {{ order.shippingPrice.gross.amount }} {{ order.shippingPrice.gross.currency }}
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 8px 0; text-align: right; font-weight: 700; color: #18181b; font-size: 16px;">Total</td>
        <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #18181b; font-size: 16px;">
          {{ order.total.gross.amount }} {{ order.total.gross.currency }}
        </td>
      </tr>
    </mj-table>
  </mj-column>
</mj-section>`;

const defaultOrderCreatedMjmlTemplate = `<mjml>
  <mj-head>
    <mj-style>
      .body-bg { background-color: #f4f4f5; }
      .card-shadow { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    </mj-style>
    <mj-attributes>
      <mj-text font-family="Inter, Helvetica, Arial, sans-serif" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f4f4f5">
    <mj-section padding="20px 0"></mj-section>
    <mj-wrapper background-color="#ffffff" padding="40px 0" border-radius="12px" css-class="card-shadow">
      ${brandLogoSection}
      <mj-section padding="0px 24px 32px 24px">
        <mj-column>
          <mj-text font-size="24px" font-weight="700" align="center" color="#18181b" padding-bottom="8px">
            Order Confirmed
          </mj-text>
          <mj-text font-size="16px" align="center" color="#52525b">
            Thanks for your order! We've received order #{{ order.number }} and will begin processing it soon.
          </mj-text>
        </mj-column>
      </mj-section>
      ${addressSection}
      ${orderLinesSection}
    </mj-wrapper>
    ${premiumFooterSection}
  </mj-body>
</mjml>`;

const defaultOrderConfirmedMjmlTemplate = defaultOrderCreatedMjmlTemplate;

const defaultOrderFulfilledMjmlTemplate = defaultOrderCreatedMjmlTemplate
  .replace("Order Confirmed", "Order Fulfilled")
  .replace("We've received order", "We've shipped order")
  .replace("begin processing it soon", "it is on the way");

const defaultOrderFullyPaidMjmlTemplate = `<mjml>
  <mj-body>
    ${brandLogoSection}
    <mj-section>
      <mj-column>
        <mj-text font-size="16px">
          Hello!
        </mj-text>
        <mj-text>
          Order {{ order.number }} has been fully paid.
        </mj-text>
      </mj-column>
    </mj-section>
    ${addressSection}
    ${orderLinesSection}  
  </mj-body>
</mjml>`;

const defaultOrderRefundedMjmlTemplate = `<mjml>
  <mj-body>
    ${brandLogoSection}
    <mj-section>
      <mj-column>
        <mj-text font-size="16px">
          Hello!
        </mj-text>
        <mj-text>
          Order {{ order.number }} has been refunded.
        </mj-text>
      </mj-column>
    </mj-section>
    ${addressSection}
    ${orderLinesSection}  
  </mj-body>
</mjml>`;

const defaultOrderCancelledMjmlTemplate = `<mjml>
  <mj-body>
    ${brandLogoSection}
    <mj-section>
      <mj-column>
        <mj-text font-size="16px">
            Hello!
        </mj-text>
        <mj-text>
          Order {{ order.number }} has been cancelled.
        </mj-text>
      </mj-column>
    </mj-section>
    ${addressSection}
    ${orderLinesSection}
  </mj-body>
</mjml>`;

const defaultInvoiceSentMjmlTemplate = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px">
          Hi!
        </mj-text>
        <mj-text>
          New invoice has been created
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

// TODO: Improve the template
const defaultGiftCardSentMjmlTemplate = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px">
          Hi!
        </mj-text>
        <mj-text>
          Heres your gift card
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

const defaultAccountConfirmationMjmlTemplate = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px">
          Hi {{user.first_name}}!
        </mj-text>
        <mj-text>
          Your account has been created. Please follow the link to activate it: 
        </mj-text>
        <mj-button href="{{confirm_url}}"  background-color="black" color="white" padding-top="50px" inner-padding="20px" width="70%">
            Activate the account 
        </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

const defaultAccountPasswordResetMjmlTemplate = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px">
          Hi {{user.first_name}}!
        </mj-text>
        <mj-text>
          Password reset has been requested. Please follow the link to proceed: 
        </mj-text>
        <mj-button href="{{reset_url}}"  background-color="black" color="white" padding-top="50px" inner-padding="20px" width="70%">
            Reset the password 
        </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

const defaultAccountChangeEmailRequestMjmlTemplate = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px">
          Hi {{user.first_name}}!
        </mj-text>
        <mj-text>
          Email address change has been requested. If you want to confirm changing the email address to {{new_email}}, please follow the link: 
        </mj-text>
        <mj-button href="{{redirect_url}}"  background-color="black" color="white" padding-top="50px" inner-padding="20px" width="70%">
            Change the email
        </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

const defaultAccountChangeEmailConfirmationMjmlTemplate = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px">
          Hi {{user.first_name}}!
        </mj-text>
        <mj-text>
          Email address change has been confirmed.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

const defaultAccountDeleteMjmlTemplate = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px">
          Hi {{user.first_name}}!
        </mj-text>
        <mj-text>
          Account deletion has been requested. If you want to confirm, please follow the link: 
        </mj-text>
        <mj-button href="{{redirect_url}}"  background-color="black" color="white" padding-top="50px" inner-padding="20px" width="70%">
            Delete the account
        </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

const defaultOrderFulfillmentUpdatedMjmlTemplate = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px">
            Hello!
        </mj-text>
        <mj-text>
          Fulfillment for the order {{ order.number }} has been updated.
        </mj-text>
        {{#if fulfillment.tracking_number }}
          <mj-text>
            Tracking number: {{ fulfillment.tracking_number }}
          </mj-text>
        {{/if}}
      </mj-column>
    </mj-section>
    ${addressSectionForNotify}
  </mj-body>
</mjml>`;

export const defaultMjmlTemplates: Record<MessageEventTypes, string> = {
  ACCOUNT_CHANGE_EMAIL_CONFIRM: defaultAccountChangeEmailConfirmationMjmlTemplate,
  ACCOUNT_CHANGE_EMAIL_REQUEST: defaultAccountChangeEmailRequestMjmlTemplate,
  ACCOUNT_CONFIRMATION: defaultAccountConfirmationMjmlTemplate,
  ACCOUNT_DELETE: defaultAccountDeleteMjmlTemplate,
  ACCOUNT_PASSWORD_RESET: defaultAccountPasswordResetMjmlTemplate,
  GIFT_CARD_SENT: defaultGiftCardSentMjmlTemplate,
  INVOICE_SENT: defaultInvoiceSentMjmlTemplate,
  ORDER_CANCELLED: defaultOrderCancelledMjmlTemplate,
  ORDER_CONFIRMED: defaultOrderConfirmedMjmlTemplate,
  ORDER_CREATED: defaultOrderCreatedMjmlTemplate,
  ORDER_FULFILLED: defaultOrderFulfilledMjmlTemplate,
  ORDER_FULFILLMENT_UPDATE: defaultOrderFulfillmentUpdatedMjmlTemplate,
  ORDER_FULLY_PAID: defaultOrderFullyPaidMjmlTemplate,
  ORDER_REFUNDED: defaultOrderRefundedMjmlTemplate,
};

export const defaultMjmlSubjectTemplates: Record<MessageEventTypes, string> = {
  ACCOUNT_CHANGE_EMAIL_CONFIRM: "Email change confirmation",
  ACCOUNT_CHANGE_EMAIL_REQUEST: "Email change request",
  ACCOUNT_CONFIRMATION: "Account activation",
  ACCOUNT_DELETE: "Account deletion",
  ACCOUNT_PASSWORD_RESET: "Password reset request",
  GIFT_CARD_SENT: "Gift card",
  INVOICE_SENT: "New invoice has been created",
  ORDER_CANCELLED: "Order {{ order.number }} has been cancelled",
  ORDER_CONFIRMED: "Order {{ order.number }} has been confirmed",
  ORDER_CREATED: "Order {{ order.number }} has been created",
  ORDER_FULFILLED: "Order {{ order.number }} has been fulfilled",
  ORDER_FULFILLMENT_UPDATE: "Fulfillment for order {{ order.number }} has been updated",
  ORDER_FULLY_PAID: "Order {{ order.number }} has been fully paid",
  ORDER_REFUNDED: "Order {{ order.number }} has been refunded",
};
