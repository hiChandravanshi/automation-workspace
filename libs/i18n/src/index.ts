import en from './locales/en.json';
import fr from './locales/fr.json';

let locale = 'en';
const resources: Record<string, any> = { en, fr };

export function initI18n(l: 'en'|'fr') { locale = l; }
export function t(key: string) {
  const parts = key.split('.');
  let v: any = resources[locale];
  for (const p of parts) v = v?.[p];
  return v ?? key;
}
