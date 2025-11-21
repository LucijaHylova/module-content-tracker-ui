import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { CATEGORY, COMPARISON } from '../../../shared/models/node.enum';
import { createGraphChartConfig } from '../../../shared/charts-config/graph-chart.config';
import { LangStore } from '../../../core/stores/lang.store';

import { ModuleComparison } from '../models/module-comparition.model';
import {
  ModuleComparisonGraphEdge,
  ModuleComparisonGraphNode
} from '../../../shared/models/module-comparison-graph.model';


interface ModuleGraphDashboardState {
  modulesComparisonResults: ModuleComparison [],
  loading: boolean;
  modulesToCompare: string [];
}


export const ModuleComparisonStore = signalStore(
  { providedIn: 'root' },

  withState<ModuleGraphDashboardState>({
    modulesComparisonResults: [],
    loading: false,
    modulesToCompare: []
  }),

  withComputed((store) => {
    const langStore = inject(LangStore);

    return {
      chartOptions: computed(() => {
        const modules: ModuleComparison[] = store.modulesComparisonResults();
        const lang = langStore.lang();

        const nodesMap = new Map<string, ModuleComparisonGraphNode>();
        const edges: ModuleComparisonGraphEdge[] = [];

        for (const mod of modules) {

          nodesMap.set(mod.code, {
            id: mod.code,
            name: mod.name[lang] ?? mod.code,
            category: CATEGORY.MODULE[lang],
            symbolSize: 30
          });


          const simList = lang === 'de' ? mod.similarities_de : mod.similarities_en;

          for (const sim of simList) {
            const simId = `SIM_${sim}`;

            if (!nodesMap.has(simId)) {
              nodesMap.set(simId, {
                id: simId,
                name: sim,
                category: COMPARISON.SIMILARITY[lang],
                symbolSize: 20

              });
            }

            edges.push({ source: mod.code, target: simId });
          }


          const diffList = lang === 'de' ? mod.differences_de : mod.differences_en;

          for (const diff of diffList) {
            const diffId = `DIFF_${diff}`;

            if (!nodesMap.has(diffId)) {
              nodesMap.set(diffId, {
                id: diffId,
                name: diff,
                category: COMPARISON.DIFFERENCE[lang],
                symbolSize: 20
              });
            }

            edges.push({ source: mod.code, target: diffId });
          }
        }


        const nodes = Array.from(nodesMap.values());

        const categories = Array.from(
          new Set(nodes.map((n) => n.category))
        ).map((catName) => ({ name: catName }));


        return createGraphChartConfig(categories, nodes, edges);
      })
    };
  }),


  withMethods((store) => ({
    setModulesComparisonResults(modules: ModuleComparison[]) {
      patchState(store, {
        modulesComparisonResults: modules
      });
    },
    setModulesToCompare(codes: string[]) {
      patchState(store, {
        modulesToCompare: codes
      });
    },

    addModuleToCompare(code: string) {
      const current = store.modulesToCompare();
      if (!current.includes(code)) {
        patchState(store, {
          modulesToCompare: [...current, code]
        });
      }
    },
    removeModuleToCompare(code: string) {
      const current = store.modulesToCompare();
      patchState(store, {
        modulesToCompare: current.filter(c => c !== code)
      });
    },
    setLoading(loading: boolean) {
      patchState(store, {
        loading: loading
      });
    },
  }))
);




