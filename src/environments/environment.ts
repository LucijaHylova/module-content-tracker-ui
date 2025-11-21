export const environment = {
  name: 'production',
  production: true,
  apiUrl: 'http://localhost:4200/api',
  baseUrl: 'http://localhost:4200',
  endpoints: {
    modules: {
      getAll: '/modules/all'
    },
    contentProfiles: {
      getModuleCompetenciesProfiles: '/content/getModuleCompetenceProfiles',
      getProgramContentCompetenciesProfiles: '/content/getProgramCompetenceProfiles',
      getDepartmentContentCompetenciesProfiles: '/content/getDepartmentCompetenceProfiles',
      getModuleContentProfiles: '/content/getModuleContentProfiles',
    }
  },
  testMode: true,

};
