"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AdminDataTable<T extends Record<string, any>>({
  columns,
  data: rawData,
  isLoading = false,
  onRowClick,
  pagination,
}: AdminDataTableProps<T>) {
  const data = Array.isArray(rawData) ? rawData : [];
  return (
    <div className="rounded-sm border border-[hsl(0_0%_16%)] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[hsl(0_0%_16%)] hover:bg-transparent">
            {columns.map((col) => (
              <TableHead
                key={String(col.accessor)}
                className={`text-xs font-medium uppercase tracking-wider text-[hsl(0_0%_55%)] ${col.className ?? ""}`}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow
                  key={i}
                  className="border-[hsl(0_0%_16%)]"
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.accessor)}>
                      <Skeleton className="h-4 w-full bg-[hsl(0_0%_14%)]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : data.length === 0
              ? (
                <TableRow className="border-[hsl(0_0%_16%)]">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-[hsl(0_0%_55%)]"
                  >
                    Sin resultados
                  </TableCell>
                </TableRow>
              )
              : data.map((row, i) => (
                <TableRow
                  key={i}
                  className={`border-[hsl(0_0%_16%)] hover:bg-[hsl(0_0%_12%)] ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={String(col.accessor)}
                      className={`text-[hsl(0_0%_85%)] ${col.className ?? ""}`}
                    >
                      {col.render
                        ? col.render(row)
                        : String(row[col.accessor as keyof T] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[hsl(0_0%_16%)] px-4 py-3">
          <span className="text-xs text-[hsl(0_0%_55%)]">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-[hsl(0_0%_16%)] bg-transparent text-[hsl(0_0%_55%)] hover:bg-[hsl(0_0%_14%)] hover:text-[hsl(0_0%_93%)]"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-[hsl(0_0%_16%)] bg-transparent text-[hsl(0_0%_55%)] hover:bg-[hsl(0_0%_14%)] hover:text-[hsl(0_0%_93%)]"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
