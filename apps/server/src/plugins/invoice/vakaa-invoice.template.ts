export const vakaaInvoiceTemplate = `
<!DOCTYPE html>
<html lang="fr" style="margin: 0; padding: 0;">
<head>
  <meta charset="utf-8" />
  <title>Facture {{ invoicePrefix }}{{ invoiceNumber }} - {{ order.code }}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1D120A;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.5;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: #1B3B2B;
      text-transform: uppercase;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #D4A43C;
      margin-top: 3px;
    }
    .invoice-title {
      font-size: 22px;
      font-weight: 800;
      text-transform: uppercase;
      color: #1B3B2B;
      text-align: right;
      margin: 0;
    }
    .invoice-badge {
      display: inline-block;
      background: #FAF8F5;
      border: 1px solid #E5E0D8;
      border-radius: 20px;
      padding: 3px 10px;
      font-size: 10px;
      font-weight: 700;
      color: #1B3B2B;
      margin-top: 4px;
    }
    .gold-bar {
      height: 3px;
      background: linear-gradient(90deg, #1B3B2B 0%, #D4A43C 100%);
      margin-bottom: 24px;
      border-radius: 2px;
    }
    .info-grid {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
    }
    .info-box {
      width: 48%;
      vertical-align: top;
      background: #FAF8F5;
      border: 1px solid #EFEAE2;
      border-radius: 10px;
      padding: 14px 16px;
    }
    .info-box-title {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #D4A43C;
      margin-bottom: 6px;
    }
    .info-row {
      margin-bottom: 3px;
      color: #3A2418;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .items-table th {
      background: #1B3B2B;
      color: #FFFFFF;
      padding: 10px 12px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      text-align: left;
    }
    .items-table th.text-right,
    .items-table td.text-right {
      text-align: right;
    }
    .items-table th.text-center,
    .items-table td.text-center {
      text-align: center;
    }
    .items-table th:first-child {
      border-top-left-radius: 8px;
    }
    .items-table th:last-child {
      border-top-right-radius: 8px;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #EFEAE2;
      font-size: 11px;
      vertical-align: middle;
    }
    .item-name {
      font-weight: 700;
      color: #1D120A;
      font-size: 11px;
    }
    .item-variant {
      font-size: 9.5px;
      color: #7A685D;
      margin-top: 2px;
    }
    .totals-table {
      width: 42%;
      margin-left: auto;
      border-collapse: collapse;
      margin-bottom: 28px;
    }
    .totals-table td {
      padding: 6px 12px;
      font-size: 11px;
    }
    .totals-table tr.grand-total {
      background: #FAF8F5;
      border-top: 2px solid #1B3B2B;
      border-bottom: 2px solid #1B3B2B;
    }
    .totals-table tr.grand-total td {
      padding: 10px 12px;
      font-weight: 800;
      font-size: 14px;
      color: #1B3B2B;
    }
    .payment-tag {
      background: #E8F5E9;
      color: #1B3B2B;
      border: 1px solid #C8E6C9;
      border-radius: 6px;
      padding: 8px 12px;
      margin-top: 10px;
      font-size: 10px;
      font-weight: 600;
    }
    .footer-section {
      border-top: 1px solid #EFEAE2;
      padding-top: 16px;
      text-align: center;
      color: #7A685D;
      font-size: 9px;
      line-height: 1.6;
    }
    .footer-quote {
      font-style: italic;
      color: #1B3B2B;
      font-weight: 600;
      margin-bottom: 6px;
      font-size: 9.5px;
    }
  </style>
</head>
<body>

  <!-- 1. Header -->
  <table class="header-table">
    <tr>
      <td style="width: 50%; vertical-align: top;">
        <h1 class="brand-title">VAKÁA</h1>
        <div class="brand-subtitle">Maison de Maroquinerie d'Exception</div>
        <div style="margin-top: 8px; font-size: 9.5px; color: #7A685D;">
          Atelier d'Art & Création<br />
          Paris &bull; Cotonou &bull; Abidjan<br />
          contact@vakaa.store &bull; www.vakaa.store
        </div>
      </td>
      <td style="width: 50%; vertical-align: top; text-align: right;">
        {{#if isCreditInvoice}}
          <div class="invoice-title" style="color: #991B1B;">Avoir / Credit Note</div>
          <div class="invoice-badge" style="color: #991B1B; border-color: #F87171;">RÉF: AV-{{ invoiceNumber }}</div>
        {{else}}
          <div class="invoice-title">Facture</div>
          <div class="invoice-badge">N° VAK-{{ invoiceNumber }}</div>
        {{/if}}
        <div style="margin-top: 8px; font-size: 10px; color: #553A26;">
          <strong>Date d'émission :</strong> {{ orderDate }}<br />
          <strong>Réf. Commande :</strong> #{{ order.code }}<br />
          {{#if originalInvoiceNumber}}
            <strong>Facture d'origine :</strong> VAK-{{ originalInvoiceNumber }}<br />
          {{/if}}
          <strong>Statut :</strong> <span style="color: #1B3B2B; font-weight: 700;">Payée & Validée</span>
        </div>
      </td>
    </tr>
  </table>

  <!-- Gradient Divider -->
  <div class="gold-bar"></div>

  <!-- 2. Client & Shipping Info -->
  <table class="info-grid">
    <tr>
      <td class="info-box">
        <div class="info-box-title">Facturé à / Adressé à</div>
        {{#if order.customer}}
          <div style="font-weight: 700; font-size: 12px; color: #1D120A; margin-bottom: 4px;">
            {{ order.customer.firstName }} {{ order.customer.lastName }}
          </div>
          <div class="info-row">{{ order.customer.emailAddress }}</div>
        {{/if}}
        {{#if order.shippingAddress}}
          {{#unless order.customer}}
            <div style="font-weight: 700; font-size: 12px; color: #1D120A; margin-bottom: 4px;">
              {{ order.shippingAddress.fullName }}
            </div>
          {{/unless}}
          <div class="info-row">{{ order.shippingAddress.streetLine1 }}</div>
          {{#if order.shippingAddress.streetLine2}}
            <div class="info-row">{{ order.shippingAddress.streetLine2 }}</div>
          {{/if}}
          <div class="info-row">
            {{ order.shippingAddress.city }}{{#if order.shippingAddress.postalCode}}, {{ order.shippingAddress.postalCode }}{{/if}}
          </div>
          <div class="info-row">{{ order.shippingAddress.country }}</div>
          {{#if order.shippingAddress.phoneNumber}}
            <div class="info-row" style="margin-top: 4px; font-weight: 600;">Tél : {{ order.shippingAddress.phoneNumber }}</div>
          {{/if}}
        {{/if}}
      </td>
      <td style="width: 4%;"></td>
      <td class="info-box">
        <div class="info-box-title">Détails d'Expédition & Paiement</div>
        <div class="info-row"><strong>Mode de livraison :</strong> {{ shippingMethodName }}</div>
        <div class="info-row"><strong>Mode de règlement :</strong> {{ paymentMethodName }}</div>
        <div class="info-row"><strong>Devise :</strong> {{ order.currencyCode }}</div>
        <div class="payment-tag">
          &#10003; Paiement sécurisé validé et consigné par VAKÁA.
        </div>
      </td>
    </tr>
  </table>

  <!-- 3. Line Items Table -->
  <table class="items-table">
    <thead>
      <tr>
        <th style="width: 50%;">Article & Confection</th>
        <th class="text-center" style="width: 15%;">Quantité</th>
        <th class="text-right" style="width: 17%;">Prix Unitaire</th>
        <th class="text-right" style="width: 18%;">Total</th>
      </tr>
    </thead>
    <tbody>
      {{#each formattedLines}}
      <tr>
        <td>
          <div class="item-name">{{ name }}</div>
          {{#if variantName}}
            <div class="item-variant">Finition : {{ variantName }}</div>
          {{/if}}
        </td>
        <td class="text-center" style="font-weight: 600;">
          {{ quantity }}
        </td>
        <td class="text-right" style="color: #553A26;">
          {{ unitPrice }}
        </td>
        <td class="text-right" style="font-weight: 700; color: #1D120A;">
          {{ linePrice }}
        </td>
      </tr>
      {{/each}}
    </tbody>
  </table>

  <!-- 4. Totals Breakdown -->
  <table class="totals-table">
    <tr>
      <td style="color: #7A685D;">Sous-total articles :</td>
      <td class="text-right" style="font-weight: 600;">{{ formattedSubTotal }}</td>
    </tr>
    <tr>
      <td style="color: #7A685D;">Frais de port :</td>
      <td class="text-right" style="font-weight: 600;">{{ formattedShipping }}</td>
    </tr>
    {{#if formattedDiscount}}
    <tr>
      <td style="color: #1B3B2B;">Remise appliquée :</td>
      <td class="text-right" style="font-weight: 600; color: #1B3B2B;">-{{ formattedDiscount }}</td>
    </tr>
    {{/if}}
    <tr class="grand-total">
      <td>Total Réglé TTC :</td>
      <td class="text-right">{{ formattedTotal }}</td>
    </tr>
  </table>

  <div style="clear: both;"></div>

  <!-- 5. Footer with Luxury Artisan Guarantee -->
  <div class="footer-section">
    <div class="footer-quote">
      &laquo; Chaque pièce VAKÁA est confectionnée à la main par nos maîtres maroquiniers avec des matières d'exception. &raquo;
    </div>
    <div>
      VAKÁA S.A.S. &bull; Maison de Maroquinerie d'Art &bull; SIRET : 912 485 710 00018 &bull; TVA Intra. : FR 48 912485710<br />
      Pour toute assistance concernant votre commande, notre Conciergerie est à votre écoute : orders@vakaa.store
    </div>
  </div>

</body>
</html>
`;
