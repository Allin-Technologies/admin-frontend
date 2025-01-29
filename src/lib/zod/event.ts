import { z } from "zod";
const EventSchema = z.object({
  imgsrc: z.string(),
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
  slug: z.string(),
  duration: z.number(),
  time: z.string(),
  location: z.string().or(
    z.object({
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
    })
  ),
  location_url: z.string(),
  event_type: z.string(),
  category: z.string(),
  total_tickets: z.number(),
  total_tickets_sold: z.number(),
  available_tickets: z.number(),
  total_checked_in: z.number(),
  ticket_sales_percentage: z.string(),
});

const TicketSaleSchema = z.object({
  type: z.string(),
  price: z.number(),
  sold: z.number(),
  remaining: z.number().nullable(),
  revenue: z.number(),
  benefits: z.string().nullable().optional(),
  sales_percentage: z.string(),
});

export const TransactionSchema = z.object({
  holderName: z.string().optional(),
  email: z.string().email(),
  gender: z.string(),
  phone_number: z.number(),
  trxRef: z.string().nullable(),
  payment_status: z.string(),
  amount: z.number(),
  date: z.string(),
  ticketTypes: z.array(
    z.object({
      type: z.string(),
      quantity: z.number(),
    })
  ),
});

const PaginationSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
});

export const eventDataSchema = z.object({
  event: EventSchema,
  ticketSales: z.array(TicketSaleSchema),
  totalRevenue: z.number(),
  recentTransactions: z.array(TransactionSchema),
  pagination: PaginationSchema,
});
