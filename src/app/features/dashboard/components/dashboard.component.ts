import { Component, computed, EventEmitter, inject, OnInit } from '@angular/core';
import { NodesComponent } from './nodes/nodes.component';
import { SelectorComponent } from '../../../shared/ui/selector/selector.component';
import { DashboardStore } from '../stores/dashboard.store';
import { MatButton } from '@angular/material/button';
import { ModuleResponse } from '../../../shared/models/module-response.model';
import { LangStore } from '../../../core/stores/lang.store';
import { AppStore } from '../../../core/stores/app.store';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchComponent } from '../../../shared/ui/search/search.component';
import { AiService } from '../services/ai.service';
import { SimilaritySearchResponse } from '../models/similarity-search-response.model';
import { NotificationDialogComponent } from '../../../shared/ui/notification-dialog/notification-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [
    SelectorComponent,
    NodesComponent,
    MatButton,
    TranslatePipe,
    SearchComponent
  ],
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  readonly #dashboardStore = inject(DashboardStore);
  readonly #langStore = inject(LangStore);
  readonly #appStore = inject(AppStore);

  readonly aiService = inject(AiService);
  readonly dialog = inject(MatDialog);


  departments = this.#dashboardStore.departments;
  programs = this.#dashboardStore.programs;
  moduleTypes = this.#dashboardStore.moduleTypes;
  readonly isLoggedIn = this.#appStore.isLoggedIn;


  currentModules = this.#dashboardStore.modules;
  currentLanguage = this.#langStore.lang;

  currentModuleNames = computed(() =>
    this.currentModules()
      .map(m => m?.name?.[this.currentLanguage()] || m.code)
      .sort()
  );


  selectedDepartment = this.#dashboardStore.selectedDepartment;
  selectedProgram = this.#dashboardStore.selectedProgram;
  selectedModule = this.#dashboardStore.selectedModule;
  selectedModuleType = this.#dashboardStore.selectedModuleType;

  resetEmitterDepartment = new EventEmitter<void>();
  resetEmitterProgram = new EventEmitter<void>();
  resetEmitterModuleType = new EventEmitter<void>();
  resetEmitterModule = new EventEmitter<void>();

  currentSelectedModuleValue = computed(() =>
    this.selectedModule()?.name?.[this.currentLanguage()] ?? ''
  );

  departmentDisabled = false;
  programDisabled = false;
  moduleDisabled = false;
  moduleTypeDisabled = false;

  ngOnInit(): void {
    this.resetSelectors();
    this.#appStore.setIsProfileView(false);
    this.#appStore.setIsOnHomePage(true);
    this.#appStore.setFlagged(false);
    this.#appStore.setIsONModuleComparisonPage(false);



  }

  onDepartmentSelected(department: string) {
    this.resetProgram();
    this.resetModuleType();
    this.resetModule();

    this.#dashboardStore.setSelectedDepartment(department);

  }

  onProgramSelected(program: string) {
    this.#dashboardStore.setIsProgramSelectorChanged(true);
    this.resetModuleType();
    this.resetModule();
    this.#dashboardStore.setSelectedProgram(program);
  }


  onModuleTypeSelected(moduleType: string) {
    this.#dashboardStore.setIsModuleTypeSelectorChanged(true);

    this.#dashboardStore.setSelectedModuleType(moduleType);
  }

  onModuleSelected(module: ModuleResponse) {

    this.#dashboardStore.setSelectedModule(module);
  }

  resetProgram() {
    this.#dashboardStore.setSelectedProgram(undefined);
    this.resetEmitterProgram.emit();
    this.#dashboardStore.setIsProgramSelectorChanged(false);
  }

  resetDepartment() {
    this.#dashboardStore.setSelectedDepartment(undefined);
    this.resetEmitterDepartment.emit();
    this.#dashboardStore.setIsDepartmentSelectorChanged(false);
  }

  resetModuleType() {
    this.#dashboardStore.setSelectedModuleType(undefined);
    this.resetEmitterModuleType.emit();
    this.#dashboardStore.setIsModuleTypeSelectorChanged(false);
  }

  resetModule() {
    this.#dashboardStore.setSelectedModule(undefined);
    this.resetEmitterModule.emit();
    this.#dashboardStore.setIsModuleSelectorChanged(false);
  }

 resetSelectors() {
    this.resetDepartment();
    this.resetProgram();
    this.resetModuleType();
    this.resetModule();
  }

  onSearch($event: any) {


    this.aiService.findModulesByKeywords($event).subscribe({
      next: (responses: SimilaritySearchResponse[]) => {

        if (responses.length > 0) {
          this.#dashboardStore.setSimilaritySearchResults(responses);


        } else {
          this.dialog.open(NotificationDialogComponent, {
            width: '550px',
            data: { notification: 'DASHBOARD.SIMILARITY_SEARCH_NO_RESULT', buttonText: 'NOTIFICATION_DIALOG.CONFIRM_BUTTON'}
          });
        }
      },
      error: () => {
        const errorNotification = 'DASHBOARD.SIMILARITY_SEARCH_ERROR';
        this.dialog.open(NotificationDialogComponent, {
          width: '550px',
          data: { notification: errorNotification, buttonText: 'NOTIFICATION_DIALOG.CONFIRM_BUTTON'}
        });
      }
    });
  }

}
