import { Component, effect, inject } from '@angular/core';
import {  MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AppStore } from '../../../../core/stores/app.store';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
import { CommonService } from '../../../../shared/services/common.service';

@Component({
  selector: 'app-menu',
  imports: [
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatIconButton,
    MatMenuItem,
    TranslatePipe
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  readonly router = inject(Router);
  readonly #appStore = inject(AppStore);
  readonly commonService = inject(CommonService);


  readonly isLoggedIn = this.#appStore.isLoggedIn;
  readonly isOnHomePage = this.#appStore.isOnHomePage;

  readonly dialog = inject(MatDialog);

  constructor() {
    effect(() => {
      this.isLoggedIn();
    });
  }
  routeToStudyProgress() {
    this.#appStore.setFlagged(true);
    this.router.navigate(['/study-progress']);
  }

  routeToHome() {

    this.router.navigate(['/dashboard']);
  }

  login() {

    this.dialog.open(LoginDialogComponent, { width: '450px', maxWidth: 'none' });
  }

  logout() {
    this.commonService.logout();
  }

  register() {
    this.dialog.open(RegisterDialogComponent, { width: '450px', maxWidth: 'none' });
  }

  showUserProfile() {
    this.router.navigate(['/user-profile/me']);
  }

  navigateToModuleComparison() {
    this.router.navigate(['/module-comparison']);
  }

}
