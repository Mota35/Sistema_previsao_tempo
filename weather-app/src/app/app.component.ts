import { Component, OnInit } from '@angular/core';
import { ThemeService, I18nService } from './core/services/theme-i18n.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent implements OnInit {
  constructor(
    private theme: ThemeService,
    private i18n: I18nService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.theme.init();
    // Refresh user data if token present
    if (this.auth.isLoggedIn) {
      this.auth.me().subscribe({ error: () => {} });
    }
  }
}
