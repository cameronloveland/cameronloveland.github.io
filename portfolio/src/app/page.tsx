import ParallaxSpace from "@/components/ParallaxSpace";
import SnapScroller from "@/components/SnapScroller";
import HomeLanding from "@/components/HomeLanding";

export default function Page() {
  return (
    <>
      {/* fixed background layers */}
      <ParallaxSpace />
      {/* foreground UI */}
      <SnapScroller>
        <HomeLanding />
        <div>{/* second page content */}</div>
        <div>{/* third page content */}</div>
      </SnapScroller>
    </>
  );
}
