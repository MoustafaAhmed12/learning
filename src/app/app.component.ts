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
import { AsyncPipe, CommonModule } from '@angular/common';
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
interface Product {
  barcode: string;
  name: string;
  shortName: string;
  description: string;
  unit: string;
  standardType: string;
  cashPrice: number;
  costPrice: number;
  category: string;
  subCategories: string[];
  image?: string; // الصورة اختيارية
  expanded?: boolean; // للتحكم في إظهار التفاصيل
}
// import { CookieService } from 'ngx-t';
@Component({
  selector: 'app-root',
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  fb = inject(FormBuilder);
  filterForm: FormGroup;
  barcodes: string[] = [];

  products: Product[] = [
    {
      barcode: '123456',
      name: 'منتج 1',
      shortName: 'م1',
      description: 'وصف المنتج الأول',
      unit: 'كجم',
      standardType: 'وزن',
      cashPrice: 50,
      costPrice: 40,
      category: 'إلكترونيات',
      subCategories: ['هواتف', 'إكسسوارات'],
      image:
        'data:image/jpeg;base64,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', // صورة المنتج
    },
    {
      barcode: '789012',
      name: 'منتج 2',
      shortName: 'م2',
      description: 'وصف المنتج الثاني',
      unit: 'قطعة',
      standardType: 'عدد',
      cashPrice: 120,
      costPrice: 100,
      category: 'ملابس',
      subCategories: ['أحذية', 'قمصان'],
      // مفيش صورة هنا
    },
  ];

  searchQuery = '';
  selectedCategory = '';
  selectedPriceRange = '';
  filteredProducts = [...this.products];

  categories = [...new Set(this.products.map((p) => p.category))];

  filterProducts() {
    this.filteredProducts = this.products.filter((product) => {
      // ✅ البحث عن الاسم أو الباركود
      const matchesSearch =
        product.name.includes(this.searchQuery) ||
        product.barcode.includes(this.searchQuery);

      // ✅ فلتر التصنيف
      const matchesCategory = this.selectedCategory
        ? product.category === this.selectedCategory
        : true;

      // ✅ فلتر السعر
      let matchesPrice = true;
      if (this.selectedPriceRange === 'low') {
        matchesPrice = product.cashPrice < 100;
      } else if (this.selectedPriceRange === 'medium') {
        matchesPrice = product.cashPrice >= 100 && product.cashPrice <= 500;
      } else if (this.selectedPriceRange === 'high') {
        matchesPrice = product.cashPrice > 500;
      }

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }

  toggleDetails(product: any) {
    product.expanded = !product.expanded;
  }

  editProduct(product: any) {
    alert('تعديل المنتج: ' + product.name);
  }

  deleteProduct(product: any) {
    this.products = this.products.filter((p) => p !== product);
  }

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
