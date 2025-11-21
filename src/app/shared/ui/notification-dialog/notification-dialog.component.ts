import { Component, Inject, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent
} from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoginDialogComponent } from '../../../features/header/components/login-dialog/login-dialog.component';
import { AppStore } from '../../../core/stores/app.store';

@Component({
  selector: 'app-notification-dialog',
  imports: [
    MatButton,
    MatDialogContent,
    TranslatePipe
  ],
  templateUrl: './notification-dialog.component.html',
  styleUrl: './notification-dialog.component.scss'
})
export class NotificationDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {notification: string, buttonText: string, registerSuccess: boolean } ) {
  }

  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);

  onClick() {
    this.dialog.closeAll();
    if (this.data.registerSuccess) {
      this.dialog.open(LoginDialogComponent, {
        width: '550px'
      });

    }
  }
}
