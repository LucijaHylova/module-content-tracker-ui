import { computed, effect, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ModuleResponse } from '../../../shared/models/module-response.model';
import { GraphEdge, GraphNode } from '../../../shared/models/graph.model';
import { CATEGORY } from '../../../shared/models/node.enum';
import { createGraphChartConfig } from '../../../shared/charts-config/graph-chart.config';
import { LangStore } from '../../../core/stores/lang.store';
import { SimilaritySearchResponse } from '../models/similarity-search-response.model';
import { Lang } from '../../../shared/models/lang-model';
import { AppStore } from '../../../core/stores/app.store';
import { UserStore } from '../../../core/stores/user.store';


interface ModuleGraphDashboardState {

  selectedDepartment: string | undefined,
  selectedProgram: string | undefined,
  selectedModule: ModuleResponse | undefined;
  selectedModuleType: string | undefined;
  selectedResponsibility: string | undefined;
  loading: boolean;
  isDepartmentSelectorChanged: boolean;
  isProgramSelectorChanged: boolean;
  isModuleSelectorChanged: boolean;
  isModuleTypeSelectorChanged: boolean;
  legendSelection: Record <string, boolean>;
  similaritySearchResults: SimilaritySearchResponse[];

}

function sizeByCategory(cat: string, lang: Lang): number {
  switch (cat) {
    case CATEGORY.DEPARTMENT[lang]: return 80;
    case CATEGORY.PROGRAM[lang]: return 50;
    case CATEGORY.MODULE[lang]: return 30;
    case CATEGORY.MODULE_TYPE[lang]: return 20;
    case CATEGORY.RESPONSIBILITY[lang]: return 10;
    default: return 20;
  }
}

function colorByCategory(cat: string, lang: Lang): string {
  switch (cat) {
    case CATEGORY.DEPARTMENT[lang]: return '#1c2740';
    case CATEGORY.PROGRAM[lang]: return '#265943';
    case CATEGORY.MODULE[lang]: return '#5470C6';
    case CATEGORY.MODULE_TYPE[lang]: return '#bcb62f';
    case CATEGORY.RESPONSIBILITY[lang]: return '#c63a3a';
    default: return '#000000';
  }
}

function filterModulesBySimilarityResults(
  data: ModuleResponse[],
  similarityResults?: SimilaritySearchResponse[]
): ModuleResponse[] {
  const results = similarityResults || [];
  const codes = results.map(r => r.code);
  if (codes.length === 0) {
    return data;
  }
  return data.filter(m => codes.includes(m.code));
}


export const DashboardStore = signalStore(
  { providedIn: 'root' },

  withState<ModuleGraphDashboardState>({

    selectedDepartment: undefined,
    selectedProgram: undefined,
    selectedModule: undefined,
    selectedModuleType: undefined,
    selectedResponsibility: undefined,
    loading: false,
    isDepartmentSelectorChanged: false,
    isProgramSelectorChanged: false,
    isModuleSelectorChanged: false,
    isModuleTypeSelectorChanged: false,
    legendSelection: {
      'Module': true,
      'Program': false,
      'Department': false,
      'Module Type': false,
      'Responsibility': false,
      'Modul': true,
      'Studiengang': false,
      'Modultyp': false,
      'Verantwortung': false,
    } as Record<string, boolean>,
    similaritySearchResults: [],
  }),

  withComputed((store) => {
    const userStore = inject(UserStore);

    return {

      availableUserModules: computed(() => {
        const availableUserModules = userStore.availableUserModules();

        return Array.from(availableUserModules).sort() as ModuleResponse[];
      })

    };
  }),
  withComputed((store) => {
    const langStore = inject(LangStore);
    const appStore = inject(AppStore);


    return {
      modules: computed(() => {
        const lang =  langStore.lang();
        const currentDepartment = store.selectedDepartment();
        const currentProgram = store.selectedProgram();
        const currentModuleType = store.selectedModuleType();
        const currentModule = store.selectedModule();
        const isLoggedIn = appStore.isLoggedIn();
        let data: ModuleResponse[] =  isLoggedIn ? store.availableUserModules() : appStore.modules();

        data = filterModulesBySimilarityResults(data, store.similaritySearchResults?.());

        const filtered = data
          .filter((m) => !currentDepartment || m.department?.[lang] === currentDepartment)
          .filter((m) => !currentProgram || m.program?.[lang] === currentProgram)
          .filter((m) => !currentModuleType || m.moduleType?.[lang] === currentModuleType)
          .filter((m) => !currentModule || m.name?.[lang] === currentModule.toString());

        return Array.from(new Set(filtered)).sort() as ModuleResponse[];
      }),
    };
  }),

  withComputed((store) => {
    const langStore = inject(LangStore);
    const appStore = inject(AppStore)


    return {
      chartOptions: computed(() => {
        let data: ModuleResponse[] = store.modules();
        const legendSelection = store.legendSelection();
        const lang =  langStore.lang();
        const nodesMap = new Map<string, GraphNode>();
        const edges: GraphEdge[] = [];

        for (const mod of data) {

          nodesMap.set(mod.code, {
            id: mod.code,
            name: mod.name[lang] ?? mod.code,
            symbolSize:  sizeByCategory(CATEGORY.MODULE[lang], lang),
            category: CATEGORY.MODULE[lang],
            itemStyle: { color: colorByCategory(CATEGORY.MODULE[lang], lang) }
          });

          const relations = [
            { value: mod.program[lang], category: CATEGORY.PROGRAM[lang], itemStyle: { color: colorByCategory(CATEGORY.PROGRAM[lang], lang) } },
            { value: mod.department[lang], category: CATEGORY.DEPARTMENT[lang], itemStyle: { color: colorByCategory(CATEGORY.DEPARTMENT[lang], lang) } },
            { value: mod.moduleType[lang], category: CATEGORY.MODULE_TYPE[lang], itemStyle: { color: colorByCategory(CATEGORY.MODULE_TYPE[lang], lang)} },
            { value: mod.responsibility.de, category: CATEGORY.RESPONSIBILITY[lang], itemStyle: { color: colorByCategory(CATEGORY.RESPONSIBILITY[lang], lang) } }
          ];

          for (const rel of relations) {
            if (!nodesMap.has(rel.value)) {
              nodesMap.set(rel.value, {
                id: rel.value,
                name: rel.value,
                category: rel.category,
                symbolSize: sizeByCategory(rel.category, lang),
                itemStyle: { color: rel.itemStyle.color }
              });
            }
            edges.push({ source: mod.code, target: rel.value });
          }
        }

        const nodes = Array.from(nodesMap.values());
        const categories = Array.from(new Set(nodes.map((n: GraphNode) =>
          n.category))).map(
          (category) => (
            { name: category, itemStyle: { color: colorByCategory(category, lang) } })
        );

        return createGraphChartConfig(categories, nodes, edges, legendSelection, false);
      }),

      departments: computed(() => {
        const lang =  langStore.lang();
        const isLoggedIn = appStore.isLoggedIn();

        let data: ModuleResponse[] =  isLoggedIn ? store.availableUserModules() : appStore.modules();

        data = filterModulesBySimilarityResults(data, store.similaritySearchResults?.());

        const departments = data
          .map((m) => m.department?.[lang])
          .filter((d): d is string => !!d && d.trim().length > 0);
        return Array.from(new Set(departments)).sort();
      }),

      programs: computed(() => {
        const lang =  langStore.lang();
        const currentDepartment = store.selectedDepartment();
        const isLoggedIn = appStore.isLoggedIn();

        let data: ModuleResponse[] =  isLoggedIn ? store.availableUserModules() : appStore.modules();

        data = filterModulesBySimilarityResults(data, store.similaritySearchResults?.());

        const programs = data
          .filter((mr) => !currentDepartment || mr.department?.[lang] === currentDepartment)
          .map((mr) => mr.program?.[lang])
          .filter((p): p is string => !!p && p.trim().length > 0);
        return Array.from(new Set(programs)).sort();
      }),

      moduleTypes: computed(() => {
        const lang =  langStore.lang();
        const currentDepartment = store.selectedDepartment();
        const currentProgram = store.selectedProgram();
        const isLoggedIn = appStore.isLoggedIn();

        let data: ModuleResponse[] =  isLoggedIn ? store.availableUserModules() : appStore.modules();

        data = filterModulesBySimilarityResults(data, store.similaritySearchResults?.());

        const moduleTypes = data
          .filter((mr) => !currentDepartment || mr.department?.[lang] === currentDepartment)
          .filter((mr) => !currentProgram || mr.program?.[lang] === currentProgram)
          .map((mr) => mr.moduleType?.[lang] ?? '')
          .filter((mt) => mt.trim().length > 0);

        return Array.from(new Set(moduleTypes)).sort();
      })
    };
  }),

  withMethods((store) => ({

    setLoading(loading: boolean) {
      patchState(store, { loading });
    },

    setSelectedDepartment(department?: string) {
      patchState(store, { selectedDepartment: department });
    },
    setSelectedProgram(program?: string) {
      patchState(store, { selectedProgram: program });
    },
    setSelectedModule(module?: ModuleResponse) {
      patchState(store, { selectedModule: module });
    },
    setSelectedModuleType(moduleType?: string) {
      patchState(store, { selectedModuleType: moduleType });
    },
    setIsDepartmentSelectorChanged(changed: boolean) {
      patchState(store, { isDepartmentSelectorChanged: changed });
    },
    setIsProgramSelectorChanged(changed: boolean) {
      patchState(store, { isProgramSelectorChanged: changed });
    },
    setIsModuleSelectorChanged(changed: boolean) {
      patchState(store, { isModuleSelectorChanged: changed });
    },
    setIsModuleTypeSelectorChanged(changed: boolean) {
      patchState(store, { isModuleTypeSelectorChanged: changed });
    },
    setLegendSelection(changed: Record<string, boolean>) {
      patchState(store, { legendSelection: changed });
    },

    setSimilaritySearchResults(results: SimilaritySearchResponse[]) {
      patchState(store, { similaritySearchResults : results });
    }
  })),

);




