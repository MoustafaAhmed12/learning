import { Component, computed, input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  myValue = input(0, { alias: 'value', transform: numberAttribute });
  label = computed(() => `The slider's value is ${this.myValue()}`);
}
