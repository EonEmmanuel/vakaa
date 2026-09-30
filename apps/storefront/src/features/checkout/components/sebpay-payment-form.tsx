'use client';

import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Info, ShieldCheck, KeyRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface OperatorOption {
  code: string;
  name: string;
  requiresOtp?: boolean;
  otpInstructions?: string;
}

export interface CorridorOption {
  code: string;
  name: string;
  dialCode: string;
  currency: string;
  operators: OperatorOption[];
}

export const SEBPAY_CORRIDORS: CorridorOption[] = [
  {
    code: 'BJ',
    name: 'Bénin',
    dialCode: '+229',
    currency: 'XOF',
    operators: [
      { code: 'mtn', name: 'MTN Mobile Money' },
      { code: 'moov', name: 'Moov Money' },
      { code: 'celtiis', name: 'Celtiis Cash' },
    ],
  },
  {
    code: 'CI',
    name: "Côte d'Ivoire",
    dialCode: '+225',
    currency: 'XOF',
    operators: [
      { code: 'mtn', name: 'MTN Mobile Money' },
      {
        code: 'orange',
        name: 'Orange Money',
        requiresOtp: true,
        otpInstructions: 'Composez #144*82# sur votre mobile Orange pour générer le code d’autorisation.',
      },
      { code: 'wave', name: 'Wave' },
      { code: 'moov', name: 'Moov Money' },
    ],
  },
  {
    code: 'SN',
    name: 'Sénégal',
    dialCode: '+221',
    currency: 'XOF',
    operators: [
      {
        code: 'orange',
        name: 'Orange Money',
        requiresOtp: true,
        otpInstructions: 'Composez #144#391# sur votre mobile Orange pour obtenir votre code d’autorisation.',
      },
      { code: 'wave', name: 'Wave' },
      { code: 'free', name: 'Free Money' },
    ],
  },
  {
    code: 'CM',
    name: 'Cameroun',
    dialCode: '+237',
    currency: 'XAF',
    operators: [
      { code: 'mtn', name: 'MTN Mobile Money' },
      { code: 'orange', name: 'Orange Money' },
    ],
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    dialCode: '+226',
    currency: 'XOF',
    operators: [
      {
        code: 'orange',
        name: 'Orange Money',
        requiresOtp: true,
        otpInstructions: 'Composez *144*4*6# sur votre mobile pour obtenir le code d’autorisation.',
      },
      { code: 'moov', name: 'Moov Money' },
    ],
  },
  {
    code: 'TG',
    name: 'Togo',
    dialCode: '+228',
    currency: 'XOF',
    operators: [
      { code: 'tmoney', name: 'T-Money (Togocom)' },
      { code: 'moov', name: 'Moov Money' },
    ],
  },
  {
    code: 'ML',
    name: 'Mali',
    dialCode: '+223',
    currency: 'XOF',
    operators: [
      { code: 'orange', name: 'Orange Money' },
      { code: 'moov', name: 'Moov Money' },
      { code: 'wave', name: 'Wave' },
    ],
  },
  {
    code: 'GA',
    name: 'Gabon',
    dialCode: '+241',
    currency: 'XAF',
    operators: [
      { code: 'airtel', name: 'Airtel Money' },
      { code: 'moov', name: 'Moov Money' },
    ],
  },
  {
    code: 'GN',
    name: 'Guinée (Conakry)',
    dialCode: '+224',
    currency: 'GNF',
    operators: [
      { code: 'orange', name: 'Orange Money' },
      { code: 'mtn', name: 'MTN Mobile Money' },
    ],
  },
  {
    code: 'CG',
    name: 'Congo-Brazzaville',
    dialCode: '+242',
    currency: 'XAF',
    operators: [
      { code: 'airtel', name: 'Airtel Money' },
      { code: 'mtn', name: 'MTN Mobile Money' },
    ],
  },
];

interface SebpayPaymentFormProps {
  initialCountryCode?: string;
  value: Record<string, unknown>;
  onChange: (metadata: Record<string, unknown>) => void;
}

export function SebpayPaymentForm({
  initialCountryCode,
  value,
  onChange,
}: SebpayPaymentFormProps) {
  // Determine starting country
  const resolvedInitialCountry =
    SEBPAY_CORRIDORS.find(
      (c) => c.code.toLowerCase() === initialCountryCode?.toLowerCase()
    )?.code || 'BJ';

  const [country, setCountry] = useState<string>(
    (value.country as string) || resolvedInitialCountry
  );

  const activeCorridor =
    SEBPAY_CORRIDORS.find((c) => c.code === country) || SEBPAY_CORRIDORS[0];

  const [operator, setOperator] = useState<string>(
    (value.operator as string) || activeCorridor.operators[0].code
  );
  const [phone, setPhone] = useState<string>((value.phone as string) || '');
  const [otp, setOtp] = useState<string>((value.otp as string) || '');

  // Active operator info
  const selectedOperatorObj = activeCorridor.operators.find(
    (op) => op.code === operator
  );
  const requiresOtp = !!selectedOperatorObj?.requiresOtp;

  // Sync to parent on change
  useEffect(() => {
    onChange({
      country,
      operator,
      phone,
      otp: requiresOtp ? otp : undefined,
      currency: activeCorridor.currency,
    });
  }, [country, operator, phone, otp, requiresOtp, activeCorridor.currency]);

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const newCorridor =
      SEBPAY_CORRIDORS.find((c) => c.code === newCountry) || SEBPAY_CORRIDORS[0];
    const defaultOp = newCorridor.operators[0]?.code || '';
    setOperator(defaultOp);
    setOtp('');
  };

  return (
    <div className="mt-4 pt-4 border-t space-y-4 bg-muted/20 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Smartphone className="h-4 w-4 text-primary" />
          <span>Informations Mobile Money</span>
        </div>
        <Badge variant="outline" className="text-xs font-mono">
          Devise: {activeCorridor.currency}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Country Selector */}
        <div className="space-y-1.5">
          <Label htmlFor="sebpay-country" className="text-xs">
            Pays
          </Label>
          <NativeSelect
            id="sebpay-country"
            value={country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full"
          >
            {SEBPAY_CORRIDORS.map((c) => (
              <NativeSelectOption key={c.code} value={c.code}>
                {c.name} ({c.dialCode}) - {c.currency}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        {/* Operator Selector */}
        <div className="space-y-1.5">
          <Label htmlFor="sebpay-operator" className="text-xs">
            Opérateur
          </Label>
          <NativeSelect
            id="sebpay-operator"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className="w-full"
          >
            {activeCorridor.operators.map((op) => (
              <NativeSelectOption key={op.code} value={op.code}>
                {op.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>

      {/* Phone Number Input */}
      <div className="space-y-1.5">
        <Label htmlFor="sebpay-phone" className="text-xs">
          Numéro Mobile Money (sans indicatif)
        </Label>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 h-9 rounded-md border bg-muted text-xs text-muted-foreground font-mono">
            {activeCorridor.dialCode}
          </span>
          <Input
            id="sebpay-phone"
            type="tel"
            placeholder="Ex: 97000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 font-mono text-sm"
            required
          />
        </div>
      </div>

      {/* OTP Input for operators requiring authorization code */}
      {requiresOtp && (
        <div className="space-y-2 pt-1 border-t border-dashed">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-amber-500" />
            <Label htmlFor="sebpay-otp" className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Code d’autorisation OTP requis
            </Label>
          </div>
          <Input
            id="sebpay-otp"
            type="text"
            placeholder="Code d’autorisation à 4 ou 6 chiffres"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="font-mono text-sm tracking-wider"
          />
          {selectedOperatorObj?.otpInstructions && (
            <p className="text-xs text-muted-foreground flex items-start gap-1.5">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
              <span>{selectedOperatorObj.otpInstructions}</span>
            </p>
          )}
        </div>
      )}

      {/* Helpful reassurance alert */}
      <Alert className="bg-primary/5 border-primary/20 py-2.5">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
          Une invite de paiement (USSD) sera envoyée sur votre téléphone pour confirmer la transaction en toute sécurité avec votre code secret Mobile Money.
        </AlertDescription>
      </Alert>
    </div>
  );
}
