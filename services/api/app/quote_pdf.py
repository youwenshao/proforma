from __future__ import annotations

from dataclasses import dataclass
from textwrap import wrap

from proforma_data.schemas import QuoteSubstantiationResponse

PAGE_WIDTH = 612
PAGE_HEIGHT = 792
MARGIN_X = 54
TOP_Y = 738
BOTTOM_Y = 54
CONTENT_WIDTH = PAGE_WIDTH - (MARGIN_X * 2)


def render_quote_pack_pdf(snapshot: QuoteSubstantiationResponse) -> bytes:
    report = _PdfReport()
    report.title("Quote Substantiation Pack", f"Estimate ID: {snapshot.estimate_id}")

    report.section("Benchmark Snapshot")
    report.subheading("Benchmark segment")
    report.bullets(_benchmark_segment_items(snapshot), bullet="-")
    report.key_value_grid(
        [
            ("Comparable matters", f"{snapshot.benchmark_segment.sample_size:,}"),
            ("Fallback level", _format_fallback_level(snapshot.benchmark_segment.fallback_level)),
            ("Pack status", snapshot.status.title()),
        ]
    )

    risk_metric_labels = {
        "Material scope-creep rate",
        "Any-overrun rate",
        "P75 quote variance",
        "P90 quote variance",
    }
    risk_metrics = [metric for metric in snapshot.metrics if metric.label in risk_metric_labels]
    benchmark_metrics = [metric for metric in snapshot.metrics if metric.label not in risk_metric_labels]

    if risk_metrics:
        report.section("Risk Indicators")
        report.metric_grid([(metric.label, metric.display_value, metric.description) for metric in risk_metrics])

    if benchmark_metrics:
        report.page_break()
        report.section("Comparable Matter Benchmarks")
        report.metric_grid(
            [(metric.label, metric.display_value, metric.description) for metric in benchmark_metrics],
            columns=2,
        )

    if snapshot.chart_specs:
        report.section("Historical Evidence")
        for chart in snapshot.chart_specs:
            report.subheading(chart.title)
            report.paragraph(chart.description)
            report.table(_chart_rows(chart.data), max_rows=8)

    if snapshot.assumptions_and_guardrails:
        report.section("Assumptions and Guardrails")
        report.bullets(snapshot.assumptions_and_guardrails)

    if snapshot.limitations:
        report.section("Limitations")
        report.bullets(snapshot.limitations)

    report.section("Evidence Footer")
    report.bullets(
        [
            *snapshot.evidence_footer,
            f"Snapshot checksum: {snapshot.snapshot_checksum or 'pending'}",
        ],
        bullet="",
    )
    report.footer(f"Generated for estimate {snapshot.estimate_id}")
    return report.render()


def _benchmark_segment_items(snapshot: QuoteSubstantiationResponse) -> list[str]:
    parts = [part.strip() for part in snapshot.benchmark_segment.segment_label.split(" / ") if part.strip()]
    if not parts:
        return ["Segment: All comparable matters"]

    labels = [_humanize_dimension(dimension) for dimension in snapshot.benchmark_segment.dimensions]
    if not labels:
        return [f"Segment: {snapshot.benchmark_segment.segment_label}"]

    return [
        f"{label}: {parts[index] if index < len(parts) else 'Not specified'}"
        for index, label in enumerate(labels)
    ]


def _humanize_dimension(value: str) -> str:
    return value.replace("_", " ").title()


def _format_fallback_level(value: str) -> str:
    if value == "global":
        return "Global"
    return " + ".join(_humanize_dimension(part) for part in value.split("+"))


def _chart_rows(data: list[dict[str, str | int | float | bool | None]]) -> list[tuple[str, str]]:
    rows: list[tuple[str, str]] = []
    for point in data:
        if "bucket" in point and "share_pct" in point:
            rows.append((str(point["bucket"]), f"{float(point['share_pct'] or 0):.1f}% of comparable matters"))
        elif "stage_name" in point and "avg_share_pct" in point:
            rows.append((str(point["stage_name"]), f"{float(point['avg_share_pct'] or 0):.1f}% average cost share"))
        else:
            label, value = next(iter(point.items()))
            rows.append((label.replace("_", " ").title(), str(value)))
    return rows


@dataclass
class _PdfPage:
    commands: list[str]


class _PdfReport:
    def __init__(self) -> None:
        self.pages: list[_PdfPage] = []
        self.y = TOP_Y
        self._new_page()

    def title(self, title: str, subtitle: str) -> None:
        self._text(title, MARGIN_X, self.y, font="F2", size=20)
        self.y -= 24
        self._text(subtitle, MARGIN_X, self.y, size=10, gray=0.35)
        self.y -= 12
        self._rule()
        self.y -= 18

    def section(self, title: str) -> None:
        self._ensure_space(46)
        self.y -= 8
        self._text(title, MARGIN_X, self.y, font="F2", size=13)
        self.y -= 12
        self._rule(gray=0.75)
        self.y -= 14

    def subheading(self, title: str) -> None:
        self._ensure_space(36)
        self._text(title, MARGIN_X, self.y, font="F2", size=11)
        self.y -= 15

    def page_break(self) -> None:
        self._new_page()

    def paragraph(self, text: str) -> None:
        for line in self._wrapped(text, 96):
            self._ensure_space(14)
            self._text(line, MARGIN_X, self.y, size=9, gray=0.35)
            self.y -= 12
        self.y -= 4

    def key_value_grid(self, items: list[tuple[str, str]]) -> None:
        column_gap = 12
        columns = 2
        card_width = (CONTENT_WIDTH - (column_gap * (columns - 1))) / columns

        for row_start in range(0, len(items), columns):
            row_items = items[row_start : row_start + columns]
            row_height = max(self._snapshot_card_height(label, value, card_width) for label, value in row_items)
            self._ensure_space(row_height + 10)

            for col_index, (label, value) in enumerate(row_items):
                x = MARGIN_X + col_index * (card_width + column_gap)
                y_top = self.y
                self._rect(x, y_top - row_height, card_width, row_height, fill_gray=0.97, stroke_gray=0.78)
                self._text(label, x + 10, y_top - 18, size=8, gray=0.38)
                self._draw_snapshot_value(label, value, x + 10, y_top - 36, card_width - 20)

            self.y -= row_height + 10

    def _snapshot_card_height(self, label: str, value: str, card_width: float) -> float:
        if label != "Fallback level":
            return 70
        inner_width = int((card_width - 20) / (10 * 0.52))
        value_lines = self._wrapped(value, inner_width)
        return max(70, 36 + min(len(value_lines), 3) * 14)

    def _draw_snapshot_value(self, label: str, value: str, x: float, y: float, inner_width: float) -> None:
        if label == "Fallback level":
            wrap_width = int(inner_width / (10 * 0.52))
            for line_index, line in enumerate(self._wrapped(value, wrap_width)[:3]):
                self._text(line, x, y - (line_index * 14), font="F2", size=10)
            return
        self._text(value, x, y, font="F2", size=14)

    def metric_grid(self, items: list[tuple[str, str, str]], *, columns: int = 2) -> None:
        column_gap = 12
        card_width = (CONTENT_WIDTH - (column_gap * (columns - 1))) / columns
        card_height = 70
        for index, (label, value, description) in enumerate(items):
            if index % columns == 0:
                self._ensure_space(card_height + 10)
            x = MARGIN_X + (index % columns) * (card_width + column_gap)
            y_top = self.y
            self._rect(x, y_top - card_height, card_width, card_height, fill_gray=0.97, stroke_gray=0.78)
            self._text(label, x + 10, y_top - 18, size=8, gray=0.38)
            self._text(value, x + 10, y_top - 36, font="F2", size=14)
            if description:
                for offset, line in enumerate(self._wrapped(description, 36)[:2]):
                    self._text(line, x + 10, y_top - 51 - (offset * 10), size=7, gray=0.42)
            if index % columns == columns - 1 or index == len(items) - 1:
                self.y -= card_height + 10

    def table(self, rows: list[tuple[str, str]], *, max_rows: int) -> None:
        if not rows:
            self.paragraph("No distribution data was available for this benchmark segment.")
            return

        row_height = 18
        table_height = min(len(rows), max_rows) * row_height
        self._ensure_space(table_height + 10)
        for index, (label, value) in enumerate(rows[:max_rows]):
            y = self.y - (index * row_height)
            if index % 2 == 0:
                self._rect(MARGIN_X, y - 13, CONTENT_WIDTH, row_height, fill_gray=0.98)
            self._text(label, MARGIN_X + 8, y - 3, size=8)
            self._text(value, MARGIN_X + 260, y - 3, font="F2", size=8)
        self.y -= table_height + 12

    def bullets(self, items: list[str], *, bullet: str = "-") -> None:
        for item in items:
            lines = self._wrapped(item, 92)
            for index, line in enumerate(lines):
                self._ensure_space(14)
                prefix = bullet if index == 0 else " "
                self._text(prefix, MARGIN_X, self.y, font="F2", size=9)
                self._text(line, MARGIN_X + 14, self.y, size=9, gray=0.25)
                self.y -= 12
        self.y -= 4

    def footer(self, text: str) -> None:
        for page_number, page in enumerate(self.pages, start=1):
            page.commands.extend(
                [
                    "0.65 0.65 0.65 RG",
                    f"{_fmt(MARGIN_X)} {_fmt(36)} {_fmt(CONTENT_WIDTH)} 0.5 re f",
                    _text_command(text, MARGIN_X, 24, "F1", 7, 0.45),
                    _text_command(f"Page {page_number}", PAGE_WIDTH - MARGIN_X - 28, 24, "F1", 7, 0.45),
                ]
            )

    def render(self) -> bytes:
        return _build_pdf([page.commands for page in self.pages])

    @property
    def _page(self) -> _PdfPage:
        return self.pages[-1]

    def _new_page(self) -> None:
        self.pages.append(_PdfPage(commands=[]))
        self.y = TOP_Y

    def _ensure_space(self, height: float) -> None:
        if self.y - height < BOTTOM_Y:
            self._new_page()

    def _rule(self, *, gray: float = 0.25) -> None:
        self._page.commands.append(f"{gray} {gray} {gray} RG")
        self._page.commands.append(f"{_fmt(MARGIN_X)} {_fmt(self.y)} {_fmt(CONTENT_WIDTH)} 0.5 re f")

    def _rect(
        self,
        x: float,
        y: float,
        width: float,
        height: float,
        *,
        fill_gray: float | None = None,
        stroke_gray: float | None = None,
    ) -> None:
        if fill_gray is not None:
            self._page.commands.append(f"{fill_gray} {fill_gray} {fill_gray} rg")
            self._page.commands.append(f"{_fmt(x)} {_fmt(y)} {_fmt(width)} {_fmt(height)} re f")
        if stroke_gray is not None:
            self._page.commands.append(f"{stroke_gray} {stroke_gray} {stroke_gray} RG")
            self._page.commands.append(f"{_fmt(x)} {_fmt(y)} {_fmt(width)} {_fmt(height)} re S")

    def _text(
        self,
        value: str,
        x: float,
        y: float,
        *,
        font: str = "F1",
        size: int = 9,
        gray: float = 0,
    ) -> None:
        self._page.commands.append(_text_command(value, x, y, font, size, gray))

    def _wrapped(self, text: str, width: int) -> list[str]:
        return wrap(text, width=width, break_long_words=False) or [""]


def _build_pdf(pages: list[list[str]]) -> bytes:
    font_objects = [
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    ]
    content_objects = [
        b"<< /Length "
        + str(len(content := "\n".join(commands).encode("latin-1", errors="replace"))).encode("ascii")
        + b" >>\nstream\n"
        + content
        + b"\nendstream"
        for commands in pages
    ]

    page_count = len(pages)
    pages_object_number = 2
    first_page_object_number = 3
    first_font_object_number = first_page_object_number + page_count
    first_content_object_number = first_font_object_number + len(font_objects)
    kids = " ".join(f"{first_page_object_number + index} 0 R" for index in range(page_count))

    objects: list[bytes] = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        f"<< /Type /Pages /Kids [{kids}] /Count {page_count} >>".encode("ascii"),
    ]

    for index in range(page_count):
        content_object_number = first_content_object_number + index
        objects.append(
            (
                f"<< /Type /Page /Parent {pages_object_number} 0 R "
                f"/MediaBox [0 0 {PAGE_WIDTH} {PAGE_HEIGHT}] "
                f"/Resources << /Font << /F1 {first_font_object_number} 0 R "
                f"/F2 {first_font_object_number + 1} 0 R >> >> "
                f"/Contents {content_object_number} 0 R >>"
            ).encode("ascii")
        )

    objects.extend(font_objects)
    objects.extend(content_objects)

    pdf = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for index, obj in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf.extend(f"{index} 0 obj\n".encode("ascii"))
        pdf.extend(obj)
        pdf.extend(b"\nendobj\n")

    xref_offset = len(pdf)
    pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode("ascii"))
    pdf.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
    pdf.extend(
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode(
            "ascii"
        )
    )
    return bytes(pdf)


def _text_command(value: str, x: float, y: float, font: str, size: int, gray: float) -> str:
    return (
        "BT\n"
        f"{gray} {gray} {gray} rg\n"
        f"/{font} {size} Tf\n"
        f"{_fmt(x)} {_fmt(y)} Td\n"
        f"({_escape_pdf_text(value)}) Tj\n"
        "ET"
    )


def _escape_pdf_text(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def _fmt(value: float) -> str:
    return f"{value:.2f}".rstrip("0").rstrip(".")
