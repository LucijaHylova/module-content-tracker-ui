import { Component, inject } from '@angular/core';
import { MatButton} from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from './components/register-dialog/register-dialog.component';
import { AppStore } from '../../core/stores/app.store';
import { Router } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { MatIcon } from '@angular/material/icon';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-header',
  imports: [
    MatButton,
    TranslatePipe,
    MenuComponent,
    MatIcon
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  readonly dialog = inject(MatDialog);
  readonly #appStore = inject(AppStore);
  readonly commonService = inject(CommonService);

  readonly router = inject(Router);

  readonly isLoggedIn = this.#appStore.isLoggedIn;


  login() {


    this.dialog.open(LoginDialogComponent, { width: '450px', maxWidth: 'none' });
  }

  register() {
    this.dialog.open(RegisterDialogComponent, { width: '450px', maxWidth: 'none' });
  }

  logout() {
    this.commonService.logout();
  }

}
