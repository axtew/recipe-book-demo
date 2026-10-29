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
 * “Back” link with a 44px tap target.
 *
 * If the app history has somewhere to go back to, steps back: this way the screen gets its address,
 * search and filters back from where the user came. Otherwise a plain navigation to the address
 * from the props (direct link, PWA restart). The fallback address stays in `href` too, so “open in
 * a new tab” and a click with a modifier work like on any link.
 *
 * Built with `createLink` and cast to its type: otherwise the router generics are erased and
 * `to`/`params` stop being type-checked.
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
