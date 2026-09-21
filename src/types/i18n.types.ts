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
  nutrients: {
    kcal: string;
    protein: string;
    fat: string;
    carbs: string;
    empty: string;
    incomplete: string;
  };
  products: {
    list: {
      title: string;
      searchPlaceholder: string;
      emptyTitle: string;
      emptyHint: string;
      nothingFound: string;
      variantsLabel: string;
    };
    card: {
      backLink: string;
      notFoundTitle: string;
      notFoundHint: string;
      archivedBadge: string;
      variantsTitle: string;
      unnamedVariant: string;
      activeLabel: string;
      approximateLabel: string;
      makeActive: string;
      usedInTitle: string;
      usedInEmpty: string;
      archiveButton: string;
    };
    archiveConfirm: {
      title: string;
      description: string;
      usedInWarning: string;
      confirmButton: string;
      cancelButton: string;
    };
    picker: {
      placeholder: string;
      nothingFound: string;
      createOption: string;
    };
    createSheet: {
      title: string;
      nameLabel: string;
      categoryLabel: string;
      categoryPlaceholder: string;
      submitButton: string;
      cancelButton: string;
      validationError: string;
      submitError: string;
    };
    addVariantSheet: {
      title: string;
      nameLabel: string;
      namePlaceholder: string;
      submitButton: string;
      cancelButton: string;
      validationError: string;
      submitError: string;
    };
  };
}
