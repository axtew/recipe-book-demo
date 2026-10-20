import { SButton } from "./_styles";

interface IProps {
  label: string;
  onClick: () => void;
}

/** Иконка-крестик в тап-цели 44px: убрать строку списка. */
export function RemoveButton({ label, onClick }: IProps) {
  return (
    <SButton type="button" aria-label={label} onClick={onClick}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M3 3l10 10M13 3L3 13" />
      </svg>
    </SButton>
  );
}
