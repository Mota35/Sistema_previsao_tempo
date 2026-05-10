import { Component } from '@angular/core';
import { I18nService } from '../../../../core/services/theme-i18n.service';

@Component({
  selector: 'app-lang-toggle',
  templateUrl: './lang-toggle.component.html',
})
export class LangToggleComponent {
  constructor(public i18n: I18nService) {}
}
