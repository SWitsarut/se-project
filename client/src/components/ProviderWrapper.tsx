import { EdgeStoreProvider } from "@/libs/edgestore";
import { theme } from "@/theme";
import { MantineProvider } from "@mantine/core";

interface ProviderWrapperProps {
  children: React.ReactNode;
}

export default function ProviderWrapper({ children }: ProviderWrapperProps) {
  return (
    <MantineProvider theme={theme}>
      <EdgeStoreProvider>
        <ChatProvider>{children}</ChatProvider>
      </EdgeStoreProvider>
    </MantineProvider>
  );
}
