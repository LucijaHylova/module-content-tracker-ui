import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { RegisterUserRequest } from '../models/register-user-request.model';
import { AuthService } from '../../../user-profile/services/auth.service';
import { NotificationDialogComponent } from '../../../../shared/ui/notification-dialog/notification-dialog.component';
import { SelectorComponent } from '../../../../shared/ui/selector/selector.component';
import { DashboardStore } from '../../../dashboard/stores/dashboard.store';
import { AppStore } from '../../../../core/stores/app.store';


@Component({
  selector: 'app-register-dialog',
  imports: [
    MatFormField,
    MatDialogContent,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIconModule,
    MatIconButton,
    MatButton,
    MatSuffix,
    TranslatePipe,
    SelectorComponent
  ],
  templateUrl: './register-dialog.component.html',
  styleUrl: './register-dialog.component.scss'
})
export class RegisterDialogComponent {


  readonly authService = inject(AuthService);
  readonly dialog = inject(MatDialog);
  readonly #appStore = inject(AppStore);

  email = new FormControl('', [Validators.required, Validators.email]);
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  program = new FormControl('');
  specialization = new FormControl('');

  programs = this.#appStore.programs;
  programSpecializations = this.#appStore.programSpecializations;

  hide = signal(true);
  selectedProgram = signal<string>('');

  programDisabled = false;
  specializationDisabled = computed(() => !this.selectedProgram());



  onClick(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onProgramChange(program: string) {
    this.selectedProgram.set(program);
    this.program.setValue(program);
  }

  onSpecializationChange(specialization: string) {
    this.specialization.setValue(specialization);

  }

  register() {
    this.dialog.closeAll();
    const userRequest: RegisterUserRequest = {
      email: this.email.value ?? '',
      program: this.program.value ?? '',
      username: this.username.value ?? '',
      password: this.password.value ?? '',
      specialization: this.specialization.value ?? ''
    };

    this.authService.registerUser(userRequest).subscribe({

      next: () => {
        this.dialog.open(NotificationDialogComponent, {
          width: '550px',
          data: { notification: 'REGISTER_DIALOG.SUCCESS', buttonText: 'NOTIFICATION_DIALOG.LOGIN_BUTTON', registerSuccess: true }
        });
      },
      error: (err) => {
        const errorNotification = err.status === 409 ? 'REGISTER_DIALOG.USER_ERROR_CONFLICT' : 'REGISTER_DIALOG.ERROR';
        this.dialog.open(NotificationDialogComponent, {
          width: '550px',
          data: { notification: errorNotification, buttonText: 'NOTIFICATION_DIALOG.CONFIRM_BUTTON'}
        });
      }
    });
  }


  protected readonly Array = Array;
}
