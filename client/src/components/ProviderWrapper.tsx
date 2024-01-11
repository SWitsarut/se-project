import { theme } from "@/theme";
import { MantineProvider } from "@mantine/core";

interface ProviderWrapperProps {
  children: React.ReactNode
}

export default function ProviderWrapper({ children }: ProviderWrapperProps) {
  return (
    <MantineProvider theme={theme}>
      {children}
    </MantineProvider>
  )
}