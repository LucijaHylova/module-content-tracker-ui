import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ModuleResponse } from '../../shared/models/module-response.model';
import { computed, inject } from '@angular/core';
import { LangStore } from './lang.store';

export interface SelectedNode {
  isModule: boolean;
  category: string;
  id: string | undefined;
  name: string | undefined;
  isInUserStudy?: boolean;
  isCompulsory?: boolean;
  flagged?: boolean;
  isInModuleComparison?: boolean;
}

interface AppState {
  selectedNode: SelectedNode,
  isProfileView: boolean;
  isLoggedIn: boolean;
  isOnHomePage: boolean;
  isRouting: boolean;
  modules: ModuleResponse[];
  isOnModuleComparisonPage?: boolean;

}

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState<AppState>({
    selectedNode: {} as SelectedNode,
    isProfileView: false,
    isLoggedIn: false,
    isOnHomePage: true,
    isRouting: false,
    isOnModuleComparisonPage: false,
    modules: []
  }),


  withComputed((store) => {
    const langStore = inject(LangStore);

    return {
      programSpecializations: computed(() => {
        const lang = langStore.lang();
        const modules = store.modules();

        const map = new Map<string, string[]>();

        modules.forEach((m) => {
          const program = m.program?.[lang];
          const specialization = m.specialization?.[lang];

          if (!program || !specialization) {
            return;
          }

          if (!map.has(program)) {
            map.set(program, []);
          }

          map.get(program)!.push(specialization);
        });

        for (const [program, specs] of map.entries()) {
          const uniqueSorted = Array.from(new Set(specs)).sort();
          map.set(program, uniqueSorted);
        }

        return map;
      }),
    };
  }),



  withComputed((store) => {
    return {
      programs: computed(() => {
        const map = store.programSpecializations();
        return Array.from(map.keys()).sort();
      })
    };
  }),


  withMethods((store) => ({
    setSelectedNode(node: SelectedNode) {
      patchState(store, { selectedNode: node });
    },
    setSelectedNodeId(nodeId: string | undefined) {
      patchState(store, {
        selectedNode: {
          ...store.selectedNode(),
          id: nodeId
        }
      });
    },
    setIsInUserStudy(isInUserStudy: boolean) {
      patchState(store, {
        selectedNode: {
          ...store.selectedNode(),
          isInUserStudy: isInUserStudy
        }
      });
    },
    setIsInModuleComparison(isInModuleComparison: boolean) {
      patchState(store, {
        selectedNode: {
          ...store.selectedNode(),
          isInModuleComparison: isInModuleComparison
        }
      });
    },
    setFlagged(flagged: boolean) {
      console.log('Setting flagged to', flagged);
      patchState(store, {
        selectedNode: {
          ...store.selectedNode(),
          flagged: flagged
        }
      });
    },
    setIsProfileView(isProfileView: boolean) {
      patchState(store, { isProfileView: isProfileView });
    },
    setIsLoggedIn(isLoggedIn: boolean) {
      patchState(store, { isLoggedIn: isLoggedIn });
    },
    setIsOnHomePage(isOnHomePage: boolean) {
      patchState(store, { isOnHomePage: isOnHomePage });
    },
    setModules(modules: ModuleResponse[]) {
      patchState(store, { modules });
    },
    setIsRouting(isRouting: boolean) {
      patchState(store, { isRouting });
    },
    setIsONModuleComparisonPage(isOnModuleComparisonPage: boolean) {
      patchState(store, { isOnModuleComparisonPage });
    }

  }))
);




