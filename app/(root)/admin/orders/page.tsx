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
import ButtonLink from "../../user/orders/ButtonLink";
import Link from "next/link";

export const metadata = {
  title: "Admin Orders",
};
const OrderPage = async (props: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  await requireAdmin();

  const { page = "1", query: searchText } = await props.searchParams;
  const orders = await getAllOrders({ page: Number(page), query: searchText });

  return (
    <div className="space-y-2 mt-10">
      <div className="flex items-center gap-4">
        <h1 className="h2-bold">Orders</h1>
        {searchText && (
          <div>
            Filtered By <i>&quot;{searchText}&quot;</i>{" "}
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ITEM</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>BUYER</TableHead>
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
                <TableCell>{eachOrder.user.name}</TableCell>
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
