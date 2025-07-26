import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { formatDateandTime, formatNumber } from "@/lib/utils";
import { formatToPHP } from "@/utils/helper";
import { Barcode, CreditCard, HandCoins, Users } from "lucide-react";
import Link from "next/link";
import Charts from "./chart";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata = {
  title: "Admin Dashboard",
};
const OverviewPage = async () => {
  await requireAdmin();

  const summary = await getOrderSummary();
  console.log(summary);
  return (
    <div className="space-y-2">
      <h2 className="h2-bold mt-15">Dashboard Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <HandCoins />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatToPHP(Number(summary.totalSales._sum.totalPrice || 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cutomers/Users
            </CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.usersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.productsCount)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts
              data={{
                salesData: summary.salesData,
              }}
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">BUYER</TableHead>
                  <TableHead className="font-bold">DATE</TableHead>
                  <TableHead className="font-bold">TOTAL</TableHead>
                  <TableHead className="font-bold">PAID</TableHead>
                  <TableHead className="font-bold">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.user?.name ? order.user.name : `Deleted Order`}
                    </TableCell>
                    <TableCell>
                      {formatDateandTime(order.createdAt).dateOnly}
                    </TableCell>
                    <TableCell>
                      {formatToPHP(Number(order.totalPrice))}
                    </TableCell>
                    <TableCell>
                      {order.isPaid ? (
                        <p className="text-green-500">PAID</p>
                      ) : (
                        <p className="text-destructive">NOT PAID</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/order/${order.id}`}>
                        <Button variant="outline">Details</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
