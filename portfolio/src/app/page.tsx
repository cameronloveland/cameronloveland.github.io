import ParallaxSpace from "@/components/ParallaxSpace";
import SnapScroller from "@/components/SnapScroller";

export default function Page() {
  return (
    <>
      {/* fixed background layers */}
      <ParallaxSpace />
      {/* foreground UI */}
      <SnapScroller />
    </>
  );
}
