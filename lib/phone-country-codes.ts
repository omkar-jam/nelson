import raw from '@/data/country-phone-codes.json';

type RawRow = { name: string; dial_code: string; code: string };

/** Corrections for known errors in the upstream dataset (ITU E.164). */
const DIAL_VALUE_OVERRIDES: Record<string, string> = {
  GY: '592', // Guyana (source incorrectly used Paraguay’s +595)
  KZ: '7', // Kazakhstan shares +7 with Russia
  KY: '1345', // Cayman Islands (source had “+ 345”)
};

const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  AS: 'American Samoa',
};

function digitsOnly(dial: string): string {
  return dial.replace(/\D/g, '');
}

function dialValue(row: RawRow): string {
  const o = DIAL_VALUE_OVERRIDES[row.code];
  if (o) return `+${o}`;
  const d = digitsOnly(row.dial_code);
  return d ? `+${d}` : '+';
}

export type PhoneCountryOption = {
  value: string;
  label: string;
  iso: string;
};

function displayName(row: RawRow): string {
  return DISPLAY_NAME_OVERRIDES[row.code] ?? row.name;
}

export const PHONE_COUNTRY_CODES: PhoneCountryOption[] = (raw as RawRow[])
  .map((row) => {
    const value = dialValue(row);
    const name = displayName(row);
    return {
      value,
      label: `${name} (${value})`,
      iso: row.code,
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }));

/** Default mailing-list country (United Kingdom). */
export const DEFAULT_PHONE_COUNTRY_ISO = 'GB';

export function dialCodeForIso(iso: string): string {
  const hit = PHONE_COUNTRY_CODES.find((c) => c.iso === iso);
  return hit?.value ?? '+44';
}
