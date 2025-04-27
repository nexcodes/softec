"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CrimeDetailDialog } from "./crime-details-dialog";
import { mockCrimes } from "./mock-data";

// Define the Crime type based on your schema
export type Crime = {
  id: string;
  userId: string | null;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  placeId: string | null;
  reportedAt: Date;
  crimeType: CrimeType;
  incidentDate: Date;
  isLive: boolean;
  isVerified: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  media: Media[];
  comments: Comment[];
  votes: Vote[];
};

export type Comment = {
  id: string;
  content: string;
  userId: string | null;
  crimeId: string;
  createdAt: Date;
  pinned: boolean;
  user?: {
    name: string;
    image: string;
  };
};

export type Media = {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO" | "OTHER";
  crimeId: string;
  uploadedAt: Date;
};

export type Vote = {
  id: string;
  userId: string;
  crimeId: string;
  value: boolean;
  createdAt: Date;
};

export enum CrimeType {
  HOMICIDE = "HOMICIDE",
  ASSAULT = "ASSAULT",
  THEFT = "THEFT",
  ROBBERY = "ROBBERY",
  BURGLARY = "BURGLARY",
  ARSON = "ARSON",
  VANDALISM = "VANDALISM",
  FRAUD = "FRAUD",
  EMBEZZLEMENT = "EMBEZZLEMENT",
  KIDNAPPING = "KIDNAPPING",
  CYBERCRIME = "CYBERCRIME",
  DRUG_TRAFFICKING = "DRUG_TRAFFICKING",
  RAPE = "RAPE",
}

export function CrimeTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedCrime, setSelectedCrime] = useState<Crime | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Define columns for the table
  const columns: ColumnDef<Crime>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description: string = row.getValue("description");
        return (
          <div className="max-w-[300px] truncate" title={description}>
            {description}
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "crimeType",
      header: "Type",
      cell: ({ row }) => {
        const crimeType: CrimeType = row.getValue("crimeType");
        return (
          <Badge variant="outline" className="capitalize">
            {crimeType.replace("_", " ").toLowerCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "incidentDate",
      header: "Incident Date",
      cell: ({ row }) => {
        const date: Date = row.getValue("incidentDate");
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "isLive",
      header: "Status",
      cell: ({ row }) => {
        const isLive: boolean = row.getValue("isLive");
        const isVerified: boolean | null = row.original.isVerified;

        return (
          <div className="flex gap-2">
            {isLive && (
              <Badge
                variant="default"
                className="bg-green-500 hover:bg-green-600"
              >
                Live
              </Badge>
            )}
            {isVerified && (
              <Badge
                variant="default"
                className="bg-blue-500 hover:bg-blue-600"
              >
                Verified
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedCrime(row.original);
              setIsDetailOpen(true);
            }}
            aria-label="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: mockCrimes,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedCrime(row.original);
                    setIsDetailOpen(true);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} crime(s) total
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {selectedCrime && (
        <CrimeDetailDialog
          crime={selectedCrime}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      )}
    </div>
  );
}
