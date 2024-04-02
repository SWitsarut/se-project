import { Loader } from "@mantine/core";

export default function loading() {
  return (
    <div className="flex w-full h-full justify-center">
      <Loader size="xl" />
    </div>
  )
}
