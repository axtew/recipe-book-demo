import {
  createLink,
  type LinkComponentProps,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router";
import type { MouseEvent } from "react";

import { SBackAnchor } from "./_styles";

const SRouterBackLink = createLink(SBackAnchor);

/**
 * Ссылка «назад» с тап-целью 44px.
 *
 * Если в истории приложения есть куда вернуться, делает шаг назад: так на экран
 * возвращаются адрес, поиск и фильтры, с которых пришли. Иначе — обычный переход
 * на адрес из пропов (прямая ссылка, перезапуск PWA). Адрес-запасной остаётся и в
 * `href`, поэтому «открыть в новой вкладке» и клик с модификатором работают как у
 * любой ссылки.
 *
 * Собрана через `createLink` и приведена к его типу: иначе дженерики роутера
 * стираются, и `to`/`params` перестают проверяться типами.
 */
export const BackLink = function BackLink(props: LinkComponentProps<"a">) {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    props.onClick?.(event);

    const isPlainClick =
      event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

    if (!canGoBack || !isPlainClick || event.defaultPrevented) return;

    event.preventDefault();
    router.history.back();
  }

  return <SRouterBackLink {...props} onClick={handleClick} />;
} as typeof SRouterBackLink;
