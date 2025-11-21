import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild
} from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import * as echarts from 'echarts';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../shared/services/common.service';
import { ModuleComparisonStore } from '../../stores/module-comparison.store';
import { CATEGORY } from '../../../../shared/models/node.enum';
import { LangStore } from '../../../../core/stores/lang.store';


@Component({
  selector: 'app-comparison-nodes',
  imports: [
    NgxEchartsDirective
  ],
  templateUrl: './comparison-nodes.component.html'
})
export class ComparisonNodesComponent implements AfterViewInit {

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  private readonly TEST_MODE = environment.apiUrl;

  readonly dialog = inject(MatDialog);

  readonly #moduleComparisonStore = inject(ModuleComparisonStore);
  readonly commonService = inject(CommonService);
  readonly #langStore = inject(LangStore);


  readonly chartOptions = this.#moduleComparisonStore.chartOptions;
  readonly loading = this.#moduleComparisonStore.loading;
  readonly lang = this.#langStore.lang;




  ngAfterViewInit() {
    const chartDom = this.chartContainer.nativeElement;
    echarts.init(chartDom, undefined, { renderer: this.TEST_MODE ? 'svg' : 'canvas' });
  }


  onNodeClick($event: any) {
    const data = $event?.data;
    if (data.category === CATEGORY.MODULE[this.lang()]) {
      this.commonService.onNodeClick($event);
    }

  }
}
