export interface IFinishSheetProps {
  isOpened: boolean;
  logId: string;
  /** Cooking date: “finished” cannot be earlier than it. */
  cookedAt: string;
  onClose: () => void;
}

export interface IUseFinishFormProps {
  isOpened: boolean;
  logId: string;
  onSaved: () => void;
}

export type TFinishFields = { finishedAt: string };
