import type { StageEstimate } from "@/lib/api/types";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StageBreakdownTableProps = {
  stages: StageEstimate[];
};

export function StageBreakdownTable({ stages }: StageBreakdownTableProps) {
  return (
    <Table aria-label="Stage-level estimate">
      <TableHeader>
        <TableRow>
          <TableHead>Stage</TableHead>
          <TableHead>Partner hours</TableHead>
          <TableHead>Associate hours</TableHead>
          <TableHead>Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stages.map((stage) => (
          <TableRow key={stage.stage_name}>
            <TableCell className="font-medium">{stage.stage_name}</TableCell>
            <TableCell>{formatNumber(stage.partner_hours, 1)}</TableCell>
            <TableCell>{formatNumber(stage.associate_hours, 1)}</TableCell>
            <TableCell>{formatCurrency(stage.cost_hkd)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
