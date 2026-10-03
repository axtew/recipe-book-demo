import styled from "styled-components";

/**
 * Нативный выпадающий список со стилями проекта.
 *
 * На iPhone нативный `<select>` открывает системное колесо-пикер — крупное,
 * с жестами и озвучкой, лучше кастомного дропдауна для короткого статичного
 * списка и не стоит ни байта JS. `Combobox` из Mantine остаётся там, где
 * нужен поиск по большому набору значений.
 */
export const SSelect = styled.select`
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  /* Тот же технический порог, что у текстовых полей ввода: ниже него Safari
     на iOS зумит страницу при фокусе. Не токен типографики. */
  font-size: 16px;
  color: ${({ theme }) => theme.palette.text};
  background: ${({ theme }) => theme.palette.surface};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.palette.primary};
    outline-offset: 1px;
  }
`;
