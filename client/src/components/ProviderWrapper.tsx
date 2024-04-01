import { EdgeStoreProvider } from "@/libs/edgestore";
import { theme } from "@/theme";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { CartProvider } from "./CartProvider";
import ChatProvider from "./ChatProvider";

export default function ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EdgeStoreProvider>
      <MantineProvider theme={theme}>
        <Notifications />
        <ChatProvider>{children}</ChatProvider>
      </MantineProvider>
    </EdgeStoreProvider>
  );
}
