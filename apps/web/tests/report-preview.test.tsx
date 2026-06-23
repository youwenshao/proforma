import { render, screen } from "@testing-library/react";
import { ReportPreview } from "@/components/marketing/report-preview";

describe("marketing report preview", () => {
  it("presents a generated report document mockup with pricing evidence", () => {
    render(<ReportPreview />);

    expect(screen.getByText(/Generated report preview/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Quote substantiation pack/i })).toBeInTheDocument();
    expect(screen.getByText(/Recommended fee/i)).toBeInTheDocument();
    expect(screen.getByText(/HK\$620k/i)).toBeInTheDocument();
    expect(screen.getAllByText(/82 comparable matters/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Partner review required before client sharing/i)).toBeInTheDocument();
  });
});
