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
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import JsBarcode from 'jsbarcode';

// import { CookieService } from 'ngx-t';
@Component({
  selector: 'app-root',
  imports: [TranslateModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  fb = inject(FormBuilder);
  filterForm: FormGroup;
  barcodes: string[] = [];

  @ViewChild('barcodeContainer') barcodeContainer!: ElementRef;
  applyFilters() {
    // توليد 10 باركودات عشوائية
    this.barcodes = Array.from({ length: 10 }, () =>
      Math.floor(1000000000 + Math.random() * 9000000000).toString()
    );

    setTimeout(() => this.generateBarcodes(), 100); // انتظار عرض العناصر
  }

  generateBarcodes() {
    this.barcodes.forEach((code, index) => {
      const canvas = document.getElementById(
        `barcode-${index}`
      ) as HTMLCanvasElement;
      if (canvas) {
        JsBarcode(canvas, code, { format: 'CODE128', displayValue: true });
      }
    });
  }

  printBarcodes() {
    window.print();
  }

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
    this.filterForm = this.fb.group({
      productName: [''],
      category: [''],
    });
  }

  toggleTheme() {
    this.changeModeService.toggleTheme();
    this.isDarkMode = !this.isDarkMode;
  }
}
