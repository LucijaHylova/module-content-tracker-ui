import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ProgramCompetenceProfile } from '../models/program-competence-profile.model';
import { createPieChartConfig } from '../../../shared/charts-config/pie-chart.config';
import { DashboardStore } from '../../dashboard/stores/dashboard.store';
import { CATEGORY } from '../../../shared/models/node.enum';
import { LangStore } from '../../../core/stores/lang.store';
import { Lang } from '../../../shared/models/lang-model';
import { AppStore } from '../../../core/stores/app.store';


interface ProgramCompetenceProfilState {
  profiles: ProgramCompetenceProfile[];
  category: string;
  loading: boolean;
  fullProgramId: string | undefined;
  selectedModuleType: string | undefined;
}


export const ProgramCompetenceProfileStore = signalStore(
  { providedIn: 'root' },

  withState<ProgramCompetenceProfilState>({
    profiles: [],
    category: CATEGORY.PROGRAM.de,
    loading: false,
    fullProgramId: undefined,
    selectedModuleType: undefined
  }),


  withComputed((store) => {
    const appStore = inject(AppStore);
    const dashboardStore = inject(DashboardStore);
    const langStore = inject(LangStore);

    return {
      chartOptions: computed(() => {
        const profiles = store.profiles();
        const selectedNode = appStore.selectedNode();
        const lang =  langStore.lang();
        const profile = profiles.find(m => m.program === (store.fullProgramId() ?? selectedNode?.id));

        const data = (profile?.competencies ?? []).map(entry => {
          let name: string;
          console.log('selectedNodeId', selectedNode.id);
          if (lang === Lang.DE) {
            name = entry.key_de;
          } else if (lang === Lang.EN) {
            name = entry.key_en;
          } else {
            name = entry.key_de;
          }
          return {
            name,
            value: entry.value,
          };
        });
        return createPieChartConfig(
           selectedNode.name ?? '',
          'Program Competence Profile',
          data
        );
      }),

      moduleTypes: computed(() => {
        const lang =  langStore.lang();
        const selectedNodeId = appStore.selectedNode().id;

        const data = appStore.modules()
          .filter(m => !selectedNodeId || m.program?.de === selectedNodeId)
          .map((m) => m.moduleType?.[lang] ?? '')

          .filter((d) => d.trim().length > 0);
        return Array.from(new Set(data)).sort();
      }),

    };
  }),

  withMethods((store) => ({
    setProgramCompetenceProfiles(profiles: ProgramCompetenceProfile[]) {
      patchState(store, { profiles });
    },
    setLoading(loading: boolean) {
      patchState(store, { loading });
    },
    setSelectedModuleType(moduleType: string | undefined) {
      patchState(store, { selectedModuleType: moduleType });
    },
    setFullProgramId(fullProgramId: string | undefined) {
      patchState(store, { fullProgramId: fullProgramId });
    }
  }))
);
