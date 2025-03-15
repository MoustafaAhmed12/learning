import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
  ViewChild,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  decrement,
  increment,
  setCounterToAnyVal,
} from './store/Counter/counter.actions';
import { AsyncPipe } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import gsap from 'gsap';
import { ChangeModeService } from './service/change-mode.service';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MultiLangService } from './service/multi-lang.service';
import { FormsModule } from '@angular/forms';

// import { CookieService } from 'ngx-t';
@Component({
  selector: 'app-root',
  imports: [TranslateModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  changeModeService = inject(ChangeModeService);
  multiLangService = inject(MultiLangService);
  isDarkMode: boolean = false;
  translate: TranslateService = inject(TranslateService);
  selectedLang = signal<string>('ar');
  languages = [
    { code: 'en', label: 'English', flag: 'https://flagcdn.com/w40/us.png' },
    { code: 'ar', label: 'العربية', flag: 'https://flagcdn.com/w40/eg.png' },
    { code: 'hi', label: 'हिन्दी', flag: 'https://flagcdn.com/w40/in.png' },
  ];
  selectLang(lang: string) {
    this.multiLangService.updateLang(lang);
    console.log('Lang change to ', lang);
  }

  constructor() {
    console.log(document.documentElement.classList.contains('dark'));
    this.isDarkMode = document.documentElement.classList.contains('dark');
    this.selectedLang.set(this.multiLangService.currenLang());
    console.log(this.selectedLang());
  }

  toggleTheme() {
    this.changeModeService.toggleTheme();
    this.isDarkMode = !this.isDarkMode;
  }
}
