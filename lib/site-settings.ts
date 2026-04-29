import 'server-only';
import { prisma } from './prisma';

export const SETTING_KEYS = {
  HERO_VIDEO_URL: 'hero_video_url',
  /** Optional still shown until hero video plays (direct URL or R2). */
  HERO_VIDEO_POSTER_URL: 'hero_video_poster_url',
  BIO_INTRO: 'bio_intro',
  BIO_MORE: 'bio_more', // JSON array of paragraphs
  CONTACT_INTRO: 'contact_intro',
  CONTACT_EMAIL: 'contact_email',
  CONTACT_PHONE: 'contact_phone',
  STUDIO_NAME: 'studio_name',
  STUDIO_ADDRESS: 'studio_address',
  STUDIO_CITY: 'studio_city',
  STUDIO_POSTCODE: 'studio_postcode',
  SOCIAL_LINKEDIN: 'social_linkedin',
  SOCIAL_INSTAGRAM: 'social_instagram',
  SOCIAL_YOUTUBE: 'social_youtube',
  SOCIAL_FACEBOOK: 'social_facebook',
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

export const SETTING_DEFAULTS: Record<SettingKey, string> = {
  hero_video_url: '/videos/drone-hero.mov',
  hero_video_poster_url: '',
  bio_intro:
    'Nelson Ferreira is a master painter and draughtsman trained in the rigorous 15th-century and 19th-century Academic traditions. He specialises in silverpoint, oil glazing, and the sight-size method, and is widely regarded as one of the foremost practitioners of these historic techniques today.',
  bio_more: JSON.stringify([
    'He has been invited twice as visiting lecturer at the National Portrait Gallery (London) to teach Renaissance silverpoint drawing during The Encounter: Drawings by Holbein, Leonardo and Dürer exhibition. He has also taught at the Saatchi Gallery, the Victoria & Albert Museum, and regularly instructs senior artists at Walt Disney Animation Studios.',
    'Between 2023 and 2025 Ferreira held critically acclaimed solo exhibitions in Portugal, Italy, the United Kingdom, Saudi Arabia, Nepal, Bangladesh, and Indonesia, collectively attracting more than 300,000 visitors.',
    'In summer 2025 he made history as the first artist ever granted official permission to exhibit inside the 1,200-year-old Borobudur Temple.',
  ]),
  contact_intro:
    'For any inquiries about art courses, commission requests or studio visits, please drop me a message today and join my mailing list - about 5 emails yearly. Please allow me a few days to return to you.',
  contact_email: 'nelson.ferreira.uk@gmail.com',
  contact_phone: '+447950930301',
  studio_name: 'Spitalfields Studio',
  studio_address: '7-15 Greatorex Street',
  studio_city: 'London',
  studio_postcode: 'E15NF',
  social_linkedin: 'https://www.linkedin.com/in/nelson-ferreira-visual-artist/',
  social_instagram: 'https://www.instagram.com/nelson.ferreira.visual.artist/?hl=pt',
  social_youtube: 'https://www.youtube.com/@nelsonferreirauk',
  social_facebook: 'https://www.facebook.com/nelson.ferreira.art.classes.drawing.painting/',
};

export async function getSetting(key: SettingKey): Promise<string> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    return row?.value ?? SETTING_DEFAULTS[key];
  } catch {
    return SETTING_DEFAULTS[key];
  }
}

export async function getAllSettings(): Promise<Record<SettingKey, string>> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Partial<Record<SettingKey, string>>;
    const result = {} as Record<SettingKey, string>;
    for (const key of Object.values(SETTING_KEYS)) {
      result[key] = map[key] ?? SETTING_DEFAULTS[key];
    }
    return result;
  } catch {
    return { ...SETTING_DEFAULTS };
  }
}

export async function setSetting(key: SettingKey, value: string): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

export async function setSettings(entries: Partial<Record<SettingKey, string>>): Promise<void> {
  await Promise.all(
    Object.entries(entries).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        create: { key, value: value! },
        update: { value: value! },
      })
    )
  );
}
