export interface I18n {
  auth: {
    login: {
      title: string;
      emailLabel: string;
      passwordLabel: string;
      submitButton: string;
      error: string;
    };
  };
  navigation: {
    recipes: string;
    products: string;
    log: string;
    settings: string;
  };
  routeStub: {
    placeholder: string;
  };
  mutation: {
    error: string;
  };
  appData: {
    errorTitle: string;
    errorHint: string;
    retryButton: string;
  };
}
