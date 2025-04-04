import { effect, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MultiLangService {
  private readonly LNAG: string = 'LANG';
  currenLang = signal<string>('');
  translate = inject(TranslateService);

  updateLang(lang: string): void {
    this.currenLang.update(() => {
      switch (lang) {
        case 'ar':
          return 'ar';
        case 'en':
          return 'en';
        case 'hi':
          return 'hi';
        default:
          return 'ar';
      }
    });
    this.setDirection(this.currenLang());
  }

  constructor() {
    effect(() => {
      if (!this.currenLang()) {
        this.currenLang.set(localStorage.getItem(this.LNAG) ?? 'ar');
      } else {
        localStorage.setItem(this.LNAG, this.currenLang());
        this.translate.use(this.currenLang());
      }
      this.setDirection(this.currenLang());
    });
  }
  private setDirection(lang: string) {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }
}
