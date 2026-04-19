import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: any;
  currentLang: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang || 'es';
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
  }

  ngOnInit(): void {
    this.user = this.authService.userValue;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
