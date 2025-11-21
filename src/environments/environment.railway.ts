export const environment = {
  name: 'railway',
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
