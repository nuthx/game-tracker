import { PlayerCard } from "@/components/homecard/player"
import { Heatmap } from "@/components/homecard/heatmap"
import { RecentCard } from "@/components/homecard/recent"

export default function Page() {
  return (
    <div className="max-w-screen-lg mx-auto flex flex-col gap-4">
      <PlayerCard />
      <Heatmap />
      <RecentCard />
    </div>
  )
}
