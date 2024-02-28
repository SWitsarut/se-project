import { EdgeStoreProvider } from "@/libs/edgestore";
import { theme } from "@/theme";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

<<<<<<< HEAD
interface ProviderWrapperProps {
  children: React.ReactNode
}

export default function ProviderWrapper({ children }: ProviderWrapperProps) {
  return (
    <MantineProvider theme={theme}>
      <EdgeStoreProvider>
        {children}
      </EdgeStoreProvider>
    </MantineProvider>
<<<<<<< HEAD
=======
export default function ProviderWrapper({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <EdgeStoreProvider>
      <MantineProvider theme={theme}>
        <Notifications />
        {children}
      </MantineProvider>
    </EdgeStoreProvider>
>>>>>>> a1ae53e4e86f8233eebe62c0510a0b1e33e2aba8
  );
}
=======
  )
}
>>>>>>> parent of da93acb (don chat feature)
