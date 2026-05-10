import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error   = '';
  showPwd = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      nome:    ['', [Validators.required, Validators.minLength(2)]],
      email:   ['', [Validators.required, Validators.email]],
      senha:   ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required],
    }, { validators: this.passwordMatch });
  }

  passwordMatch(g: AbstractControl) {
    return g.get('senha')?.value === g.get('confirm')?.value ? null : { mismatch: true };
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true; this.error = '';
    const { nome, email, senha } = this.form.value;
    this.auth.register(nome, email, senha).subscribe({
      next:  ()  => this.router.navigate(['/dashboard']),
      error: (e) => { this.error = e.error?.message ?? 'Erro ao registar.'; this.loading = false; },
    });
  }
}
