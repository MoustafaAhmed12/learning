import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input({
    required: false,
    alias: 'name',
    transform: (v: string) => v.toUpperCase(),
  })
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
