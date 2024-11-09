"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader, Search } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "sonner";
import { getTicketsScan, getTicketsSearch } from "@/actions/tickets";
import { searchSchema } from "@/lib/zod/search";
import { Separator } from "@/components/ui/separator";

const FormSchema = z.object({
  id: z.string().min(2, {
    message: "search term must be at least 2 characters.",
  }),
});

export default function Page() {
  const [ref] = useAutoAnimate();
  const [pending, setPending] = React.useState("");
  const [result, setResult] = React.useState<
    z.infer<typeof searchSchema>["results"]
  >([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await getTicketsSearch(data.id);

      if (res?.data) {
        setResult(res.data.results);
        if (res.data.count >= 1) {
          toast.success(`${res.data.count} tickets found`);
        } else {
          toast.warning("No results found");
        }
      } else {
        toast.error(res?.message ?? "something went wrong!");
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error("something went wrong!");
    }
  }

  return (
    <Form {...form}>
      <div
        ref={ref}
        className='min-h-[80vh] flex flex-col gap-4 items-center justify-center'
      >
        <Card className='md:min-w-[465px] lg:min-w-[565px]'>
          <CardHeader>
            <CardTitle>Ticket Check in</CardTitle>
            <CardDescription>
              Check in via your Ticket Id, email or name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='id'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='flex gap-2'>
                        <Input
                          className='flex-1'
                          placeholder='Ticket Id, email or name'
                          {...field}
                        />
                        <Button className='h-auto'>
                          {form.formState.isSubmitting ? (
                            <Loader className='animate-spin' />
                          ) : (
                            <Search />
                          )}

                          <span>Search</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </CardContent>
        </Card>

        {result.length >= 1 && (
          <Card className='md:min-w-[465px] lg:min-w-[565px]'>
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-3'>
              {result.map((resultItem, index) => {
                const checkIn = async () => {
                  setPending(resultItem.event_info[0].uniqueID);
                  try {
                    const res = await getTicketsScan(
                      resultItem.event_info[0].uniqueID
                    );

                    if (res?.data) {
                      toast.success(
                        `${res.data.event_info[0].uniqueID} Checked in sucessfully`
                      );

                      setResult([]);
                    } else {
                      toast.error(res?.message ?? "something went wrong!");
                    }
                  } catch (error: unknown) {
                    console.log(error);
                    toast.error("something went wrong!");
                  } finally {
                    setPending("");
                  }
                };
                return (
                  <div key={resultItem._id} className='space-y-3 text-sm'>
                    <ul className='space-y-1'>
                      <li>
                        <span>Name:</span> {resultItem.user.first_name}{" "}
                        {resultItem.user.last_name}
                      </li>
                      <li>
                        <span>Email:</span> {resultItem.user.email}
                      </li>
                      <li>
                        <span>Ticket:</span>{" "}
                        {resultItem.event_info[0].ticket_type}
                      </li>
                      <li>
                        <span>Checked In:</span>{" "}
                        {resultItem.event_info[0].check_in ? "True" : "False"}
                      </li>
                      <li>
                        <span>Ticket ID:</span>{" "}
                        {resultItem.event_info[0].uniqueID}
                      </li>
                    </ul>
                    {!resultItem.event_info[0].check_in && (
                      <Button onClick={checkIn}>
                        {pending === resultItem.event_info[0].uniqueID && (
                          <Loader className='animate-spin' />
                        )}
                        <span>Check In</span>
                      </Button>
                    )}

                    {index < result.length - 1 && <Separator />}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </Form>
  );
}