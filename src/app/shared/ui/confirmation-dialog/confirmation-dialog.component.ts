import { Component, Inject, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef
} from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoginDialogComponent } from '../../../features/header/components/login-dialog/login-dialog.component';

@Component({
  selector: 'app-notification-dialog',
  imports: [
    MatButton,
    MatDialogContent,
    TranslatePipe
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);


  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(true);
  }
}
