import { render, screen } from "@testing-library/react";
import {
  HOME_AURORA_BACKGROUNDS,
  RandomAuroraBackground,
} from "@/components/marketing/random-aurora-background";

describe("random aurora background", () => {
  it("selects one static home aurora image on render", () => {
    render(<RandomAuroraBackground />);

    const background = screen.getByTestId("random-aurora-background");
    const selectedUrl = background.style
      .getPropertyValue("--aurora-image")
      .replace(/^url\(["']?/, "")
      .replace(/["']?\)$/, "");

    expect(HOME_AURORA_BACKGROUNDS).toEqual([
      "/auroras/background-1.jpg",
      "/auroras/background-2.jpg",
      "/auroras/background-3.jpg",
    ]);
    expect(HOME_AURORA_BACKGROUNDS).toContain(selectedUrl);
  });
});
