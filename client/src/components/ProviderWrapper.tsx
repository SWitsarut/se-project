import { EdgeStoreProvider } from "@/libs/edgestore";
import { theme } from "@/theme";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import SocketProvider from "./SocketProvider";

export default function ProviderWrapper({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <EdgeStoreProvider>
      <MantineProvider theme={theme}>
        <SocketProvider>
          <Notifications />
          {children}
        </SocketProvider>
      </MantineProvider>
    </EdgeStoreProvider>
  );
}
