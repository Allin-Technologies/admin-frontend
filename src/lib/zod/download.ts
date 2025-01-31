import { z } from "zod";

export const _TransactionSchema = z.object({
  buyerName: z.string().optional(),
  holderName: z.string().optional(),
  email: z.string().email(),
  gender: z.string(),
  phone_number: z.number(),
  trxRef: z.string().nullable(),
  payment_status: z.string(),
  amount: z.number(),
  date: z.string(),
  uniqueID: z.string(),
  ticket_type: z.string(),
  check_in: z.boolean().optional(),
});

export const downloadTransactionsSchema = z.object({
  eventTitle: z.string(),
  transactions: z.array(_TransactionSchema),
  totalItems: z.number(),
});

export const _Ticket = z.object({
  name: z.string(),
  email: z.string(),
  gender: z.string(),
  phone_number: z.number(),
  ticket_class: z.string(),
  amount: z.number(),
  payment_status: z.string(),
  trxRef: z.string(),
  uniqueID: z.string(),
  date: z.string(),
  check_in: z.boolean().optional(),
});

export const downloadTicketsSchema = z.object({
  eventTitle: z.string(),
  ticket_holders: z.array(_Ticket),
  totalItems: z.number().optional(),
});
