import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const appRoot = process.cwd();

describe("ProForma design system", () => {
  it("has a shadcn/ui component baseline", () => {
    expect(existsSync(join(appRoot, "components.json"))).toBe(true);

    for (const component of ["button", "card", "table", "alert", "tabs"]) {
      expect(
        existsSync(join(appRoot, "components/ui", `${component}.tsx`)),
      ).toBe(true);
    }
  });

  it("does not use the generated placeholder dashboard copy", () => {
    const page = readFileSync(join(appRoot, "app/page.tsx"), "utf8");

    expect(page).not.toMatch(/To get started|Deploy Now|Next\.js logo/);
  });
});
