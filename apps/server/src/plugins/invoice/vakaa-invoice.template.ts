export const vakaaInvoiceTemplate = `
<!DOCTYPE html>
<html lang="fr" style="margin: 0; padding: 0;">
<head>
  <meta charset="utf-8" />
  <title>Facture {{ invoicePrefix }}{{ invoiceNumber }} - {{ order.code }} - Maison VAKÁA</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 14mm 16mm 14mm 16mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1D120A;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      font-size: 10.5px;
      line-height: 1.5;
      letter-spacing: -0.01em;
    }
    .serif-display {
      font-family: 'Cormorant Garamond', 'Didot', 'Bodoni MT', 'Cinzel', Georgia, serif;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .brand-mark {
      font-size: 26px;
      font-weight: 600;
      letter-spacing: 0.32em;
      color: #1D120A;
      text-transform: uppercase;
      margin: 0;
      line-height: 1.1;
    }
    .brand-subtitle {
      font-size: 8px;
      font-weight: 600;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: #9A7426;
      margin-top: 4px;
    }
    .brand-atelier-info {
      font-size: 9px;
      color: #7A685D;
      line-height: 1.55;
      margin-top: 8px;
    }
    .invoice-title {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #1D120A;
      text-align: right;
      margin: 0;
      line-height: 1.1;
    }
    .invoice-ref-badge {
      display: inline-block;
      background: #FAF8F5;
      border: 1px solid #E7DED0;
      border-radius: 4px;
      padding: 3px 12px;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 0.08em;
      color: #1D120A;
      margin-top: 6px;
    }
    .invoice-meta-row {
      margin-top: 8px;
      font-size: 9.5px;
      color: #553A26;
      text-align: right;
      line-height: 1.6;
    }
    .status-settled {
      color: #9A7426;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .maison-rule-wrapper {
      position: relative;
      margin-bottom: 22px;
      text-align: center;
    }
    .maison-rule {
      height: 1px;
      background: #E7DED0;
      border: 0;
      margin: 0;
    }
    .maison-rule-accent {
      position: absolute;
      top: -5px;
      left: 50%;
      transform: translateX(-50%);
      background: #FFFFFF;
      padding: 0 10px;
      color: #D4A43C;
      font-size: 9px;
      letter-spacing: 0.2em;
    }
    .info-grid {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .info-card {
      width: 48%;
      vertical-align: top;
      background: #FAF8F5;
      border: 1px solid #E7DED0;
      border-radius: 6px;
      padding: 14px 16px;
    }
    .info-card-header {
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #9A7426;
      border-bottom: 1px solid #EDE7DF;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .recipient-name {
      font-size: 13.5px;
      font-weight: 600;
      color: #1D120A;
      margin-bottom: 4px;
      letter-spacing: 0.02em;
    }
    .info-line {
      margin-bottom: 2.5px;
      color: #4A3528;
      font-size: 9.5px;
      line-height: 1.45;
    }
    .info-line strong {
      color: #1D120A;
      font-weight: 600;
    }
    .certified-pill {
      display: inline-block;
      margin-top: 8px;
      padding: 5px 10px;
      background: #F4EFEA;
      border: 1px solid #E5DCD0;
      border-radius: 4px;
      color: #553A26;
      font-size: 8.5px;
      font-weight: 600;
      letter-spacing: 0.04em;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .items-table thead tr {
      border-top: 1px solid #1D120A;
      border-bottom: 1px solid #1D120A;
      background: #FAF8F5;
    }
    .items-table th {
      padding: 9px 10px;
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #1D120A;
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
    .items-table tbody tr {
      border-bottom: 1px solid #F0EAE1;
    }
    .items-table td {
      padding: 12px 10px;
      font-size: 10px;
      vertical-align: middle;
      color: #1D120A;
    }
    .product-title {
      font-size: 13px;
      font-weight: 600;
      color: #1D120A;
      letter-spacing: 0.01em;
      margin-bottom: 2px;
    }
    .product-craft-note {
      font-size: 8.5px;
      color: #7A685D;
      letter-spacing: 0.02em;
    }
    .num-tabular {
      font-variant-numeric: tabular-nums;
      font-feature-settings: 'tnum';
    }
    .totals-container {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 26px;
    }
    .seal-cell {
      width: 48%;
      vertical-align: middle;
      padding-left: 6px;
    }
    .totals-cell {
      width: 48%;
      vertical-align: top;
    }
    .totals-table {
      width: 100%;
      border-collapse: collapse;
    }
    .totals-table td {
      padding: 5px 8px;
      font-size: 10px;
      color: #553A26;
    }
    .totals-table tr.total-divider td {
      padding: 0;
      border-bottom: 1px solid #E7DED0;
    }
    .totals-table tr.grand-total {
      background: #FAF8F5;
      border: 1px solid #1D120A;
    }
    .totals-table tr.grand-total td {
      padding: 9px 12px;
      font-size: 13px;
      font-weight: 700;
      color: #1D120A;
      letter-spacing: 0.02em;
    }
    .footer-wrapper {
      border-top: 1px solid #E7DED0;
      padding-top: 14px;
      text-align: center;
    }
    .footer-manifesto {
      font-size: 10px;
      font-style: italic;
      color: #553A26;
      line-height: 1.6;
      margin-bottom: 8px;
      max-width: 90%;
      margin-left: auto;
      margin-right: auto;
    }
    .footer-legal {
      font-size: 8px;
      color: #8C7B70;
      letter-spacing: 0.06em;
      line-height: 1.6;
      text-transform: uppercase;
    }
  </style>
</head>
<body>

  <!-- 1. Maison Header & Document Header -->
  <table class="header-table">
    <tr>
      <td style="width: 54%; vertical-align: top;">
        <!-- Brand Insignia & Wordmark -->
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 6px;">
            <circle cx="20" cy="20" r="18.5" stroke="#D4A43C" stroke-width="1.2" stroke-dasharray="2 1.5"/>
            <circle cx="20" cy="20" r="15" stroke="#1D120A" stroke-width="1"/>
            <polygon points="20,8 24,17 33,20 24,23 20,32 16,23 7,20 16,17" fill="#D4A43C" opacity="0.9"/>
          </svg>
          <span class="brand-mark serif-display">VAKÁA</span>
        </div>
        <div class="brand-subtitle">Maison de Haute Maroquinerie d'Art</div>
        <div class="brand-atelier-info">
          Ateliers d'Art &bull; Paris &bull; Douala &bull; Abidjan<br />
          Matières nobles &bull; Raphia sauvage &bull; Cuirs tannage végétal<br />
          concierge@vakaa.store &bull; www.vakaa.store
        </div>
      </td>
      <td style="width: 46%; vertical-align: top; text-align: right;">
        {{#if isCreditInvoice}}
          <div class="invoice-title serif-display" style="color: #991B1B;">Avoir d'Atelier</div>
          <div class="invoice-ref-badge" style="color: #991B1B; border-color: #F87171;">
            N° AV-{{ invoiceNumber }}
          </div>
        {{else}}
          <div class="invoice-title serif-display">Facture Acquittée</div>
          <div class="invoice-ref-badge">
            N° VAK-{{ invoiceNumber }}
          </div>
        {{/if}}
        <div class="invoice-meta-row">
          <div><strong>Date d'émission :</strong> {{ orderDate }}</div>
          <div><strong>Réf. Commande :</strong> #{{ order.code }}</div>
          {{#if originalInvoiceNumber}}
            <div><strong>Facture d'origine :</strong> VAK-{{ originalInvoiceNumber }}</div>
          {{/if}}
          <div><strong>Statut de règlement :</strong> <span class="status-settled">&#9679; Paiement Confirmé</span></div>
        </div>
      </td>
    </tr>
  </table>

  <!-- Maison Hairline Divider with Accent Glyph -->
  <div class="maison-rule-wrapper">
    <hr class="maison-rule" />
    <span class="maison-rule-accent serif-display">&#9670; &bull; &#9670;</span>
  </div>

  <!-- 2. Client Coordinates & Shipping / Payment Logistics -->
  <table class="info-grid">
    <tr>
      <td class="info-card">
        <div class="info-card-header">Destinataire & Facturation</div>
        {{#if order.customer}}
          <div class="recipient-name serif-display">
            {{ order.customer.firstName }} {{ order.customer.lastName }}
          </div>
          <div class="info-line"><strong>Courriel :</strong> {{ order.customer.emailAddress }}</div>
        {{/if}}
        {{#if order.shippingAddress}}
          {{#unless order.customer}}
            <div class="recipient-name serif-display">
              {{ order.shippingAddress.fullName }}
            </div>
          {{/unless}}
          <div class="info-line">{{ order.shippingAddress.streetLine1 }}</div>
          {{#if order.shippingAddress.streetLine2}}
            <div class="info-line">{{ order.shippingAddress.streetLine2 }}</div>
          {{/if}}
          <div class="info-line">
            {{ order.shippingAddress.city }}{{#if order.shippingAddress.postalCode}}, {{ order.shippingAddress.postalCode }}{{/if}}
          </div>
          <div class="info-line"><strong>Pays :</strong> {{ order.shippingAddress.country }}</div>
          {{#if order.shippingAddress.phoneNumber}}
            <div class="info-line" style="margin-top: 3px;"><strong>Conciergerie Tél :</strong> {{ order.shippingAddress.phoneNumber }}</div>
          {{/if}}
        {{/if}}
      </td>
      <td style="width: 4%;"></td>
      <td class="info-card">
        <div class="info-card-header">Expédition & Mode de Règlement</div>
        <div class="info-line"><strong>Service d'envoi :</strong> {{ shippingMethodName }}</div>
        <div class="info-line"><strong>Mode de paiement :</strong> {{ paymentMethodName }}</div>
        <div class="info-line"><strong>Devise de transaction :</strong> {{ order.currencyCode }}</div>
        <div class="certified-pill">
          &#10003; Pièce emballée sous coffret d'art VAKÁA &bull; Envoi sécurisé garanti
        </div>
      </td>
    </tr>
  </table>

  <!-- 3. Line Items Table -->
  <table class="items-table">
    <thead>
      <tr>
        <th style="width: 52%;">Désignation de la Pièce</th>
        <th class="text-center" style="width: 14%;">Quantité</th>
        <th class="text-right" style="width: 17%;">Prix Unitaire TTC</th>
        <th class="text-right" style="width: 17%;">Total Net</th>
      </tr>
    </thead>
    <tbody>
      {{#each formattedLines}}
      <tr>
        <td>
          <div class="product-title serif-display">{{ name }}</div>
          <div class="product-craft-note">
            {{#if variantName}}
              Finition Atelier : {{ variantName }} &bull;
            {{/if}}
            Confection artisanale d'art &bull; Raphia & cuir sélectionnés
          </div>
        </td>
        <td class="text-center num-tabular" style="font-weight: 600;">
          {{ quantity }}
        </td>
        <td class="text-right num-tabular" style="color: #553A26;">
          {{ unitPrice }}
        </td>
        <td class="text-right num-tabular" style="font-weight: 700; color: #1D120A;">
          {{ linePrice }}
        </td>
      </tr>
      {{/each}}
    </tbody>
  </table>

  <!-- 4. Authenticity Seal & Financial Totals Breakdown -->
  <table class="totals-container">
    <tr>
      <!-- Official Workshop Seal -->
      <td class="seal-cell">
        <div style="display: flex; align-items: center; gap: 14px;">
          <svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" stroke="#D4A43C" stroke-width="1.5" stroke-dasharray="3 2"/>
            <circle cx="50" cy="50" r="41" stroke="#1D120A" stroke-width="1"/>
            <circle cx="50" cy="50" r="32" stroke="#D4A43C" stroke-width="0.8"/>
            <path id="curve" d="M 22 50 A 28 28 0 1 1 78 50" fill="none"/>
            <text font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" font-weight="700" fill="#9A7426" letter-spacing="1.2">
              <textPath href="#curve" startOffset="50%" text-anchor="middle">
                MAISON VAKÁA
              </textPath>
            </text>
            <polygon points="50,38 54,47 63,50 54,53 50,62 46,53 37,50 46,47" fill="#D4A43C"/>
            <text x="50" y="73" font-family="'Plus Jakarta Sans', sans-serif" font-size="5.5" font-weight="600" fill="#7A685D" text-anchor="middle" letter-spacing="0.8">
              ATELIER D'ART
            </text>
          </svg>
          <div style="font-size: 8.5px; color: #7A685D; line-height: 1.5;">
            <strong style="color: #1D120A; letter-spacing: 0.08em; text-transform: uppercase;">Certificat de Conformité</strong><br />
            Chaque pièce VAKÁA est vérifiée manuellement par nos artisans maroquiniers avant scellement.
          </div>
        </div>
      </td>
      <td style="width: 4%;"></td>
      <!-- Financial Totals -->
      <td class="totals-cell">
        <table class="totals-table">
          <tr>
            <td style="color: #7A685D;">Sous-total maroquinerie :</td>
            <td class="text-right num-tabular" style="font-weight: 500;">{{ formattedSubTotal }}</td>
          </tr>
          <tr>
            <td style="color: #7A685D;">Expédition sécurisée assurée :</td>
            <td class="text-right num-tabular" style="font-weight: 500;">{{ formattedShipping }}</td>
          </tr>
          {{#if formattedDiscount}}
          <tr>
            <td style="color: #9A7426;">Privilège Maison déduit :</td>
            <td class="text-right num-tabular" style="font-weight: 600; color: #9A7426;">-{{ formattedDiscount }}</td>
          </tr>
          {{/if}}
          <tr class="total-divider">
            <td colspan="2"></td>
          </tr>
          <tr class="grand-total">
            <td class="serif-display" style="font-size: 13px;">Total Réglé TTC :</td>
            <td class="text-right num-tabular serif-display" style="font-size: 14.5px; font-weight: 700;">{{ formattedTotal }}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- 5. Editorial Manifesto & Official Legal Disclosures -->
  <div class="footer-wrapper">
    <div class="footer-manifesto serif-display">
      &laquo; Chaque création VAKÁA perpétue l'excellence du geste artisanal africain, mariant fibres végétales d'exception et finitions sellier de haute maroquinerie. &raquo;
    </div>
    <div class="footer-legal">
      VAKÁA S.A.S. &bull; Maison de Maroquinerie d'Exception &bull; SIRET : 912 485 710 00018 &bull; TVA Intra. : FR 48 912485710<br />
      Ateliers d'Art : 24 Rue de la Paix, 75002 Paris &bull; Quartier Bonapriso, Douala &bull; Conciergerie : concierge@vakaa-outlet.com
    </div>
  </div>

</body>
</html>
`;
