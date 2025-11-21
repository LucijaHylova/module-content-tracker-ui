import {  Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../user-profile/services/auth.service';
import { NotificationDialogComponent } from '../../../../shared/ui/notification-dialog/notification-dialog.component';
import { LoginUserRequest } from '../models/login-user-request.model';
import { AppStore } from '../../../../core/stores/app.store';
import { UserStore } from '../../../../core/stores/user.store';
import { UserService } from '../../../user-profile/services/user.service';
import { DashboardStore } from '../../../dashboard/stores/dashboard.store';


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
    TranslatePipe
  ],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss'
})
export class LoginDialogComponent {


  readonly authService = inject(AuthService);
  readonly userService = inject(UserService);
  readonly dialog = inject(MatDialog);
  readonly #appStore = inject(AppStore);
  readonly #userStore = inject(UserStore);
  readonly #dashboardStore = inject(DashboardStore);


  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  hide = signal(true);

  onClick(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onLogin() {
    this.dialog.closeAll();
    const loginRequest: LoginUserRequest = {
      username: this.username.value ?? '',
      password: this.password.value ?? ''
    };


    this.authService.authUser(loginRequest).subscribe({

      next: () => {
      this.userService.getMe().subscribe({
          next: (user) => {
            this.#userStore.setUser(user);
          }
        });
        this.#appStore.setIsLoggedIn(true);
        this.#appStore.setIsRouting(true);
        this.#dashboardStore.setSelectedDepartment(undefined);
        this.#dashboardStore.setSelectedProgram(undefined);
        this.#dashboardStore.setSelectedModuleType(undefined);
        this.#dashboardStore.setSelectedModule(undefined);


      },
      error: (err) => {
        const errorNotification = err.status === 401 ? 'LOGIN_DIALOG.USER_NOT_FOUND' : 'LOGIN_DIALOG.ERROR';
        this.dialog.open(NotificationDialogComponent, {
          width: '550px',
          data: { notification: errorNotification, buttonText: 'NOTIFICATION_DIALOG.CONFIRM_BUTTON'}
        });
      }
    });
  }
}
