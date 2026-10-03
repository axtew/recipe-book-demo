import type { Dispatch, SetStateAction } from "react";

/** Тип сеттера React.SetState. */
export type TSetState<T> = Dispatch<SetStateAction<T>>;
