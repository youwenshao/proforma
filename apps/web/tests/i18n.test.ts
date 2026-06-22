import { existsSync } from "node:fs";
import { join } from "node:path";

const i18nRoot = join(process.cwd(), "lib/i18n");

function expectI18nFilesToExist() {
  expect(existsSync(join(i18nRoot, "en.ts"))).toBe(true);
  expect(existsSync(join(i18nRoot, "zh-Hant.ts"))).toBe(true);
  expect(existsSync(join(i18nRoot, "translator.ts"))).toBe(true);
}

async function loadI18nModules() {
  const enPath = "../lib/i18n/en";
  const zhHantPath = "../lib/i18n/zh-Hant";
  const translatorPath = "../lib/i18n/translator";
  const [en, zhHant, translator] = await Promise.all([
    import(/* @vite-ignore */ enPath),
    import(/* @vite-ignore */ zhHantPath),
    import(/* @vite-ignore */ translatorPath),
  ]);

  return { en, zhHant, translator };
}

describe("bilingual translation catalog", () => {
  it("includes matching English and Traditional Chinese keys", async () => {
    expectI18nFilesToExist();

    const { en, zhHant } = await loadI18nModules();

    expect(Object.keys(zhHant.zhHantMessages).sort()).toEqual(
      Object.keys(en.enMessages).sort(),
    );
  });

  it("keeps legal and synthetic-data disclaimers in both locales", async () => {
    expectI18nFilesToExist();

    const { en, zhHant } = await loadI18nModules();

    for (const messages of [en.enMessages, zhHant.zhHantMessages]) {
      expect(messages["notice.decisionSupport"]).toBeTruthy();
      expect(messages["notice.syntheticData"]).toBeTruthy();
    }
  });

  it("marks Traditional Chinese strings as draft pending legal proofreading", async () => {
    expectI18nFilesToExist();

    const { zhHant } = await loadI18nModules();

    expect(zhHant.zhHantMetadata).toMatchObject({
      status: "draft",
      requiresLegalProofreading: true,
    });
  });

  it("throws instead of silently falling back for missing production keys", async () => {
    expectI18nFilesToExist();

    const { translator } = await loadI18nModules();

    expect(() =>
      translator.translate("en", "missing.key", { allowFallback: false }),
    ).toThrow(/Missing translation/);
  });
});
