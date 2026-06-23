from __future__ import annotations

from proforma_data.schemas import QuoteSubstantiationResponse


def render_quote_pack_pdf(snapshot: QuoteSubstantiationResponse) -> bytes:
    lines = [
        "Quote Substantiation Pack",
        f"Estimate ID: {snapshot.estimate_id}",
        f"Benchmark segment: {snapshot.benchmark_segment.segment_label}",
        f"Comparable matters: {snapshot.benchmark_segment.sample_size}",
        "",
        "Key metrics",
        *[f"{metric.label}: {metric.display_value}" for metric in snapshot.metrics],
        "",
        "Assumptions and guardrails",
        *snapshot.assumptions_and_guardrails,
        "",
        "Evidence",
        *snapshot.evidence_footer,
        f"Snapshot checksum: {snapshot.snapshot_checksum or 'pending'}",
    ]
    return _single_page_pdf(lines)


def _single_page_pdf(lines: list[str]) -> bytes:
    text_commands = ["BT", "/F1 10 Tf", "50 750 Td"]
    first = True
    for line in lines[:42]:
        if first:
            first = False
        else:
            text_commands.append("0 -16 Td")
        text_commands.append(f"({_escape_pdf_text(line)}) Tj")
    text_commands.append("ET")
    content = "\n".join(text_commands).encode("latin-1", errors="replace")

    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        b"<< /Length "
        + str(len(content)).encode("ascii")
        + b" >>\nstream\n"
        + content
        + b"\nendstream",
    ]

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


def _escape_pdf_text(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
