import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { createPieChartConfig } from '../../../shared/charts-config/pie-chart.config';
import { ModuleContentProfile } from '../models/module-content-profile.model';
import { DashboardStore } from '../../dashboard/stores/dashboard.store';
import { CATEGORY } from '../../../shared/models/node.enum';
import { LangStore } from '../../../core/stores/lang.store';
import { Lang } from '../../../shared/models/lang-model';
import { AppStore } from '../../../core/stores/app.store';

interface ModuleContentProfilState {
  profiles: ModuleContentProfile[];
  category: string;
  loading: boolean;
}


export const ModuleContentProfileStore = signalStore(
  { providedIn: 'root' },
  withState< ModuleContentProfilState>({
    profiles: [],
    category: CATEGORY.MODULE.de,
    loading: false,
  }),


  withComputed((store) => {
    const appStore = inject(AppStore);
    const langStore = inject(LangStore);

    return {
      chartOptions: computed(() => {
        const profiles = store.profiles();
        const lang =  langStore.lang();
        const selectedNode = appStore.selectedNode;
        const profile = profiles.find((p: ModuleContentProfile) => p.code === selectedNode.id());

        const data = (profile?.contents ?? []).map(entry => {
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
          selectedNode.name() || selectedNode.id() || '',
          'Module Content Profile',
          data
        );
      })
    };
  }),


  withMethods((store) => ({
    setModuleContentProfiles(profiles: ModuleContentProfile[]) {
      patchState(store, {profiles: profiles });
    },
    setLoading(loading: boolean) {
      patchState(store, {loading:loading});
    },
  }))
);




