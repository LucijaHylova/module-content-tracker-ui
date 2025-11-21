import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { StudyProgressStore } from '../../stores/study-progress.store';
import { LangStore } from '../../../../core/stores/lang.store';
import { NgxEchartsDirective } from 'ngx-echarts';
import { CommonService } from '../../../../shared/services/common.service';
import { environment } from '../../../../../environments/environment';
import * as echarts from 'echarts';

@Component({
  selector: 'app-study-progress',
  imports: [
    NgxEchartsDirective
  ],
  templateUrl: './study-progress.component.html',
  styleUrl: './study-progress.component.scss'
})
export class StudyProgressComponent  implements AfterViewInit  {

  @ViewChild('chartContainer') chartContainer!: ElementRef;
  private readonly TEST_MODE = environment.apiUrl;

  readonly commonService = inject(CommonService);

  readonly #studyProgressStore = inject(StudyProgressStore);
  readonly #langStore = inject(LangStore);

  readonly chartOptions = this.#studyProgressStore.chartOptions;
  readonly loading = this.#studyProgressStore.loading;
  readonly lang = this.#langStore.lang;

  ngAfterViewInit() {
    const chartDom = this.chartContainer.nativeElement;
    echarts.init(chartDom, undefined, { renderer: this.TEST_MODE ? 'svg' : 'canvas' });
  }
  onNodeClick($event: any) {
    this.commonService.onNodeClick($event);
  }
}
