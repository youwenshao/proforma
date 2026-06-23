import { render, screen } from "@testing-library/react";
import { EstimateProcessingOverlay } from "@/components/estimate/estimate-processing-overlay";
import { renderWithLocale } from "./render-with-locale";

describe("estimate processing overlay", () => {
  it("shows a loading spinner and processing status", () => {
    renderWithLocale(<EstimateProcessingOverlay />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/generating your estimate/i)).toBeInTheDocument();
    expect(screen.getByText(/analyzing matter facts/i)).toBeInTheDocument();
  });

  it("shows Traditional Chinese processing status", () => {
    renderWithLocale(<EstimateProcessingOverlay />, "zh-Hant");

    expect(screen.getByText(/正在產生估算/i)).toBeInTheDocument();
    expect(screen.getByText(/分析事項資料/i)).toBeInTheDocument();
  });
});
