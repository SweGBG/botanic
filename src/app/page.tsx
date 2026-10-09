import Burst from "@/components/Burst";
import { Journal, Plants, Products, Pure, Ritual, Ticker } from "@/components/Sections";

export default function Home() {
  return (
    <main>
      <Burst />
      <Ticker />
      <Plants />
      <Products />
      <Ritual />
      <Pure />
      <Journal />
    </main>
  );
}
