import { Component } from '@angular/core';

@Component({
  selector: 'jhi-quote-widget',
  standalone: true,
  templateUrl: './quote-widget.component.html',
})
export class QuoteWidgetComponent {
  quote = {
    text: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
    author: 'Winston Churchill',
  };
}
