import { Component, inject, OnInit, signal } from '@angular/core';
import { LangStore } from '../../../core/stores/lang.store';
import { UserStore } from '../../../core/stores/user.store';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AppStore } from '../../../core/stores/app.store';
import { SelectorComponent } from '../../../shared/ui/selector/selector.component';
import { FormControl } from '@angular/forms';
import { NotificationDialogComponent } from '../../../shared/ui/notification-dialog/notification-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserUpdateRequest } from '../models/user-update-request.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-profile',
  imports: [
    MatButton,
    TranslatePipe,
    SelectorComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit{

  readonly #langStore = inject(LangStore);
  readonly #userStore = inject(UserStore);
  readonly #appStore = inject(AppStore);

  readonly router = inject(Router);
  readonly dialog = inject(MatDialog);
  readonly userService = inject(UserService);

  programSpecializations = this.#appStore.programSpecializations;
  selectedNode = this.#appStore.selectedNode;

  readonly lang = this.#langStore.lang;
  readonly user = this.#userStore.user;
  selectedProgram = signal<string>('');



  back() {
    this.router.navigate(['/dashboard']);
  }

  ngOnInit(): void {
    this.#appStore.setIsProfileView(false);
    this.#appStore.setIsOnHomePage(false);
    this.#appStore.setIsONModuleComparisonPage(false);


  }

  specialization = new FormControl('');

  onSpecializationChange(specialization: string) {
    this.specialization.setValue(specialization);

  }

  change() {
    this.dialog.closeAll();

    const userUpdateRequest: UserUpdateRequest = {
      username: this.user().username,
      specialization: this.specialization.value ?? ''
    };

    this.userService.updateUser(userUpdateRequest).subscribe({

      next: () => {
        this.userService.getMe().subscribe({
          next: (user) => {
            this.#userStore.setUser(user);
          }
        });
        this.dialog.open(NotificationDialogComponent, {
          width: '550px',
          data: { notification: 'NOTIFICATION_DIALOG.SUCCESS', buttonText: 'NOTIFICATION_DIALOG.CONFIRM_BUTTON' }
        });
      },
      error: () => {
        this.dialog.open(NotificationDialogComponent, {
          width: '550px',
          data: { notification: 'NOTIFICATION_DIALOG.ERROR', buttonText: 'NOTIFICATION_DIALOG.CONFIRM_BUTTON'}
        });
      }
    });
  }

}
