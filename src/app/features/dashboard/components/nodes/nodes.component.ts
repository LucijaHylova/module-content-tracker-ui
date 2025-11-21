import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild
} from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { DashboardStore } from '../../stores/dashboard.store';
import * as echarts from 'echarts';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../shared/services/common.service';


@Component({
  selector: 'app-nodes',
  imports: [
    NgxEchartsDirective
  ],
  templateUrl: './nodes.component.html'
})
export class NodesComponent implements AfterViewInit {

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  private readonly TEST_MODE = environment.apiUrl;

  readonly dialog = inject(MatDialog);

  readonly #dashboardStore = inject(DashboardStore);
  readonly commonService = inject(CommonService);


  readonly chartOptions = this.#dashboardStore.chartOptions;
  readonly loading = this.#dashboardStore.loading;



  ngAfterViewInit() {
    const chartDom = this.chartContainer.nativeElement;
    echarts.init(chartDom, undefined, { renderer: this.TEST_MODE ? 'svg' : 'canvas' });
  }

  onChartLegendSelectChange($event: any) {
    const selected = $event?.selected;
    this.#dashboardStore.setLegendSelection(selected);
  }

  onNodeClick($event: any) {
    this.commonService.onNodeClick($event);
  }
}
