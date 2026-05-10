import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { I18nService } from '../../../../core/services/theme-i18n.service';
import { User } from '../../../../core/models/models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
  menuOpen = false;

  constructor(public auth: AuthService, public i18n: I18nService) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(u => this.user = u);
  }

  logout(): void { this.auth.logout(); }
  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
}
