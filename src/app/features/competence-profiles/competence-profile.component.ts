import { AfterViewInit, Component, ElementRef, EventEmitter, inject, OnInit, ViewChild } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ModuleCompetenceProfileStore } from './stores/module-competence-profile.store';
import * as echarts from 'echarts';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { ProgramCompetenceProfileStore } from './stores/program-competence-profile.store';
import { CATEGORY } from '../../shared/models/node.enum';
import { DepartmentCompetenceProfileStore } from './stores/department-competence-profile.store';
import { SelectorComponent } from '../../shared/ui/selector/selector.component';
import { environment } from '../../../environments/environment';
import { AppStore, SelectedNode } from '../../core/stores/app.store';
import { window } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { LangStore } from '../../core/stores/lang.store';
import { MatDialog } from '@angular/material/dialog';
import { NodeDetailsDialogComponent } from '../../core/components/node-details-dialog/node-details-dialog.component';
import { Location } from '@angular/common';


@Component({
  selector: 'app-competence-profile',
  imports: [
    NgxEchartsDirective,
    MatButton,
    SelectorComponent,
    TranslatePipe
  ],
  templateUrl: './competence-profile.component.html',
  styleUrl: './competence-profile.component.scss'
})
export class CompetenceProfileComponent implements OnInit,AfterViewInit {
  @ViewChild('chartContainerCompetenceProfile') chartContainer!: ElementRef;
  readonly router = inject(Router);
  readonly location = inject(Location);
  private readonly TEST_MODE = environment.testMode;

  readonly #moduleCompetenceProfileStore = inject(ModuleCompetenceProfileStore);
  readonly #programCompetenceProfileStore = inject(ProgramCompetenceProfileStore);
  readonly #departmentCompetenceProfileStore = inject(DepartmentCompetenceProfileStore);
  readonly #langStore = inject(LangStore);
  readonly #appStore = inject(AppStore);


  readonly moduleCompetenceProfileChartOptions = this.#moduleCompetenceProfileStore.chartOptions;
  readonly programCompetenceProfileChartOptions = this.#programCompetenceProfileStore.chartOptions;
  readonly departmentCompetenceProfileChartOptions = this.#departmentCompetenceProfileStore.chartOptions;
  readonly selectedNode = this.#appStore.selectedNode;

  moduleTypes = this.#programCompetenceProfileStore.moduleTypes;
  selectedModuleType = this.#programCompetenceProfileStore.selectedModuleType;
  loading = false;
  moduleTypeDisabled = false;
  chartOptions: any = {};
  resetEmitterModuleType = new EventEmitter<void>();
  lang = this.#langStore.lang;

  readonly dialog = inject(MatDialog);



  ngAfterViewInit(): void {
    this.getCategoryType();
    const chartDom = this.chartContainer.nativeElement;
    const chart = echarts.init(chartDom, undefined, { renderer: this.TEST_MODE ? 'svg' : 'canvas' });
    if (environment.testMode) {
      chart.on('finished', () => {
        (window as any).__chartReady = true;
      });
    }
  }

  back($event: SelectedNode) {
    this.#programCompetenceProfileStore.setSelectedModuleType(undefined);
    this.#programCompetenceProfileStore.setFullProgramId(undefined);
    let node = this.#appStore.modules().find(m => m.code === $event.id);
    const data = node ?? $event;
    if (this.selectedNode().flagged) {
      this.router.navigate(['/study-progress']);
      this.dialog.open(NodeDetailsDialogComponent, { width: '750px', maxWidth: 'none', data: data });
      return;
    }
    this.router.navigate(['/dashboard']).then(() => {

        this.dialog.open(NodeDetailsDialogComponent, { width: '750px', maxWidth: 'none', data: data });
    });

  }


  getCategoryType() {
    const category = this.selectedNode().category;
    if (category === CATEGORY.PROGRAM[this.lang()]) {
      this.chartOptions = this.programCompetenceProfileChartOptions();
    } else if (category === CATEGORY.DEPARTMENT[this.lang()]) {
      this.chartOptions = this.departmentCompetenceProfileChartOptions();
    } else {
      this.chartOptions = this.moduleCompetenceProfileChartOptions();
    }
  }

  onModuleTypeChange(moduleType: string | undefined) {
    const selectedNodeId = this.#appStore.selectedNode.id;
    const baseProgramId = selectedNodeId()?.split('_')[0];
    const fullProgramId = `${baseProgramId}_${moduleType}`;

    this.#appStore.setSelectedNodeId(selectedNodeId());
    this.#programCompetenceProfileStore.setFullProgramId(fullProgramId);
    this.#programCompetenceProfileStore.setSelectedModuleType(moduleType);
    this.chartOptions = this.programCompetenceProfileChartOptions();
  }

  resetFilters() {
    this.#programCompetenceProfileStore.setFullProgramId(undefined);
    this.chartOptions = this.programCompetenceProfileChartOptions();
    this.#programCompetenceProfileStore.setSelectedModuleType(undefined);
    this.resetEmitterModuleType.emit();
  }

  ngOnInit(): void {
    this.#appStore.setIsProfileView(true);
    this.#appStore.setIsOnHomePage(false);
    this.#appStore.setIsONModuleComparisonPage(false);
  }

  protected readonly Category = CATEGORY;
}


