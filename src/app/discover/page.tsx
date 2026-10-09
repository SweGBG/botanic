import type { Metadata } from "next";
import Discover from "@/components/Discover";

export const metadata: Metadata = {
  title: "Upptäck ritualen — Botanicatural",
  description: "Den naturliga vägen till hud som minns hur det känns att få näring.",
};

export default function DiscoverPage() {
  return <Discover />;
}
