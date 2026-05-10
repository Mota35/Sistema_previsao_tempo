import { Component } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme-i18n.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
})
export class ThemeToggleComponent {
  constructor(public theme: ThemeService) {}
}
