import Burst from "@/components/Burst";
import CrintroLoader from "@/components/CrintroLoader";
import { Journal, Plants, Products, Pure, Ritual, Ticker } from "@/components/Sections";

export default function Home() {
  return (
    <main>
      <CrintroLoader />
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
