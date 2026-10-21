import type { TCookTimeFilter } from "@/types/recipes.types";

export interface I18n {
  auth: {
    login: {
      title: string;
      emailLabel: string;
      passwordLabel: string;
      submitButton: string;
      error: string;
      demoHint: string;
    };
  };
  demo: {
    banner: string;
  };
  navigation: {
    recipes: string;
    products: string;
    log: string;
    settings: string;
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
  recipeEditor: {
    backLink: string;
    titleNew: string;
    titleEdit: string;
    notFoundTitle: string;
    notFoundHint: string;
    draftPrompt: {
      title: string;
      hint: string;
      restore: string;
      discard: string;
    };
    form: {
      nameLabel: string;
      cookTimeLabel: string;
      servingsLabel: string;
      yieldLabel: string;
      yieldHint: string;
      notesLabel: string;
      saveButton: string;
      saving: string;
      submitError: string;
    };
    validation: {
      name: string;
      servingsBase: string;
      yieldGrams: string;
      cookTimeMin: string;
      freezerDays: string;
      fridgeDays: string;
      videoUrls: string;
      steps: string;
      ingredients: string;
      generic: string;
    };
    dishCategories: {
      label: string;
    };
    photo: {
      title: string;
      empty: string;
      alt: string;
      choose: string;
      replace: string;
      remove: string;
      processing: string;
      error: string;
    };
    ingredients: {
      title: string;
      add: string;
      moveHandle: string;
    };
    ingredient: {
      menuLabel: string;
      gramsLabel: string;
      gramsPlaceholder: string;
      gramsUnit: string;
      optionalBadge: string;
      pinnedBadge: string;
      unnamedVariant: string;
      sheet: {
        title: string;
        optionalLabel: string;
        pinnedLabel: string;
        pinnedAuto: string;
        unnamedVariant: string;
        addVariant: string;
        noteLabel: string;
        notePlaceholder: string;
        remove: string;
        done: string;
      };
    };
    steps: {
      title: string;
      add: string;
      moveHandle: string;
      placeholder: string;
      stepLabel: string;
      remove: string;
    };
    storage: {
      title: string;
      freezableLabel: string;
      freezerDaysLabel: string;
      fridgeDaysLabel: string;
    };
    video: {
      title: string;
      placeholder: string;
      add: string;
      remove: string;
    };
    nutritionBar: {
      empty: string;
      per100g: string;
      perServing: string;
      servingsMissing: string;
      incompleteProducts: string;
    };
  };
  recipeList: {
    searchPlaceholder: string;
    filtersButton: string;
    total: string;
    found: string;
    uncategorized: string;
    emptyTitle: string;
    emptyHint: string;
    nothingFoundTitle: string;
    nothingFoundHint: string;
    resetButton: string;
    addButton: string;
    expandGroup: string;
    collapseGroup: string;
    card: {
      minutesUnit: string;
      per100g: string;
      freezable: string;
    };
    filters: {
      title: string;
      freezableLabel: string;
      timeTitle: string;
      timeAny: string;
      time: Record<TCookTimeFilter, string>;
      resetButton: string;
      doneButton: string;
    };
  };
  recipeCard: {
    backLink: string;
    notFoundTitle: string;
    notFoundHint: string;
    archivedBadge: string;
    editButton: string;
    recordCookButton: string;
    photoAlt: string;
    minutesUnit: string;
    servingsLabel: string;
    nutrition: {
      title: string;
      per100g: string;
      perServing: string;
      total: string;
      rawWeightHint: string;
      emptyHint: string;
      overrideMark: string;
      overrideNote: string;
      recalculate: string;
      recalculating: string;
    };
    incomplete: {
      title: string;
      hint: string;
    };
    storage: {
      title: string;
      freezable: string;
      freezer: string;
      fridge: string;
      daysUnit: string;
    };
    ingredients: {
      title: string;
      empty: string;
      gramsUnit: string;
      optionalBadge: string;
      pinnedLabel: string;
      unnamedVariant: string;
    };
    steps: {
      title: string;
      empty: string;
    };
    video: {
      title: string;
      linkLabel: string;
    };
    notes: {
      title: string;
    };
    stats: {
      title: string;
      never: string;
      count: string;
      lastCooked: string;
      averageYield: string;
      averageDays: string;
      gramsUnit: string;
      daysUnit: string;
      empty: string;
    };
  };
  cookLogSheet: {
    title: string;
    dateLabel: string;
    multiplierLabel: string;
    multiplierCustomLabel: string;
    yieldLabel: string;
    containersLabel: string;
    ratingLabel: string;
    ratingClear: string;
    noteLabel: string;
    gramsUnit: string;
    submitButton: string;
    cancelButton: string;
    validationError: string;
    submitError: string;
  };
  cookLog: {
    emptyTitle: string;
    emptyHint: string;
    /** Двенадцать названий месяцев в именительном падеже, с января. */
    months: [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ];
    unknownRecipe: string;
    gramsUnit: string;
    multiplierLabel: string;
    yieldLabel: string;
    containersLabel: string;
    per100g: string;
    finishedLabel: string;
    finishButton: string;
    otherDateButton: string;
    finishSheet: {
      title: string;
      submitButton: string;
      cancelButton: string;
    };
  };
  settings: {
    exportBlock: {
      title: string;
      description: string;
      button: string;
      /** Шаблон с `{fileName}`. */
      success: string;
      error: string;
    };
    importBlock: {
      title: string;
      description: string;
      button: string;
      /** Шаблон с `{products}`, `{recipes}`, `{cookLogs}`. */
      success: string;
      notEmpty: string;
      notJson: string;
      notBackup: string;
      /** Шаблон с `{version}`. */
      unsupportedVersion: string;
      /** Шаблон с `{path}`. */
      invalid: string;
      readFailed: string;
      importFailed: string;
    };
    categories: {
      title: string;
      productsTitle: string;
      dishesTitle: string;
      emptyHint: string;
      nameLabel: string;
      moveUp: string;
      moveDown: string;
    };
    account: {
      logoutButton: string;
      logoutError: string;
    };
  };
}
