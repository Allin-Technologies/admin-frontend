"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { TransactionSchema } from "@/lib/zod/event";
import { z } from "zod";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = z.infer<typeof TransactionSchema>;

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "payment_status",
    header: "Status",
  },
  {
    accessorKey: "buyerName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone_number",
    header: "Phone number",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date: string | number = row.getValue("date");

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
    accessorKey: "trxRef",
    header: "Trx Reference",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      return <div className='font-medium'>{formatted}</div>;
    },
  },
  {
    accessorKey: "ticketTypes",
    header: "Ticket types",
    cell: ({ row }) => {
      const ticketTypes: Payment["ticketTypes"] = row.getValue("ticketTypes");

      return (
        <div className='text-sm'>
          {ticketTypes.map((ticketType) => ticketType.type).join(", ")}
        </div>
      );
    },
  },
];
