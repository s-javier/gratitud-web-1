export const languages = [
  { code: 'es', title: 'Español' },
  { code: 'en', title: 'English (inglés)' },
  { code: 'fr', title: 'Français (francés)' },
  { code: 'pt', title: 'Português (portugués)' },
  { code: 'de', title: 'Deutsch (alemán)' },
  { code: 'it', title: 'Italienisch (italiano)' },
  // { code: 'nl', title: 'Holandes' },
  // { code: 'pl', title: 'Polaco' },
  // { code: 'ru', title: 'Ruso' },
  // { code: 'ar', title: 'Arabe' },
  // { code: 'zh', title: 'Chino' },
  // { code: 'ja', title: 'Japones' },
]

export const convertLanguageCodeToTitle = (code: string): string | undefined => {
  const codes: { [key: string]: string } = {
    es: 'Español',
    en: 'English (inglés)',
    fr: 'Français (francés)',
    pt: 'Português (portugués)',
    de: 'Deutsch (alemán)',
    it: 'Italienisch (italiano)',
    // nl: 'Holandes',
    // pl: 'Polaco',
    // ru: 'Ruso',
    // ar: 'Arabe',
    // zh: 'Chino',
    // ja: 'Japones',
  }
  return codes[code]
}
