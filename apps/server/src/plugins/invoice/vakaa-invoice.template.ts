export const vakaaInvoiceTemplate = `
<!DOCTYPE html>
<html lang="fr" style="margin: 0; padding: 0;">
<head>
  <meta charset="utf-8" />
  <title>Facture {{ invoicePrefix }}{{ invoiceNumber }} - {{ order.code }} - Maison VAKÁA</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 12mm 14mm 12mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    :root {
      --paper: #FAF8F5;
      --surface-card: #F5EFEB;
      --border-card: #E4DBD1;
      --border-subtle: #ECE4DA;
      --ink: #140C06;
      --ink-sec: #4A3A2F;
      --ink-muted: #736357;
      --gold: #9B6327;
      --gold-dark: #7D4C18;
      --border-dark: #140C06;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--ink);
      background: var(--paper);
      margin: 0;
      padding: 0;
      font-size: 10.5px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    .font-serif { font-family: 'Playfair Display', Georgia, serif; }
    .font-mono { font-family: 'Space Grotesk', monospace; }
    .font-hand { font-family: 'Alex Brush', cursive; }

    /* 1. HEADER SECTION */
    .header-block {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--border-card);
      margin-bottom: 20px;
    }
    .brand-section {
      display: flex;
      flex-direction: column;
    }
    .brand-logo {
      height: 42px;
      object-fit: contain;
      align-self: flex-start;
    }
    .brand-tagline {
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--gold);
      margin-top: 8px;
    }
    .brand-heritage {
      font-size: 8.5px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ink-sec);
      margin-top: 3px;
    }

    .doc-meta-section {
      text-align: right;
    }
    .doc-title {
      font-size: 34px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.01em;
      color: var(--ink);
      text-transform: uppercase;
      margin: 0;
    }
    .doc-number-badge {
      display: inline-block;
      margin-top: 6px;
      background: var(--surface-card);
      border: 1px solid var(--border-card);
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 800;
      color: var(--ink);
      letter-spacing: 0.05em;
    }
    .meta-table {
      margin-top: 8px;
      display: inline-grid;
      grid-template-columns: auto auto;
      gap: 3px 14px;
      text-align: right;
      font-size: 10.5px;
      align-items: center;
    }
    .meta-term {
      color: var(--ink-muted);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.08em;
    }
    .meta-def {
      font-weight: 800;
      color: var(--ink);
    }
    .status-settled-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #EAF5EA;
      color: #1E6B24;
      border: 1px solid #C4E3C6;
      font-size: 9px;
      font-weight: 800;
      padding: 1px 6px;
      border-radius: 3px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    /* 2. DUAL UNIFORM CARDS */
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .client-card {
      background: var(--surface-card);
      border: 1px solid var(--border-card);
      border-radius: 6px;
      padding: 15px 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-title-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }
    .card-heading {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--gold);
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .card-status-note {
      font-size: 8px;
      font-weight: 700;
      color: var(--gold-dark);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .card-main-name {
      font-size: 13.5px;
      font-weight: 800;
      color: var(--ink);
      margin-bottom: 3px;
    }
    .card-detail-line {
      font-size: 10.5px;
      color: var(--ink-sec);
      line-height: 1.55;
      font-weight: 500;
    }
    .card-detail-line strong {
      color: var(--ink);
      font-weight: 700;
    }

    /* 3. ITEM TABLE (HARMONIOUS & CRISP) */
    .items-container {
      width: 100%;
      border: 1px solid var(--border-dark);
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 20px;
      background: #FFFFFF;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
    }
    .items-table thead th {
      background: var(--ink);
      color: #FAF8F5;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      padding: 10px 14px;
      text-align: left;
    }
    .items-table thead th.text-center { text-align: center; }
    .items-table thead th.text-right { text-align: right; }

    .items-table tbody td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-subtle);
      font-size: 10.5px;
      vertical-align: middle;
      background: #FAF8F5;
    }
    .items-table tbody tr:last-child td {
      border-bottom: none;
    }
    .item-entity {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .item-thumbnail {
      width: 46px;
      height: 46px;
      border-radius: 4px;
      object-fit: cover;
      border: 1px solid var(--border-card);
      background: #FFFFFF;
      flex-shrink: 0;
    }
    .fallback-thumb {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-card);
    }
    .item-title {
      font-size: 12.5px;
      font-weight: 800;
      color: var(--ink);
    }
    .item-sku {
      font-size: 9.5px;
      font-weight: 700;
      color: var(--gold-dark);
      letter-spacing: 0.08em;
      margin-top: 1px;
    }
    .item-spec {
      font-size: 10px;
      color: var(--ink-sec);
      line-height: 1.45;
      font-weight: 500;
      max-width: 240px;
    }
    .item-qty {
      text-align: center;
      font-size: 11.5px;
      font-weight: 800;
      color: var(--ink);
    }
    .item-price {
      text-align: right;
      font-size: 11.5px;
      font-weight: 600;
      color: var(--ink-sec);
      font-variant-numeric: tabular-nums;
    }
    .item-total {
      text-align: right;
      font-size: 12.5px;
      font-weight: 800;
      color: var(--ink);
      font-variant-numeric: tabular-nums;
    }

    /* 4. BOTTOM SECTION: CONCIERGE & TOTALS */
    .summary-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .concierge-box {
      background: var(--surface-card);
      border: 1px solid var(--border-card);
      border-radius: 6px;
      padding: 15px 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .handwritten-thanks {
      font-size: 34px;
      color: var(--gold);
      line-height: 1;
      margin-bottom: 6px;
    }
    .concierge-heading {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink);
      margin-bottom: 3px;
    }
    .concierge-desc {
      font-size: 10px;
      color: var(--ink-sec);
      line-height: 1.55;
      font-weight: 500;
    }
    .concierge-desc strong {
      color: var(--ink);
      font-weight: 700;
    }

    .totals-box {
      background: var(--surface-card);
      border: 1px solid var(--border-card);
      border-radius: 6px;
      padding: 15px 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .financial-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3.5px 0;
      font-size: 11px;
      color: var(--ink-sec);
      font-weight: 600;
    }
    .financial-line .figure {
      font-weight: 700;
      color: var(--ink);
      font-variant-numeric: tabular-nums;
    }
    .grand-total-row {
      margin-top: 8px;
      padding-top: 10px;
      border-top: 1.5px solid var(--ink);
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .grand-total-tag {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--ink);
    }
    .grand-total-num {
      font-size: 17px;
      font-weight: 900;
      color: var(--ink);
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.01em;
    }

    /* 5. LEGAL FOOTER */
    .legal-footer {
      border-top: 1px solid var(--border-card);
      padding-top: 14px;
      text-align: center;
      font-size: 9px;
      color: var(--ink-muted);
      line-height: 1.6;
    }
    .legal-company-name {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--ink);
      margin-bottom: 2px;
    }
    .legal-addresses {
      font-weight: 600;
      color: var(--ink-sec);
    }
    .legal-registration {
      margin-top: 3px;
      font-size: 8px;
      color: #8C7B70;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
  </style>
</head>
<body>

  <!-- 1. HEADER SECTION -->
  <header class="header-block">
    <div class="brand-section">
      <img src="data:image/png;base64,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" alt="Maison VAKÁA" class="brand-logo" />
      <div class="brand-tagline">MORE THAN A BAG, A CULTURE</div>
      <div class="brand-heritage">Haute Maroquinerie d'Art Panafricaine</div>
    </div>

    <div class="doc-meta-section">
      {{#if isCreditInvoice}}
        <h1 class="doc-title font-serif" style="color: #991B1B;">AVOIR</h1>
        <div class="doc-number-badge" style="color: #991B1B; border-color: #F87171;">N° AV-{{ invoiceNumber }}</div>
      {{else}}
        <h1 class="doc-title font-serif">FACTURE</h1>
        <div class="doc-number-badge">N° {{ invoicePrefix }}{{ invoiceNumber }}</div>
      {{/if}}
      <div class="meta-table">
        <span class="meta-term">Date d'émission</span>
        <span class="meta-def">{{ orderDate }}</span>
        <span class="meta-term">Réf. Commande</span>
        <span class="meta-def font-mono">#{{ order.code }}</span>
        {{#if originalInvoiceNumber}}
          <span class="meta-term">Facture d'origine</span>
          <span class="meta-def font-mono">VAK-{{ originalInvoiceNumber }}</span>
        {{/if}}
        <span class="meta-term">Règlement</span>
        <span class="meta-def"><span class="status-settled-pill">● Acquittée</span></span>
      </div>
    </div>
  </header>

  <!-- 2. DUAL UNIFORM CARDS -->
  <section class="cards-grid">
    <div class="client-card">
      <div class="card-title-bar">
        <span class="card-heading">👤 FACTURÉ À</span>
        <span class="card-status-note">Client Vérifié</span>
      </div>
      <div>
        {{#if order.customer}}
          <div class="card-main-name">{{ order.customer.firstName }} {{ order.customer.lastName }}</div>
          <div class="card-detail-line"><strong>Courriel :</strong> {{ order.customer.emailAddress }}</div>
        {{/if}}
        {{#if order.shippingAddress}}
          {{#unless order.customer}}
            <div class="card-main-name">{{ order.shippingAddress.fullName }}</div>
          {{/unless}}
          <div class="card-detail-line">
            {{ order.shippingAddress.streetLine1 }}{{#if order.shippingAddress.streetLine2}}, {{ order.shippingAddress.streetLine2 }}{{/if}}<br />
            {{ order.shippingAddress.city }}{{#if order.shippingAddress.postalCode}}, {{ order.shippingAddress.postalCode }}{{/if}} &bull; {{ order.shippingAddress.country }}<br />
            {{#if order.shippingAddress.phoneNumber}}
              <strong>Téléphone :</strong> {{ order.shippingAddress.phoneNumber }}
            {{/if}}
          </div>
        {{/if}}
      </div>
    </div>

    <div class="client-card">
      <div class="card-title-bar">
        <span class="card-heading">📦 LIVRAISON & RÈGLEMENT</span>
        <span class="card-status-note" style="color: #1E6B24;">Paiement Sécurisé</span>
      </div>
      <div>
        <div class="card-main-name">{{ shippingMethodName }}</div>
        <div class="card-detail-line">
          <strong>Mode de règlement :</strong> {{ paymentMethodName }}<br />
          <strong>Devise de transaction :</strong> {{ order.currencyCode }}<br />
          <strong>Atelier expéditeur :</strong> Atelier Principal &bull; Douala Bonanjo<br />
          <strong>Remise :</strong> En main propre sous coffret d'art VAKÁA
        </div>
      </div>
    </div>
  </section>

  <!-- 3. ITEM TABLE (HARMONIOUS & CRISP) -->
  <section class="items-container">
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 44%;">ARTICLE & CONFECTION</th>
          <th style="width: 26%;">MATIÈRES & FINITION</th>
          <th style="width: 10%; text-align: center;">QTÉ</th>
          <th style="width: 10%; text-align: right;">PRIX UNIT.</th>
          <th style="width: 10%; text-align: right;">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        {{#each formattedLines}}
        <tr>
          <td>
            <div class="item-entity">
              {{#if thumbnail}}
                <img src="{{ thumbnail }}" alt="{{ name }}" class="item-thumbnail" />
              {{else}}
                <div class="item-thumbnail fallback-thumb">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9B6327" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                </div>
              {{/if}}
              <div>
                <div class="item-title">{{ name }}</div>
                <div class="item-sku font-mono">{{ sku }}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="item-spec">
              {{#if variantName}}
                Finition Atelier : {{ variantName }} &bull;
              {{/if}}
              Raphia naturel & cuirs nobles tannage végétal.
            </div>
          </td>
          <td class="item-qty">{{ quantity }}</td>
          <td class="item-price">{{ unitPrice }}</td>
          <td class="item-total">{{ linePrice }}</td>
        </tr>
        {{/each}}
      </tbody>
    </table>
  </section>

  <!-- 4. BOTTOM SECTION: CONCIERGE & TOTALS -->
  <section class="summary-grid">
    <div class="concierge-box">
      <div class="handwritten-thanks font-hand">Merci beaucoup !</div>
      <div class="concierge-heading">Conciergerie Privée Maison VAKÁA</div>
      <div class="concierge-desc">
        Chaque création Maison VAKÁA est façonnée avec passion par nos maîtres artisans.<br />
        Pour tout conseil d'entretien ou service après-vente :<br />
        Courriel : <strong>contact@vakaa.online</strong> &bull; Ligne Directe : <strong>+237 6 70 00 00 00</strong>
      </div>
    </div>

    <div class="totals-box">
      <div class="financial-line">
        <span>Sous-total articles :</span>
        <span class="figure">{{ formattedSubTotal }}</span>
      </div>
      <div class="financial-line">
        <span>Livraison sécurisée d'atelier :</span>
        <span class="figure">{{ formattedShipping }}</span>
      </div>
      {{#if formattedDiscount}}
      <div class="financial-line" style="color: #7D4C18;">
        <span>Privilège Maison déduit :</span>
        <span class="figure" style="color: #7D4C18;">-{{ formattedDiscount }}</span>
      </div>
      {{/if}}
      <div class="grand-total-row">
        <span class="grand-total-tag">TOTAL TTC RÉGLÉ</span>
        <span class="grand-total-num">{{ formattedTotal }}</span>
      </div>
    </div>
  </section>

  <!-- 5. LEGAL FOOTER -->
  <footer class="legal-footer">
    <div class="legal-company-name">MAISON VAKÁA S.A.R.L. &bull; HAUTE MAROQUINERIE D'ART AFRICAINE</div>
    <div class="legal-addresses">
      Atelier Principal : Rue des Palmiers, Bonanjo, Douala, Cameroun &bull; Bureau International : 24 Rue de la Paix, 75002 Paris
    </div>
    <div class="legal-registration">
      Capital Social : 10.000.000 XAF &bull; RCCM : RC/DLA/2024/B/1842 &bull; NUI : M05241892401 &bull; Document officiel tenant lieu de reçu fiscal d'acquisition
    </div>
  </footer>

</body>
</html>
`;
