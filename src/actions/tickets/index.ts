"use server";

import { ticketsDataSchema } from "@/lib/zod/tickets";
import { auth } from "../../../auth";
import { api } from "@/lib/api";
import { downloadTicketsSchema } from "@/lib/zod/download";
import { scanTicketSchema } from "@/lib/zod/scan";
import { searchSchema } from "@/lib/zod/search";
interface PaginationState {
  pageIndex: number;
  pageSize: number;
}
export async function getTickets(pagination: PaginationState) {
  const session = await auth();

  if (!session || !session.user || !session?.user?.events) {
    return null;
  }

  const res = await api(ticketsDataSchema, {
    url: `/dashboard/${session?.user?.events[0]}/tickets?page=${
      pagination.pageIndex + 1
    }&pick=${pagination.pageSize}`,
    method: "get",
  });

  return {
    rows: res?.data?.tickets ?? [],
    pageCount: res.data?.pagination?.totalPages ?? 0,
    rowCount: (res?.data?.tickets ?? [])?.length ?? 0,
  };
}

export async function getTicketsDownload() {
  const session = await auth();

  if (!session || !session.user || !session?.user?.events) {
    return null;
  }

  const res = await api(downloadTicketsSchema, {
    url: `/dashboard/${session?.user?.events[0]}/downloadtickets`,
    method: "get",
  });

  return res;
}

export async function getTicketsScan(id: string) {
  const session = await auth();

  if (!session || !session.user || !session?.user?.events) {
    return null;
  }

  const res = await api(scanTicketSchema, {
    url: `/ticket/scan?uniqueID=${id}&eventId=${session?.user?.events[0]}`,
    method: "get",
  });

  // http://localhost:5000/api/ticket/checkin?eventId=671a86c3481e26e9f4b737fc&search=tom
  // http://localhost:5000/api/ticket/scan?uniqueID=9en1h7wf

  return res;
}

export async function getTicketsSearch(search: string) {
  const session = await auth();

  if (!session || !session.user || !session?.user?.events) {
    return null;
  }

  const res = await api(searchSchema, {
    url: `/ticket/checkin?search=${search}&eventId=${session?.user?.events[0]}`,
    method: "get",
  });

  const results =
    res?.data?.results?.filter((r) => r.payment_status !== "pending") ?? [];

  return { ...res, data: { count: results?.length, results } };
}
