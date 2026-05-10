import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, SlicePipe, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { LangToggleComponent } from './components/lang-toggle/lang-toggle.component';
import { AlertComponent } from './components/alert/alert.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
  declarations: [
    NavbarComponent,
    ThemeToggleComponent,
    LangToggleComponent,
    AlertComponent,
    LoadingSpinnerComponent,
    TranslatePipe,
  ],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    ThemeToggleComponent,
    LangToggleComponent,
    AlertComponent,
    LoadingSpinnerComponent,
    TranslatePipe,
  ],
  providers: [DatePipe, DecimalPipe, SlicePipe, TitleCasePipe],
})
export class SharedModule {}
