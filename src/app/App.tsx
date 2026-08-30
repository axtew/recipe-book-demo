import { Center, Title } from "@mantine/core";

import { useI18nSelector } from "@/context/I18nContext";

/** Временная точка входа: роутинг, авторизация и экраны появляются в следующей фазе. */
export function App() {
  const l = useI18nSelector(({ l }) => l.app);

  return (
    <Center h="100dvh">
      <Title order={1}>{l.title}</Title>
    </Center>
  );
}
