import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SsoDialogComponent } from './sso-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;
  currentLang: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.currentLang = this.translate.currentLang || 'es';
  }

  ngOnInit(): void {
    if (this.authService.userValue) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.snackBar.open(this.translate.instant('LOGIN.SUCCESS'), 'OK', { duration: 3000 });
        this.router.navigate(['/home']);
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(this.translate.instant('LOGIN.ERROR'), 'Close', { duration: 5000 });
      }
    });
  }

  onSsoLogin(): void {
    const dialogRef = this.dialog.open(SsoDialogComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Mock a certificate processing delay
        this.loading = true;
        setTimeout(() => {
          // Standard approach for SSO: redirect browser to backend endpoint
          window.location.href = '/api/auth/sso';
        }, 1000);
      }
    });
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
  }
}
