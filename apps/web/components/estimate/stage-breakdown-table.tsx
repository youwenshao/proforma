"use client";

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
import { useTranslations } from "@/lib/i18n/locale-context";

type StageBreakdownTableProps = {
  stages: StageEstimate[];
};

export function StageBreakdownTable({ stages }: StageBreakdownTableProps) {
  const t = useTranslations();

  return (
    <Table aria-label={t("charts.stageLevelEstimate")}>
      <TableHeader>
        <TableRow>
          <TableHead>{t("monitoring.stage")}</TableHead>
          <TableHead>{t("charts.partnerHours")}</TableHead>
          <TableHead>{t("charts.associateHours")}</TableHead>
          <TableHead>{t("charts.cost")}</TableHead>
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
