import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyOrder } from "@/lib/actions/order.actions";
import { formatDateandTime, formatId } from "@/lib/utils";
import { formatToPHP } from "@/utils/helper";
import Image from "next/image";

import ButtonLink from "./ButtonLink";

export const metadata = {
  title: "Orders History",
};

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await props.searchParams;

  const orders = await getMyOrder({ page: Number(page) || 1 });
  console.log(orders);

  return (
    <div className="space-y-2">
      <h2 className="h2-bold text-center">Order History</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ITEM</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.order.map((eachOrder) => (
              <TableRow key={eachOrder.id}>
                <TableCell>
                  <Image
                    src={eachOrder.OrderItem[0]?.image}
                    alt="item image"
                    width={80}
                    height={80}
                  />
                </TableCell>
                <TableCell>{formatId(eachOrder.id)}</TableCell>
                <TableCell>
                  {formatDateandTime(eachOrder.createdAt).dateTime}
                </TableCell>
                <TableCell>
                  {formatToPHP(Number(eachOrder.totalPrice))}
                </TableCell>
                <TableCell>
                  {eachOrder.isPaid && eachOrder.paidAt ? (
                    formatDateandTime(eachOrder.paidAt).dateTime
                  ) : (
                    <p className="text-destructive">Not Paid</p>
                  )}
                </TableCell>
                <TableCell>
                  {eachOrder.isDelivered && eachOrder.deliveredAt ? (
                    formatDateandTime(eachOrder.deliveredAt).dateTime
                  ) : (
                    <p className="text-destructive">Not Delivered</p>
                  )}
                </TableCell>
                <TableCell>
                  <ButtonLink href={`/order/${eachOrder.id}`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersPage;
