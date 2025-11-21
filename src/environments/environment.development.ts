export const environment = {
  name: 'development',
  production: false,
  apiUrl: 'http://localhost:4200/api',
  baseUrl: 'http://localhost:4200',
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
