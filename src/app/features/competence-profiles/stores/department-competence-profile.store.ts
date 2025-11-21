import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { createPieChartConfig } from '../../../shared/charts-config/pie-chart.config';
import { DepartmentCompetenceProfile } from '../models/department-competence-profile.model';
import { CATEGORY } from '../../../shared/models/node.enum';
import { LangStore } from '../../../core/stores/lang.store';
import { Lang } from '../../../shared/models/lang-model';
import { AppStore } from '../../../core/stores/app.store';


interface DepartmentCompetenceProfilState {
  profiles: DepartmentCompetenceProfile[];
  category: string;
  loading: boolean;
}


export const DepartmentCompetenceProfileStore = signalStore(
  { providedIn: 'root' },
  withState<DepartmentCompetenceProfilState>({
    profiles: [],
    category: CATEGORY.DEPARTMENT.de,
    loading: false,
  }),

  withComputed((store) => {
    const appStore = inject(AppStore);
    const langStore = inject(LangStore);

    return {
      chartOptions: computed(() => {
        const profiles = store.profiles();
        const lang =  langStore.lang();
        const selectedNode = appStore.selectedNode();

        const profile = profiles.find(m => m.department === selectedNode.id);
        const data = (profile?.competencies ?? []).map(entry => {
          let name: string;
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
          'Department Competence Profile',
          data
        );
      })
    };
  }),

  withMethods((store) => ({
    setDepartmentCompetenceProfiles(profiles: DepartmentCompetenceProfile[]) {
      patchState(store, {profiles: profiles });
    },
    setLoading(loading: boolean) {
      patchState(store, {loading:loading});
    },
  }))
);




