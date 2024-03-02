import { Loader } from "@mantine/core";

export default function Loading() {
  return (
    <div className="flex justify-center py-16">
      <Loader size={64}/>
    </div>
  )
}
