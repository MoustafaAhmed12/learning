import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root',
})
export class QuoteInvoiceService {
  async generateQuotePDF(
    products: { name: string; quantity: number }[],
    lang: 'ar' | 'en' | 'hi'
  ) {
    const doc = new jsPDF();

    // تحديد اتجاه النص بناءً على اللغة
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    const textAlign = lang === 'ar' ? 'right' : 'left';

    // Create the HTML content dynamically
    const container = document.createElement('div');
    container.style.width = '210mm'; // A4 width
    container.style.padding = '20mm';
    container.style.background = '#f9f9f9';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.color = '#333';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    container.style.direction = dir;
    container.style.textAlign = textAlign;
    container.style.position = 'absolute';
    container.style.left = '-9999px';

    // تحديد عنوان الفاتورة بناءً على اللغة
    const invoiceTitle =
      lang === 'ar'
        ? 'فاتورة عرض السعر'
        : lang === 'hi'
        ? 'कोटेशन इनवॉइस'
        : 'Quotation Invoice';
    const orderText =
      lang === 'ar'
        ? 'طلب Fiker'
        : lang === 'hi'
        ? 'Fiker ऑर्डर'
        : 'Fiker Order';
    const productText =
      lang === 'ar' ? 'المنتجات' : lang === 'hi' ? 'उत्पाद' : 'Products';
    const productName =
      lang === 'ar' ? 'المنتج' : lang === 'hi' ? 'उत्पाद का नाम' : 'Product';
    const quantityText =
      lang === 'ar' ? 'الكمية' : lang === 'hi' ? 'मात्रा' : 'Quantity';

    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 26px; margin: 0; color: #333;">${invoiceTitle}</h2>
        <p style="font-size: 24px; color: #666; margin: 5px 0;">${orderText}</p>
      </div>
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 18px; color: #333;">${productText}</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: center; margin-top: 10px;">
          <thead>
            <tr>
              <th style="border-bottom: 2px solid #ddd;padding: 16px 8px; text-align: center; color: #333;">#</th>
              <th style="border-bottom: 2px solid #ddd;padding: 16px 8px; text-align: center; color: #333;">${productName}</th>
              <th style="border-bottom: 2px solid #ddd;padding: 16px 8px; text-align: center; color: #333;">${quantityText}</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (p, i) => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center; color: #555;">${
                  i + 1
                }</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center; color: #555;">${
                  p.name
                }</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center; color: #555;">${
                  p.quantity
                }</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    // Append the container to the DOM temporarily
    container.style.position = 'absolute';
    container.style.left = '-9999px';
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

    // Open PDF in new tab
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url);
  }
}
