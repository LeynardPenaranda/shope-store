import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { requireAdmin } from "@/lib/auth-guard";
import { formatDateandTime, formatId } from "@/lib/utils";
import { formatToPHP } from "@/utils/helper";
import Image from "next/image";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";

export const metadata = {
  title: "Admin Orders",
};
const OrderPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  await requireAdmin();

  const { page = "1" } = await props.searchParams;
  const orders = await getAllOrders({ page: Number(page) });

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
            {orders.data.map((eachOrder) => (
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
                  <Button variant="outline">Details</Button>
                  <DeleteDialog id={eachOrder.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPage > 1 && (
          <Pagination page={Number(page) || 1} totalPages={orders?.totalPage} />
        )}
      </div>
    </div>
  );
};

export default OrderPage;
