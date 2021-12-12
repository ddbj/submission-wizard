import { LitElement } from 'lit';
import { configureLocalization } from '@lit/localize';
import { property } from 'lit/decorators.js';

import * as localeJa from './generated/locales/ja';
import { sourceLocale, targetLocales } from './generated/locales';

export type LocalizedString = {
  en: string,
  ja?: string
};

export function LocalizationMixin<T extends Constructor<LitElement>>(Base: T) {
  class Mixin extends Base {
    @property()
    get locale() {
      return getLocale() as Locale;
    }

    set locale(newVal: Locale) {
      const oldVal = getLocale();

      setLocale(newVal).then(() => {
        this.requestUpdate('locale', oldVal);
      });
    }

    localize(source: LocalizedString): string {
      return source[this.locale] || source.en;
    }
  }

  return Mixin;
}

type Constructor<T> = new (...args: any[]) => T; // eslint-disable-line @typescript-eslint/no-explicit-any
type Locale = 'en' | 'ja';

const {getLocale, setLocale} = configureLocalization({
  sourceLocale,
  targetLocales,

  async loadLocale(locale) {
    switch (locale) {
      case 'ja':
        return localeJa;
      default:
        throw new Error('must not happen');
    }
  }
});
