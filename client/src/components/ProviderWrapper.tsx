import { EdgeStoreProvider } from "@/libs/edgestore";
import { theme } from "@/theme";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import ChatProvider from "./ChatProvider";

interface ProviderWrapperProps {
  children: React.ReactNode;
}

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
