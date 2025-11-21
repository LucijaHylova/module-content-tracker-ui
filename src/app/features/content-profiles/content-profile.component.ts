import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ModuleContentProfileStore } from './stores/module-content-profile.store';
import * as echarts from 'echarts';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AppStore, SelectedNode } from '../../core/stores/app.store';
import { TranslatePipe } from '@ngx-translate/core';
import { NodeDetailsDialogComponent } from '../../core/components/node-details-dialog/node-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-content-profile',
  imports: [
    MatButton,
    NgxEchartsDirective,
    TranslatePipe
  ],
  templateUrl: './content-profile.component.html',
  styleUrl: './content-profile.component.scss'
})
export class ContentProfileComponent implements OnInit, AfterViewInit {

  @ViewChild('chartContainerContentProfile') chartContainer!: ElementRef;
  private readonly TEST_MODE = environment.apiUrl;

  readonly router = inject(Router);

  readonly #moduleContentProfileStore = inject(ModuleContentProfileStore);
  readonly #appStore = inject(AppStore);
  readonly moduleContentProfileChartOptions = this.#moduleContentProfileStore.chartOptions;

  readonly selectedNode = this.#appStore.selectedNode;
  readonly dialog = inject(MatDialog);


  loading = false;
  chartOptions: any = {};


  ngAfterViewInit(): void {
    this.chartOptions = this.moduleContentProfileChartOptions();
    const chartDom = this.chartContainer.nativeElement;
    echarts.init(chartDom, undefined, { renderer: this.TEST_MODE ? 'svg' : 'canvas' });
  }

  ngOnInit(): void {
    this.#appStore.setIsProfileView(true);
    this.#appStore.setIsONModuleComparisonPage(false);

  }

  back($event: SelectedNode) {
    let node = this.#appStore.modules().find(m => m.code === this.selectedNode().id);
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
}
