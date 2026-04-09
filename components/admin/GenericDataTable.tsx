"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2, FilterX } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface GenericDataTableProps<T> {
  title?: string;
  columns: Column<T>[];
  fetchData: (page: number, limit: number, filters?: Record<string, any>) => Promise<{ data: T[]; meta: Meta }>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  refreshTrigger?: number;
  filtersConfig?: FilterConfig[];
}

// Memoized Table Header to avoid unnecessary re-renders
const TableHeaderMemo = React.memo(({ 
  columns, 
  showActions 
}: { 
  columns: Column<any>[], 
  showActions: boolean 
}) => (
  <TableHeader>
    <TableRow>
      {columns.map((column, idx) => (
        <TableHead key={idx}>{column.header}</TableHead>
      ))}
      {showActions && <TableHead className="text-right">Actions</TableHead>}
    </TableRow>
  </TableHeader>
));
TableHeaderMemo.displayName = "TableHeaderMemo";

// Memoized Table Row to avoid re-rendering all rows when only one changes or when pagination metadata updates
const TableRowMemo = React.memo(({ 
  item, 
  columns, 
  onEdit, 
  onDelete 
}: { 
  item: any, 
  columns: Column<any>[], 
  onEdit?: (item: any) => void, 
  onDelete?: (item: any) => void 
}) => (
  <TableRow key={item.id}>
    {columns.map((column, idx) => (
      <TableCell key={idx}>
        {column.cell
          ? column.cell(item)
          : (item[column.accessorKey as keyof any] as unknown as React.ReactNode)}
      </TableCell>
    ))}
    {(onEdit || onDelete) && (
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(item)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => onDelete(item)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    )}
  </TableRow>
));
TableRowMemo.displayName = "TableRowMemo";

export function GenericDataTable<T extends { id: string }>({
  title,
  columns,
  fetchData,
  onEdit,
  onDelete,
  refreshTrigger = 0,
  filtersConfig = [],
}: GenericDataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<Record<string, string>>({});

  const loadData = async (page: number, filters?: Record<string, string>) => {
    try {
      setLoading(true);
      const result = await fetchData(page, meta.limit, filters);
      setData(result.data);
      setMeta(result.meta);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(meta.page, currentFilters);
  }, [meta.page, refreshTrigger, currentFilters]);

  const handleFilterChange = (key: string, value: string) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? "" : value,
    }));
    // Reset to page 1 when filters change
    setMeta((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setCurrentFilters({});
    setMeta((prev) => ({ ...prev, page: 1 }));
  };

  const handlePrevious = () => {
    if (meta.page > 1) {
      setMeta((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNext = () => {
    if (meta.page < meta.totalPages) {
      setMeta((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-6 pt-6">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          
          <div className="flex items-center gap-2">
            {filtersConfig.length > 0 && (
              <div className="flex items-center gap-2">
                {filtersConfig.map((filter) => (
                  <Select
                    key={filter.key}
                    value={currentFilters[filter.key] || "all"}
                    onValueChange={(val) => handleFilterChange(filter.key, val as string)}
                  >
                    <SelectTrigger className="w-45 h-9">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All {filter.label}s</SelectItem>
                      {filter.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
                
                {Object.keys(currentFilters).some(k => currentFilters[k]) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-9 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <FilterX className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                ) }
              </div>
            )}
          </div>
        </div>

        <CardContent className={title ? "" : "p-0"}>
          <div className={title ? "rounded-md border" : "border-b border-t"}>
            <Table>
              <TableHeaderMemo columns={columns} showActions={!!(onEdit || onDelete)} />
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {columns.map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                      {(onEdit || onDelete) && (
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-8 ml-auto" />
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => (
                    <TableRowMemo 
                      key={item.id} 
                      item={item} 
                      columns={columns} 
                      onEdit={onEdit} 
                      onDelete={onDelete} 
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex items-center justify-between px-6 py-4 border-t bg-muted/5">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Page <span className="text-foreground">{meta.page}</span> of {Math.max(meta.totalPages, 1)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {meta.total} records total
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 gap-1"
            onClick={handlePrevious}
            disabled={meta.page <= 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          <div className="flex h-8 min-w-8 items-center justify-center rounded-md border text-sm font-medium bg-background px-2">
            {meta.page}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 gap-1"
            onClick={handleNext}
            disabled={meta.page >= meta.totalPages || loading || meta.totalPages === 0}
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </div>
  );
}
