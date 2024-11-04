"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { z } from "zod";
import { TicketSchema } from "@/lib/zod/tickets";
import dayjs from "dayjs";
import { getTickets } from "@/actions/tickets";
import { Card, CardContent } from "@/components/ui/card";

const columns: ColumnDef<z.infer<typeof TicketSchema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Ticket ID",
  },
  {
    accessorKey: "payment_status",
    header: "Status",
    cell: ({ row }) => (
      <div className='capitalize'>
        {row.original.ticket_info.payment_status === "Free Event"
          ? "Success"
          : row.original.ticket_info.payment_status}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.original.user.name}</div>,
  },
  {
    accessorKey: "trxRef",
    header: "Transaction Reference",
    cell: ({ row }) => <div>{row.original.ticket_info.trxRef}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className='px-0'
        >
          Email
          <CaretSortIcon className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='lowercase'>{row.original.user.email}</div>
    ),
  },

  {
    accessorKey: "phone",
    header: "Phone number",
    cell: ({ row }) => (
      <div className='lowercase'>{row.original.user.phone}</div>
    ),
  },
  {
    accessorKey: "purchase_date",
    header: "Date",
    cell: ({ row }) => {
      const date: string | number = row.original.ticket_info.purchase_date;

      return (
        <div>
          {dayjs(date).isValid()
            ? dayjs(date).format("ddd, DD MMMM YYYY")
            : date}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className='text-right'>Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.original.ticket_info.amount?.toString());
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      return <div className='font-medium'>{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(payment.ticket_info.trxRef)
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const queryClient = new QueryClient();

function TransactionTable({
  defaultData: _defaultData,
  defaultPagination,
}: {
  defaultData: z.infer<typeof TicketSchema>[];
  defaultPagination: PaginationState;
}) {
  const [pagination, setPagination] =
    React.useState<PaginationState>(defaultPagination);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const dataQuery = useQuery({
    queryKey: ["tickets", pagination],
    queryFn: () => getTickets(pagination),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });

  const defaultData = React.useMemo(() => _defaultData, [_defaultData]);

  const table = useReactTable({
    data: dataQuery.data?.rows ?? defaultData,
    pageCount: dataQuery.data?.pageCount ?? -1,
    manualPagination: true,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className='flex-1 flex flex-col gap-4'>
      <Card className='shadow-none border-none'>
        <CardContent className='flex flex-col md:flex-row items-center gap-2 p-4 lg:p-6'>
          <Input
            placeholder='Filter emails...'
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto'>
                Columns <ChevronDownIcon className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <Card className='flex-1 shadow-none border-none'>
        <CardContent className='p-4 lg:p-6'>
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
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className='shadow-none border-none relative'>
        <CardContent className='flex items-center justify-end space-x-2 p-4 lg:p-6'>
          <div className='flex-1 text-sm text-muted-foreground'>
            {pagination.pageIndex + 1} of{" "}
            {dataQuery.data?.pageCount.toLocaleString() ?? 0} page(s).
          </div>
          <div className='space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <div
        className='loader rounded-full h-1 w-full hidden lg:block'
        data-state={dataQuery.isFetching}
      />
    </div>
  );
}

export default function TransactionsPage({
  defaultData,
  defaultPagination,
}: {
  defaultData: z.infer<typeof TicketSchema>[];
  defaultPagination: PaginationState;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TransactionTable
        defaultData={defaultData}
        defaultPagination={defaultPagination}
      />
    </QueryClientProvider>
  );
}
