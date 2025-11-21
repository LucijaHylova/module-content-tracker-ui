import { inject, Injectable } from '@angular/core';

import { ModuleResponse } from '../models/module-response.model';
import { CATEGORY, COMPARISON, MODULE_STATUS, MODULE_TYPE } from '../models/node.enum';
import {
  NodeDetailsDialogComponent
} from '../../core/components/node-details-dialog/node-details-dialog.component';
import { DashboardStore } from '../../features/dashboard/stores/dashboard.store';
import { LangStore } from '../../core/stores/lang.store';
import { AppStore } from '../../core/stores/app.store';
import { UserStore } from '../../core/stores/user.store';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponent } from '../ui/notification-dialog/notification-dialog.component';
import { AuthService } from '../../features/user-profile/services/auth.service';
import { Router } from '@angular/router';
import { ModuleComparisonStore } from '../../features/module-comparison/stores/module-comparison.store';
import { UserModuleResponse } from '../../features/dashboard/models/user-module-response.model';
import {
  FailedModuleDecisionDialogComponent
} from '../../features/study-progress-management/components/failed-module-decision-dialog/failed-module-decision-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  readonly #dashboardStore = inject(DashboardStore);
  readonly #langStore = inject(LangStore);
  readonly #appStore = inject(AppStore);
  readonly #userStore = inject(UserStore);
  readonly selectedNode = this.#appStore.selectedNode;
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly #moduleComparisonStore = inject(ModuleComparisonStore);


  readonly chartOptions = this.#dashboardStore.chartOptions;
  readonly loading = this.#dashboardStore.loading;
  readonly lang = this.#langStore.lang;
  readonly user = this.#userStore.user;


  readonly dialog = inject(MatDialog);
  onNodeClick($event: any) {
    const data = $event?.data;
    const userModule: UserModuleResponse | undefined =
      this.#userStore.user()?.userModules?.find((m: UserModuleResponse) => m.code === data.id);


    let node: ModuleResponse | undefined;

    if (data.category === CATEGORY.MODULE[this.lang()] || this.selectedNode().flagged) {
      node = this.#appStore.modules().find(m => m.code ===  data.id);
    }
    else if (data.category === CATEGORY.PROGRAM[this.lang()]) {
      node = this.#appStore.modules().find(m => m.program[this.lang()] === data.id);
    } else if (data.category === CATEGORY.DEPARTMENT[this.lang()] ) {
      node = this.#appStore.modules().find(m => m.department[this.lang()] === data.id);
    }


    switch ($event?.data?.category) {

      case CATEGORY.PROGRAM[this.lang()]: {

        this.#appStore.setSelectedNode({ isModule: false, category: CATEGORY.PROGRAM[this.lang()], id: node?.program?.de, name: data.name});
        this.dialog.open(NodeDetailsDialogComponent, { width: '550px', maxWidth: 'none', data: this.selectedNode() });
        break;
      }
      case CATEGORY.DEPARTMENT[this.lang()]: {
        this.#appStore.setSelectedNode({ isModule: false, category: CATEGORY.DEPARTMENT[this.lang()], id: node?.department?.de,  name: data.name });
        this.dialog.open(NodeDetailsDialogComponent, { width: '550px',  maxWidth: 'none', data: this.selectedNode() });
        break;
      }
      case CATEGORY.MODULE_TYPE[this.lang()]: {
        this.#appStore.setSelectedNode({ isModule: false, category: CATEGORY.MODULE_TYPE[this.lang()], id: node?.moduleType?.de, name: data.name });
        this.dialog.open(NodeDetailsDialogComponent, { width: '550px', maxWidth: 'none', data: this.selectedNode() });
        break;
      }
      case CATEGORY.RESPONSIBILITY[this.lang()]: {
        this.#appStore.setSelectedNode({ isModule: false, category: CATEGORY.RESPONSIBILITY[this.lang()], id: node?.responsibility?.de, name: data.name });
        this.dialog.open(NodeDetailsDialogComponent, { width: '550px', maxWidth: 'none', data: this.selectedNode() });
        break;
      }
      case COMPARISON.SIMILARITY[this.lang()]: {
        this.#appStore.setSelectedNode({ isModule: false, category: COMPARISON.SIMILARITY[this.lang()], id: node?.code, name: data.name });
        this.dialog.open(NodeDetailsDialogComponent, { width: '550px', maxWidth: 'none', data: this.selectedNode() });
        break;
      }
      case COMPARISON.DIFFERENCE[this.lang()]: {
        this.#appStore.setSelectedNode({ isModule: false, category: COMPARISON.DIFFERENCE[this.lang()], id: node?.code, name: data.name });
        this.dialog.open(NodeDetailsDialogComponent, { width: '550px', maxWidth: 'none', data: this.selectedNode() });
        break;
      }
      default: {
        const isCompulsory = node?.moduleType?.[this.lang()] === MODULE_TYPE.PFLICHTMODUL[this.lang()];
        const isInUserStudy = this.#userStore.user().userModules?.some(m => m.code === node?.code);
        const flagged = this.selectedNode().flagged;
        const isInModuleComparison = this.#moduleComparisonStore.modulesToCompare().some(m => m === node?.code);
        this.#appStore.setSelectedNode({ isModule: true, category: CATEGORY.MODULE[this.lang()], id: node?.code, name: data.name, isCompulsory: isCompulsory, isInUserStudy: isInUserStudy, flagged: flagged, isInModuleComparison: isInModuleComparison});
        if(userModule?.status === MODULE_STATUS.FAILED.de && this.selectedNode().flagged) {
          this.dialog.open(FailedModuleDecisionDialogComponent, { width: '800px', maxWidth: 'none', data: node });
        }
        else {
          this.dialog.open(NodeDetailsDialogComponent, { width: '800px',  maxWidth: 'none', data: node });

        }
      }
    }
  }

  logout() {
    this.authService.logout();
    this.#appStore.setIsLoggedIn(false);
    this.#appStore.setIsRouting(true);
    this.#dashboardStore.setSelectedDepartment(undefined);
    this.#dashboardStore.setSelectedProgram(undefined);
    this.#dashboardStore.setSelectedModuleType(undefined);
    this.#dashboardStore.setSelectedModule(undefined);
    this.dialog.open(NotificationDialogComponent, {
      width: '450px',
      data: { notification: 'LOGOUT_DIALOG.SUCCESS', buttonText: 'NOTIFICATION_DIALOG.CONFIRM_BUTTON'}
    });
    this.router.navigate(['/home']);
  }

}
