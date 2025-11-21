import { Component, effect, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent } from '@angular/material/dialog';
import { ModuleResponse } from '../../../../shared/models/module-response.model';
import { MatButton } from '@angular/material/button';
import { SelectorComponent } from '../../../../shared/ui/selector/selector.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LangStore } from '../../../../core/stores/lang.store';
import { AppStore } from '../../../../core/stores/app.store';
import { FormControl } from '@angular/forms';
import { UserModuleId } from '../../../dashboard/models/user-module-id.model';
import { UserModuleUpdateRequest } from '../../../dashboard/models/user-module-update-request.model';
import { MODULE_STATUS } from '../../../../shared/models/node.enum';
import { NotificationDialogComponent } from '../../../../shared/ui/notification-dialog/notification-dialog.component';
import { UserModuleService } from '../../../user-profile/services/user-module.service';
import { Router } from '@angular/router';
import { UserStore } from '../../../../core/stores/user.store';
import { UserService } from '../../../user-profile/services/user.service';

@Component({
  selector: 'app-failed-module-decision-dialog',
  imports: [
    MatButton,
    MatDialogContent,
    SelectorComponent,
    TranslatePipe
  ],
  templateUrl: './failed-module-decision-dialog.component.html',
  styleUrl: './failed-module-decision-dialog.component.scss'
})
export class FailedModuleDecisionDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModuleResponse
  ) {
  }

  readonly #langStore = inject(LangStore);
  readonly #appStore = inject(AppStore);
  readonly #userStore = inject(UserStore);
  readonly userModuleService = inject(UserModuleService);
  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);
  readonly userService = inject(UserService);

  readonly selectedNode = this.#appStore.selectedNode;
  readonly isLoggedIn = this.#appStore.isLoggedIn;
  readonly lang = this.#langStore.lang;
  readonly user = this.#userStore.user;


  readonly node = this.#appStore.modules().find(m => m.code === this.selectedNode().id);
  readonly userModule = this.user().userModules.find(um => um.code === this.selectedNode().id);

  readonly selectedSemester = this.userModule?.selectedSemester ?? 0;

  semesters: string[] = [(this.selectedSemester +1).toString(), (this.selectedSemester + 2).toString()];

  semester = new FormControl('');

  onSemesterChanged(value: string) {
    this.semester.setValue(value);
  }

  update() {

    if (!this.node) {
      return;
    }
    const userModuleId: UserModuleId = {
      username: this.user().username,
      moduleCode: this.node.code
    };

    const userModuleUpdateRequest: UserModuleUpdateRequest = {
      id: userModuleId,
      status: MODULE_STATUS.RETAKE_IN_PROGRESS.de

    };
    const semesterValue = this.semester.value;

    if (semesterValue !== null && semesterValue !== '' && semesterValue !== undefined) {
      userModuleUpdateRequest.selectedSemester = Number(semesterValue);
    }

    this.userModuleService.updateUserModule(userModuleUpdateRequest).subscribe({
      next: () => {
        console.log('userModuleUpdateRequest: ' + JSON.stringify(userModuleUpdateRequest))

        this.userService.getMe().subscribe({
          next: (user) => {
            this.#userStore.setUser(user);
          },
        });
        this.dialog.closeAll();

      },
      error: (err) => {

        this.dialog.open(NotificationDialogComponent, {
          width: '550px',
          data: {
            notification: 'NOTIFICATION_DIALOG.ERROR',
            buttonText: 'NOTIFICATION_DIALOG.CONFIRM_BUTTON'
          }
        });
      }
    });

  }

  back() {
    this.dialog.closeAll();
    this.router.navigate(['/study-progress-management']);
  }
}


