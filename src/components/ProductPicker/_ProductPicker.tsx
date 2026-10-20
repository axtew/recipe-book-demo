import { Combobox, InputBase, useCombobox } from "@mantine/core";
import { useState } from "react";

import { useI18nSelector } from "@/context/I18nContext";
import { useProducts } from "@/hooks/useAppData.hook";
import { filterProducts } from "@/utils/helpers/products";
import { normalizeSearch } from "@/utils/search";

import { ProductFormSheet } from "../ProductFormSheet";
import { buildCreateOptionLabel } from "./_helpers";
import { SWrapper } from "./_styles";

const CREATE_OPTION_VALUE = "__create__";

interface IProps {
  value: string | null;
  onChange: (productId: string) => void;
}

/**
 * Поиск продукта поверх датасета, уже загруженного в кэш, с инлайн-созданием.
 *
 * Фильтрация идёт по списку продуктов в памяти — сеть не участвует. Если среди
 * неархивных продуктов совпадений нет, в выпадающем списке вместо пустоты
 * появляется пункт «Создать «{запрос}»», открывающий `ProductFormSheet` поверх
 * текущего экрана.
 */
export function ProductPicker({ value, onChange }: IProps) {
  const l = useI18nSelector(({ l }) => l.products.picker);
  const products = useProducts();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState(
    () => products.find((product) => product.id === value)?.name ?? "",
  );
  const [isCreateOpened, setCreateOpened] = useState(false);

  // Синхронизация текста поиска с внешним `value` — сравнение во время
  // рендера, а не в эффекте: React рекомендует именно так подстраивать
  // состояние под смену пропа, а не откатывать его после коммита.
  const [wasValue, setWasValue] = useState(value);
  if (value !== wasValue) {
    setWasValue(value);

    if (value === null) {
      setSearch("");
    } else {
      const product = products.find((item) => item.id === value);
      // Продукта может ещё не быть в кэше (только что создан, инвалидация в
      // процессе) — тогда текст уже выставлен вызывающим кодом, трогать не надо.
      if (product !== undefined) setSearch(product.name);
    }
  }

  const normalizedQuery = normalizeSearch(search);
  const filtered = filterProducts(products, search);

  function handleOptionSubmit(optionValue: string): void {
    if (optionValue === CREATE_OPTION_VALUE) {
      setCreateOpened(true);
      combobox.closeDropdown();
      return;
    }

    const product = products.find((item) => item.id === optionValue);
    if (product === undefined) return;

    setWasValue(product.id);
    onChange(product.id);
    setSearch(product.name);
    combobox.closeDropdown();
  }

  function handleCreated(product: { id: string; name: string }): void {
    setCreateOpened(false);
    setWasValue(product.id);
    onChange(product.id);
    setSearch(product.name);
  }

  return (
    <SWrapper>
      <Combobox store={combobox} onOptionSubmit={handleOptionSubmit}>
        <Combobox.Target>
          <InputBase
            value={search}
            size="md"
            placeholder={l.placeholder}
            aria-label={l.placeholder}
            rightSection={<Combobox.Chevron />}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
              combobox.openDropdown();
              combobox.updateSelectedOptionIndex();
            }}
            onClick={() => combobox.openDropdown()}
            onFocus={() => combobox.openDropdown()}
            onBlur={() => combobox.closeDropdown()}
          />
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options mah={240} style={{ overflowY: "auto" }}>
            {filtered.map((product) => (
              <Combobox.Option value={product.id} key={product.id}>
                {product.name}
              </Combobox.Option>
            ))}
            {filtered.length === 0 && normalizedQuery !== "" && (
              <Combobox.Option value={CREATE_OPTION_VALUE}>
                {buildCreateOptionLabel(l.createOption, search)}
              </Combobox.Option>
            )}
            {filtered.length === 0 && normalizedQuery === "" && (
              <Combobox.Empty>{l.nothingFound}</Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>

      <ProductFormSheet
        isOpened={isCreateOpened}
        initialName={search}
        onClose={() => setCreateOpened(false)}
        onCreated={handleCreated}
      />
    </SWrapper>
  );
}
