import type { Dispatch, SetStateAction } from "react";

/** Type of the React.SetState setter. */
export type TSetState<T> = Dispatch<SetStateAction<T>>;
