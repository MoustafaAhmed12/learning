import { Component, inject, OnInit, signal } from '@angular/core';
import { PostsService } from '../service/posts.service';
import { Posts } from '../models/posts';
import { FormsModule } from '@angular/forms';
import { AboutUsComponent } from '../about-us/about-us.component';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { QuoteInvoiceService } from '../service/quote-invoice.service';

interface Product {
  name: string;
  price: number;
}

interface ProductRow {
  name: string;
  quantity: number;
  price: number;
  total: number;
  filtered: Product[];
}

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  s = inject(QuoteInvoiceService);
  productList: Product[] = [
    { name: 'منتج 1', price: 100 },
    { name: 'منتج 2', price: 150 },
    { name: 'منتج 3', price: 200 },
  ];

  products: ProductRow[] = [
    { name: '', quantity: 0, price: 0, total: 0, filtered: [] },
  ];

  // إضافة صف جديد
  addRow() {
    this.products.push({
      name: '',
      quantity: 0,
      price: 0,
      total: 0,
      filtered: [],
    });
  }

  // حذف صف
  deleteRow(index: number) {
    this.products.splice(index, 1);
  }

  // تحديث الاسم والفلترة
  onProductNameChange(value: string, row: ProductRow) {
    row.filtered = this.productList.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );
  }

  // اختيار المنتج من الاقتراحات
  selectProduct(product: Product, row: ProductRow) {
    row.name = product.name;
    row.price = product.price;
    row.filtered = [];
    this.calculateRowTotal(row);
  }

  // تغيير الكمية
  onQuantityChange(row: ProductRow) {
    this.calculateRowTotal(row);
  }

  // حساب إجمالي السطر
  calculateRowTotal(row: ProductRow) {
    row.total = row.quantity * row.price;
  }

  // إجمالي الفاتورة
  getTotal(): number {
    return this.products.reduce((acc, row) => acc + row.total, 0);
  }

  async printPDF() {
    const doc = new jsPDF();

    // Create the HTML content dynamically
    const container = document.createElement('div');
    container.style.width = '210mm'; // A4 width
    container.style.padding = '20mm';
    container.style.background = '#f9f9f9'; // Light background color
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.color = '#333';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 26px; margin: 0; color: #333;">فاتورة عرض السعر</h2>
        <p style="font-size: 24px; color: #666; margin: 5px 0;">Fiker - Order</p>
      </div>
      <div style="margin-bottom: 20px;">
        <p><strong style="color: #333;">الإجمالي الكلي:</strong> ${this.getTotal().toFixed(
          2
        )} جنيه</p>
      </div>
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 18px; color: #333;">المنتجات</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr>
              <th style="border-bottom: 2px solid #ddd; padding: 8px; text-align: left; color: #333;">#</th>
              <th style="border-bottom: 2px solid #ddd; padding: 8px; text-align: left; color: #333;">المنتج</th>
              <th style="border-bottom: 2px solid #ddd; padding: 8px; text-align: right; color: #333;">الكمية</th>
              <th style="border-bottom: 2px solid #ddd; padding: 8px; text-align: right; color: #333;">السعر</th>
              <th style="border-bottom: 2px solid #ddd; padding: 8px; text-align: right; color: #333;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${this.products
              .map(
                (p, i) => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #555;">${
                  i + 1
                }</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #555;">${
                  p.name
                }</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; color: #555;">${
                  p.quantity
                }</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; color: #555;">${
                  p.price
                }</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; color: #555;">${p.total.toFixed(
                  2
                )}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    // Append the container to the DOM temporarily
    document.body.appendChild(container);

    // Use html2canvas to convert the content to an image
    const canvas = await html2canvas(container, { scale: 2 });

    // Remove the temporary container
    document.body.removeChild(container);

    // Convert canvas to image data
    const imageData = canvas.toDataURL('image/png');

    // Add image to PDF
    const pageWidth = doc.internal.pageSize.width;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    doc.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Save the generated PDF
    doc.save('فاتورة-عرض-السعر.pdf');
  }

  openPDFInNewTab() {
    this.s.generateQuotePDF(this.products, 'ar');
  }
}
