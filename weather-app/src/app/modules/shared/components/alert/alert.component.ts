import { Component, Input, Output, EventEmitter } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  @Input() message  = '';
  @Input() type: AlertType = 'info';
  @Output() dismiss = new EventEmitter<void>();

  icons: Record<AlertType, string> = {
    success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️'
  };
}
