import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  currentLang: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
    this.currentLang = this.translate.currentLang || 'es';
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
  }

  ngOnInit(): void { }

  getPasswordStrength(): number {
    const password = this.registerForm.get('password')?.value || '';
    if (!password) return 0;

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    // Normalize to 0-100 for progress bar
    return (score / 5) * 100;
  }

  getStrengthColor(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 20) return 'warn'; // Red
    if (strength <= 60) return 'accent'; // Orange/Yellow
    return 'primary'; // Greenish/Standard
  }

  getStrengthLabel(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 20) return 'REGISTER.STRENGTH.WEAK';
    if (strength <= 40) return 'REGISTER.STRENGTH.FAIR';
    if (strength <= 60) return 'REGISTER.STRENGTH.GOOD';
    if (strength <= 80) return 'REGISTER.STRENGTH.STRONG';
    return 'REGISTER.STRENGTH.EXCELLENT';
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    const { email, password } = this.registerForm.value;

    this.authService.register({ email, password }).subscribe({
      next: data => {
        this.snackBar.open(this.translate.instant('REGISTER.SUCCESS'), 'OK', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: err => {
        this.loading = false;
        const msg = err.error?.message || this.translate.instant('REGISTER.ERROR');
        this.snackBar.open(msg, 'Close', { duration: 5000 });
      }
    });
  }
}
