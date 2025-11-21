import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { LangStore } from '../../../core/stores/lang.store';
import { UserStore } from '../../../core/stores/user.store';
import { createScatterChartConfig } from '../../../shared/charts-config/scatter-chart.config';
import { ItemStyle, ScatterNode } from '../../../shared/models/scatter.model';
import { UserModuleResponse } from '../../dashboard/models/user-module-response.model';
import { MODULE_STATUS } from '../../../shared/models/node.enum';
import { AppStore } from '../../../core/stores/app.store';
import { TranslateService } from '@ngx-translate/core';

 export function borderColorByModuleStatus(ms: string, ): string {
  switch (ms) {
    case MODULE_STATUS.FAILED.de: return '#D50000';
    case MODULE_STATUS.IN_PROGRESS.de: return '#243ecf';
    case MODULE_STATUS.RETAKE_IN_PROGRESS.de: return '#188dca';
    case MODULE_STATUS.PASSED.de: return '#1af604';
    default: return '#000000';
  }
}

interface StudyProgressState {
  loading: boolean;

}

export const StudyProgressStore = signalStore(
  { providedIn: 'root' },

  withState<StudyProgressState>({

    loading: false
  }),

  withComputed(() => {
    const userStore = inject(UserStore);
    return {
      user: computed(() => {
        return userStore.user();
      })
    };
  }),
  withComputed((store) => {

    return {
      userModules: computed(() => {
        const user = store.user();
        return user.userModules;
      })
    };
  }),


  withComputed((store) => {
    const langStore = inject(LangStore);
    const appStore = inject(AppStore);
    const translate = inject(TranslateService);

    return {
      chartOptions: computed(() => {
        let data: UserModuleResponse[] = store.userModules();
        const lang = langStore.lang();
        const nodesMap = new Map<string, ScatterNode>();
        const sortedUserModules = data.sort((a, b) =>
          a.selectedSemester - b.selectedSemester ||
          a.code.localeCompare(b.code)
        );
        let totalECTS = 0;
        let i = 0;

        for (const um of sortedUserModules) {
          let mod = appStore.modules().find(m => m.code === um.code);
          if (!mod) continue;
          let itemStyle: ItemStyle = {};
          let status= '';
          switch (um.status) {
            case MODULE_STATUS.PASSED.de:
              status = um.status;
              itemStyle.borderColor = borderColorByModuleStatus(um.status);
              itemStyle.borderWidth = 5;
              itemStyle.opacity = 1.0;
              break;

            case MODULE_STATUS.FAILED.de:
              status = um.status;
              itemStyle.borderColor = borderColorByModuleStatus(um.status);
              itemStyle.borderWidth = 5;
              itemStyle.opacity = 1.0;
              break;

            case MODULE_STATUS.RETAKE_IN_PROGRESS.de:
              status = um.status;
              itemStyle.borderColor = borderColorByModuleStatus(um.status);
              itemStyle.borderWidth = 5;
              itemStyle.opacity = 1.0;
              break;

            case MODULE_STATUS.IN_PROGRESS.de:
              status = um.status;
              itemStyle.borderColor = borderColorByModuleStatus(um.status);
              itemStyle.borderWidth = 5;
              itemStyle.opacity = 1.0;
              break;

            case MODULE_STATUS.PLANNED.de:
              status = um.status;
              itemStyle.opacity = 0.8;
              break;

            default:
              break;
          }


          if (um.status !== MODULE_STATUS.FAILED.de) {
            totalECTS += mod.ects;
          }
          //const yGap = i * 0.05;  // << SUPER EINFACH
          i++;
          const yGap = (Math.random() * 0.5);


          nodesMap.set(um.code, {
            y: (um.status === MODULE_STATUS.FAILED.de
                ? um.selectedSemester - 0.9
                : um.selectedSemester - 0.5
            ) + yGap,
            x: totalECTS,
            name: um.name[lang] ?? um.code,
            id: um.code,
            ects: mod.ects,
            category: mod.moduleType[lang],
            specialization: mod.specialization?.[lang],
            selectedSemester: um.selectedSemester ?? mod.semesters?.[0],
            status: status,
            itemStyle: itemStyle

          });

        }
        const tooltipFormatter = (params: any) => {
          const d = params.data;

          return `
          <strong>${d.name} – ${d.id}</strong><br/>
          ${translate.instant('STUDY_PROGRESS.MODULE_TYPE')}: ${d.category}<br/>
          ${translate.instant('STUDY_PROGRESS.MODULE_ECTS')}: ${d.ects}<br/>
          ${translate.instant('STUDY_PROGRESS.TOTAL_PLANNED_ECTS')}: ${d.value[0]}<br/>
          ${translate.instant('STUDY_PROGRESS.SEMESTER')}: ${d.selectedSemester}<br/>
          ${translate.instant('STUDY_PROGRESS.SPECIALIZATION')}: ${d.specialization ?? '-'}<br/>
          ${translate.instant('STUDY_PROGRESS.STATUS')}: ${d.status}
        `;
        };

        const nodes = Array.from(nodesMap.values());
        return createScatterChartConfig(nodes, tooltipFormatter);
      })

    };
  }),

  withMethods((store) => ({

    setLoading(loading: boolean) {
      patchState(store, { loading });
    }


  }))
);




