import { render, screen } from "@testing-library/react";
import { EstimateProcessingOverlay } from "@/components/estimate/estimate-processing-overlay";

describe("estimate processing overlay", () => {
  it("shows a loading spinner and processing status", () => {
    render(<EstimateProcessingOverlay />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/generating your estimate/i)).toBeInTheDocument();
    expect(screen.getByText(/analyzing matter facts/i)).toBeInTheDocument();
  });
});
