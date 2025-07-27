import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteProduct, getAllProducts } from "@/lib/actions/product.action";
import { requireAdmin } from "@/lib/auth-guard";
import { formatId, formatNumber } from "@/lib/utils";
import { formatToPHP } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import CreateModal from "./create/create-modal";
import UpdateButton from "./create/UpdateButton";

export const metadata = {
  title: "Admin Products",
};
const AdminProduct = async (props: {
  searchParams: Promise<{ page: string; query: string; category: string }>;
}) => {
  await requireAdmin();

  const searchParams = await props.searchParams;

  const page = Number(searchParams.page || 1);
  const searchText = searchParams.query || "";
  const category = searchParams.category || "";

  const products = await getAllProducts({ page, category, query: searchText });

  return (
    <div className="space-y-2 mt-10">
      <div className="flex-between">
        <div className="flex items-center gap-4">
          <h1 className="h2-bold">Products</h1>
          {searchText && (
            <div>
              Filtered By <i>&quot;{searchText}&quot;</i>{" "}
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* <Button asChild>
          <Link href="/admin/products/create">Create Product</Link>
        </Button> */}
        <CreateModal type="Create" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ITEM</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={80}
                  height={80}
                />
              </TableCell>
              <TableCell>{formatId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{formatToPHP(Number(product.price))}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{formatNumber(product.stock)}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className="flex gap-2">
                {/* Update button */}
                <UpdateButton id={product.id} />
                <DeleteDialog
                  id={product.id}
                  action={deleteProduct}
                ></DeleteDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {products.totalPages > 1 && (
        <Pagination page={page} totalPages={products.totalPages} />
      )}
    </div>
  );
};

export default AdminProduct;
