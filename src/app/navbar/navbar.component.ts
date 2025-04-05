import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
@Component({
  selector: 'app-navbar',
  imports: [FormsModule, QuillModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input({
    required: false,
    alias: 'name',
    transform: (v: string) => v.toUpperCase(),
  })
  subject: string = '';
  htmlText: string = '';

  onSelectionChanged = (event: any) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  };

  onContentChanged = (event: any) => {};

  onFocus = () => {
    console.log('On Focus');
  };
  onBlur = () => {
    console.log('Blurred');
  };

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['code-block'],
        [
          { header: 1 },
          { header: 2 },
          { header: 3 },
          { header: 4 },
          { header: 5 },
          { header: 6 },
        ],
        [{ color: [] }, { background: [] }],
        [{ list: 'check' }, { list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['clean'],
        ['link', 'image', 'video'],

        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],

        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ font: [] }],
      ],
    },
  };

  myName: string = '';
  @Output() age: EventEmitter<{ id: number; name: string; price: number }> =
    new EventEmitter();
  sentToParent(
    id: HTMLInputElement,
    name: HTMLInputElement,
    price: HTMLInputElement
  ) {
    const info = {
      id: +id.value,
      name: name.value,
      price: +price.value,
    };
    this.age.emit(info);
    id.focus();
    id.value = '';
    name.value = '';
    price.value = '';
    name.placeholder = 'Enter Your Name PLZ.';
  }
}
