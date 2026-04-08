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
import { MoreHorizontal, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface GenericDataTableProps<T> {
  title: string;
  columns: Column<T>[];
  fetchData: (page: number, limit: number) => Promise<{ data: T[]; meta: Meta }>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  refreshTrigger?: number;
}

export function GenericDataTable<T extends { id: string }>({
  title,
  columns,
  fetchData,
  onEdit,
  onDelete,
  refreshTrigger = 0,
}: GenericDataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (page: number) => {
    try {
      setLoading(true);
      const result = await fetchData(page, meta.limit);
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
    loadData(meta.page);
  }, [meta.page, refreshTrigger]);

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
      {title && (
        <CardHeader>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? "" : "p-0"}>
        <div className={title ? "rounded-md border" : "border-b border-t"}>
          <Table>

            <TableHeader>
              <TableRow>
                {columns.map((column, idx) => (
                  <TableHead key={idx}>{column.header}</TableHead>
                ))}
                {(onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
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
                  <TableRow key={item.id}>
                    {columns.map((column, idx) => (
                      <TableCell key={idx}>
                        {column.cell
                          ? column.cell(item)
                          : (item[column.accessorKey as keyof T] as unknown as React.ReactNode)}
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {meta.totalPages > 1 && (
        <CardFooter className="flex items-center justify-between px-6 py-4">
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            Showing Page {meta.page} of {meta.totalPages} ({meta.total} Total)
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={meta.page <= 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={meta.page >= meta.totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
    </div>
  );
}
