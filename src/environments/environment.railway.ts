export const environment = {
  name: 'railway',
  apiUrl: 'module-content-tracker-ui-production.up.railway.app/api',
  baseUrl: 'module-content-tracker-ui-production.up.railway.app',
  production: false,
  endpoints: {
    contentProfiles: {
      getModuleCompetenciesProfiles: '/content/getModuleCompetenceProfiles',
      getProgramContentCompetenciesProfiles: '/content/getProgramCompetenceProfiles',
      getDepartmentContentCompetenciesProfiles: '/content/getDepartmentCompetenceProfiles',
      getModuleContentProfiles: '/content/getModuleContentProfiles',
    }
  },
  testMode: false
};
