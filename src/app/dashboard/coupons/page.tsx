import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "../../../../auth";
import { api } from "@/lib/api";
import { z } from "zod";
import dayjs from "dayjs";

const couponSchema = z.object({
  _id: z.string(),
  couponcode: z.string(),
  discountPercentage: z.number(),
  maxUses: z.number(),
  currentUses: z.number(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isActive: z.boolean(),
  __v: z.number(),
  events: z
    .object({
      usageCount: z.number(),
      event: z.object({
        _id: z.string(),
      }),
    })
    .array(),
});

export default async function Page() {
  const session = await auth();

  if (!session || !session.user || !session?.user?.events) {
    return null;
  }

  const res = await api(couponSchema.array(), {
    url: `/coupon/getall`,
    method: "get",
  });

  const event_coupons =
    res?.data?.filter(
      (c) => c?.events?.[0]?.event?._id == session?.user?.events?.[0]
    ) ?? [];

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {event_coupons?.map((coupon) => (
          <Card key={coupon._id} className='flex flex-col'>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div className='space-y-2'>
                  <CardTitle>{coupon.couponcode}</CardTitle>
                  <CardDescription>
                    Valid from {dayjs(coupon.validFrom).format("DD MMM, YYYY")}{" "}
                    till {dayjs(coupon.validUntil).format("DD MMM, YYYY")}
                  </CardDescription>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  aria-label={`Edit ${coupon.couponcode}`}
                >
                  <Edit className='h-4 w-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent className='flex-grow'>
              <p className='text-sm text-muted-foreground mb-4'>
                {/* Benefits: {ticket.benefits} */}
              </p>
              <div className='space-y-1'>
                <p className='text-sm font-medium'>
                  Discount Percentage:{" "}
                  <span className='font-normal'>
                    {coupon.discountPercentage}%
                  </span>
                </p>
                <p className='text-sm font-medium'>
                  Max uses:{" "}
                  <span className='font-normal'>{coupon.maxUses}</span>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <p className='text-sm text-muted-foreground'>
                Available: {coupon.maxUses - (coupon.currentUses ?? 0)}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
