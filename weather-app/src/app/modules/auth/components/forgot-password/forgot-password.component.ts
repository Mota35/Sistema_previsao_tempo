import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;
  success = '';
  error   = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.recuperarSenha(this.form.value.email).subscribe({
      next:  (r) => { this.success = r.message; this.loading = false; },
      error: (e) => { this.error = e.error?.message ?? 'Erro.'; this.loading = false; },
    });
  }
}
