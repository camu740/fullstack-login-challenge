import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sso-callback',
  template: `
    <div class="callback-container">
      <div class="spinner-wrapper">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Procesando inicio de sesión SSO...</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      height: 100vh;
      width: 100%;
      align-items: center;
      justify-content: center;
    }
    .spinner-wrapper {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
  `]
})
export class SsoCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.authService.ssoCallback(code).subscribe({
        next: (user) => {
          this.snackBar.open('SSO Login Exitoso', 'OK', { duration: 3000 });
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.snackBar.open('Error en el login SSO: ' + err.message, 'Close', { duration: 5000 });
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.snackBar.open('No se proporcionó código SSO', 'Close', { duration: 5000 });
      this.router.navigate(['/login']);
    }
  }

}
