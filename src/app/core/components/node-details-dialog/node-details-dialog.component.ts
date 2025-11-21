import { Component, effect, EventEmitter, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LangStore } from '../../stores/lang.store';
import { AppStore } from '../../stores/app.store';
import { NotificationDialogComponent } from '../../../shared/ui/notification-dialog/notification-dialog.component';
import { UserStore } from '../../stores/user.store';
import { UserService } from '../../../features/user-profile/services/user.service';
import { UserModuleSelectionRequest } from '../../../features/dashboard/models/module-selection-request.model';
import { SelectorComponent } from '../../../shared/ui/selector/selector.component';
import { FormControl } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModuleComparisonStore } from '../../../features/module-comparison/stores/module-comparison.store';
import { AiService } from '../../../features/dashboard/services/ai.service';
import { UserModuleUpdateRequest } from '../../../features/dashboard/models/user-module-update-request.model';
import { UserModuleId } from '../../../features/dashboard/models/user-module-id.model';
import { CATEGORY, MODULE_STATUS } from '../../../shared/models/node.enum';
import { UserUpdateRequest } from '../../../features/user-profile/models/user-update-request.model';
import { UserModuleService } from '../../../features/user-profile/services/user-module.service';
import {
  FailedModuleDecisionDialogComponent
} from '../../../features/study-progress-management/components/failed-module-decision-dialog/failed-module-decision-dialog.component';
import { ConfirmationDialogComponent } from '../../../shared/ui/confirmation-dialog/confirmation-dialog.component';
import {
  ModuleComparisonDeleteRequest
} from '../../../features/user-profile/models/module-comparison-delete-request.model';


@Component({
  selector: 'app-module-details',
  standalone: true,
  imports: [
    MatDialogContent,
    MatButton,
    TranslatePipe,
    SelectorComponent,
    MatTooltipModule
  ],
  templateUrl: './node-details-dialog.component.html',
  styleUrl: './node-details-dialog.component.scss'
})
export class NodeDetailsDialogComponent {
  readonly #langStore = inject(LangStore);
  readonly #appStore = inject(AppStore);
  readonly #userStore = inject(UserStore);
  readonly userService = inject(UserService);
  readonly userModuleService = inject(UserModuleService);
  readonly #moduleComparisonStore = inject(ModuleComparisonStore);
  readonly aiService = inject(AiService);
  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);


  readonly selectedNode = this.#appStore.selectedNode;
  readonly isLoggedIn = this.#appStore.isLoggedIn;
  readonly isOnModuleComparisonPage = this.#appStore.isOnModuleComparisonPage;

  readonly lang = this.#langStore.lang;
  readonly user = this.#userStore.user;
  readonly modulesToCompare = this.#moduleComparisonStore.modulesToCompare;

  semester = new FormControl('');
  status = new FormControl('');
  resetEmitter = new EventEmitter<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  readonly node = this.#appStore.modules().find(m => m.code === this.selectedNode().id);
  readonly userModule = this.user().userModules.find(um => um.code === this.selectedNode().id);

  semesters: string[] = this.node?.semesters?.map(s => s.toString()).filter(s => s !== this.userModule?.selectedSemester?.toString()) ?? [];
  moduleStatuses: string[] = Object.keys(MODULE_STATUS)
    .map(key => MODULE_STATUS[key as keyof typeof MODULE_STATUS][this.lang()])
    .filter(status => status !== this.userModule?.status)
    .filter(status => {
      if (this.userModule?.status !== MODULE_STATUS.RETAKE_IN_PROGRESS.de) {
        return status !== MODULE_STATUS.RETAKE_IN_PROGRESS[this.lang()];
      }
      return true;
    })
    .filter(status => {
      if (this.userModule?.status === MODULE_STATUS.IN_PROGRESS.de) {
        return status !== MODULE_STATUS.RETAKE_IN_PROGRESS[this.lang()];
      }
      if (this.userModule?.status === MODULE_STATUS.RETAKE_IN_PROGRESS.de) {
        return status !== MODULE_STATUS.IN_PROGRESS[this.lang()];
      }
      return true;
    });

  addButtonDisabled(): boolean {
    const node = this.selectedNode();
    if (!node) return true;
    if (node.isCompulsory) return true;
    return node.isInUserStudy || !this.semester.value;
  }

  addSemesterButtonDisabled(): boolean {
    if ((this.node?.semesters?.length ?? 0) < 1) {
      return true;
    }

    if (this.status.value === this.MODULE_STATUS.FAILED[this.lang()]) {
      return true;
    }
    if (this.status.value === this.MODULE_STATUS.RETAKE_IN_PROGRESS[this.lang()]) {
      return true;
    }
    if (this.status.value === this.MODULE_STATUS.PASSED[this.lang()]) {
      return true;
    }
    return false;
  }


  showCompetenceProfile() {
    this.router.navigate(['/competence-profile', this.selectedNode().id]);
    this.dialog.closeAll();
  }

  showContentProfile() {
    this.router.navigate(['/content-profile', this.selectedNode().id]);
    this.dialog.closeAll();
  }

  addToMyStudy() {

    if (!this.node) {
      return;
    }
    const userModuleId: UserModuleId = {
      username: this.user().username,
      moduleCode: this.node.code
    };
    const semesterValue = this.semester.value;

    const moduleSelectionRequest: UserModuleSelectionRequest = {
      id: userModuleId,
      selectedSemester: Number(semesterValue),
      status: MODULE_STATUS.PLANNED.de
    };


    this.userModuleService.addUserModule(moduleSelectionRequest).subscribe({
      next: () => {
        this.#appStore.setIsInUserStudy(true);
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
          data: { notification: 'NOTIFICATION_DIALOG.ERROR', buttonText: 'NOTIFICATION_DIALOG.CONFIRM_BUTTON' }
        });
      }
    });

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
      id: userModuleId
    };
    const semesterValue = this.semester.value;
    const statusValue = this.status.value;

    if (semesterValue !== null && semesterValue !== '' && semesterValue !== undefined) {
      userModuleUpdateRequest.selectedSemester = Number(semesterValue);
    }

    if (statusValue !== null && statusValue !== '' && statusValue !== undefined) {
      userModuleUpdateRequest.status = Object.values(MODULE_STATUS)
        .find(v => v.en === statusValue || v.de === statusValue)
        ?.de;

    }

    this.userModuleService.updateUserModule(userModuleUpdateRequest).subscribe({
      next: () => {
        this.userService.getMe().subscribe({
          next: (user) => {
            this.#userStore.setUser(user);
          }
        });
        if (statusValue === MODULE_STATUS.FAILED[this.lang()]) {
          this.dialog.open(FailedModuleDecisionDialogComponent, {
            width: '800px',
            maxWidth: 'none',
            data: this.node
          });
        } else {
          this.dialog.closeAll();
        }

      },
      error: (err) => {
        console.error('error' + err);
        console.error('request: ' + userModuleUpdateRequest);
        this.dialog.open(NotificationDialogComponent, {
          width: '550px',
          data: { notification: 'NOTIFICATION_DIALOG.ERROR', buttonText: 'NOTIFICATION_DIALOG.CONFIRM_BUTTON' }
        });
      }
    });

    const totalPassedEcts = this.user().userModules
        .filter(um => um.status === MODULE_STATUS.PASSED.de && um.code !== this.node?.code)
        .reduce((sum, um) => {
          const module = this.#appStore.modules().find(m => m.code === um.code);
          return sum + (module?.ects ?? 0);
        }, 0)
      + (statusValue === MODULE_STATUS.PASSED[this.lang()] ? this.node?.ects ?? 0 : 0);

    const userUpdateRequest: UserUpdateRequest = {
      username: this.user().username,
      totalPassedEcts: totalPassedEcts
    };

    this.userService.updateUser(userUpdateRequest).subscribe({

      next: () => {
        this.userService.getMe().subscribe({
          next: (user) => {
            this.#userStore.setUser(user);
          }
        });

      },
      error: () => {
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

  removeFromModuleComparison() {
    if (!this.node) {
      return;
    }
    const moduleComparisonDeleteRequest: ModuleComparisonDeleteRequest = {
      code: this.node.code
    };
    this.userService.deleteUserModuleComparison(moduleComparisonDeleteRequest).subscribe(
      {
        next: () => {
          this.#appStore.setIsInModuleComparison(false);


          this.#moduleComparisonStore.removeModuleToCompare(moduleComparisonDeleteRequest.code);
          const moduleCodes = this.modulesToCompare();

          if (moduleCodes.length > 0) {
            this.aiService.getModuleComparisonUser(moduleCodes).subscribe({
              next: (response) => {
                this.#moduleComparisonStore.setModulesComparisonResults(response);

              }
            });
          }

          this.userService.getMe().subscribe({
            next: (user) => {
              this.#userStore.setUser(user);
            }, error(err) {
              console.log('error: ' + err);
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
            data: { notification: 'NOTIFICATION_DIALOG.ERROR', buttonText: 'NOTIFICATION_DIALOG.CONFIRM_BUTTON' }
          });
        }
      }
    );
  }

  removeFromMyStudy() {
    if (!this.node) {
      return;
    }

    const userModuleId: UserModuleId = {
      moduleCode: this.node.code,
      username: this.user().username
    };

    let dialogRef = this.dialog.open(ConfirmationDialogComponent,
      {
        width: '550px'
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {

        this.userModuleService.deleteUserModule(userModuleId).subscribe({
          next: () => {
            this.#appStore.setIsInUserStudy(false);
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
              data: { notification: 'NOTIFICATION_DIALOG.ERROR', buttonText: 'NOTIFICATION_DIALOG.CONFIRM_BUTTON' }
            });
          }
        });
      }
    });

  }

  onSemesterChanged(value: string) {
    this.semester.setValue(value);
  }

  onStatusChanged(value: string) {
    this.status.setValue(value);
  }

  addToModuleComparisonList(code: string) {
    this.#moduleComparisonStore.addModuleToCompare(code);
    this.#appStore.setIsInModuleComparison(true);

    const moduleCodes = this.modulesToCompare();

    if (this.isLoggedIn()) {
      this.aiService.getModuleComparisonUser(moduleCodes).subscribe({
        next: (response) => {
          this.#moduleComparisonStore.setModulesComparisonResults(response);

        },
        error: () => {
          this.dialog.open(NotificationDialogComponent, {
            width: '550px',
            data: { notification: 'NOTIFICATION_DIALOG.ERROR', buttonText: 'NOTIFICATION_DIALOG.CONFIRM_BUTTON' }
          });
        }
      });
    }
  }

  protected readonly Category = CATEGORY;
  protected readonly MODULE_STATUS = MODULE_STATUS;
}

