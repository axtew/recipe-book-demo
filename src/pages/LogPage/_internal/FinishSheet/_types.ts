export interface IFinishSheetProps {
  isOpened: boolean;
  logId: string;
  /** Дата готовки: раньше неё «доели» быть не может. */
  cookedAt: string;
  onClose: () => void;
}

export interface IUseFinishFormProps {
  isOpened: boolean;
  logId: string;
  onSaved: () => void;
}

export type TFinishFields = { finishedAt: string };
