import type { OrderItem } from "@/types/order";
import type {
  UpdateOrderItemAction,
  RemoveOrderItemAction,
} from "@/app/orders/[id]/edit/actions";
import { unitLabels } from "@/lib/order-display";
import { OrderEditRemoveItemButton } from "@/components/order-edit-remove-item-button";
import { OrderEditItemEditButton } from "@/components/order-edit-item-edit-button";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type OrderEditItemsTableProps = {
  orderId: string;
  items: OrderItem[];
  removeAction: RemoveOrderItemAction;
  updateAction: UpdateOrderItemAction;
};

export function OrderEditItemsTable({
  orderId,
  items,
  removeAction,
  updateAction,
}: OrderEditItemsTableProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border">
      <Table className="min-w-180">
        <TableCaption className="sr-only">Editable order items</TableCaption>
        <TableHeader className="bg-muted text-xs uppercase">
          <TableRow className="hover:bg-transparent">
            <TableHead scope="col" className="w-16 px-4 text-muted-foreground">
              #
            </TableHead>
            <TableHead scope="col" className="px-4 text-muted-foreground">
              Item
            </TableHead>
            <TableHead scope="col" className="px-4 text-muted-foreground">
              Quantity
            </TableHead>
            <TableHead scope="col" className="px-4 text-muted-foreground">
              Material
            </TableHead>
            <TableHead scope="col" className="px-4 text-muted-foreground">
              Thickness
            </TableHead>
            <TableHead
              scope="col"
              className="px-4 text-right text-muted-foreground"
            >
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={6}
                className="h-28 px-4 text-center text-muted-foreground"
              >
                No order items have been added.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="px-4 py-3 text-muted-foreground">
                  {index + 1}
                </TableCell>

                <TableCell className="px-4 py-3 font-medium text-foreground">
                  {item.name}
                </TableCell>

                <TableCell className="px-4 py-3 text-muted-foreground">
                  {item.quantity} {unitLabels[item.unit]}
                </TableCell>

                <TableCell className="px-4 py-3 text-muted-foreground">
                  {item.materialType}
                </TableCell>

                <TableCell className="px-4 py-3 text-muted-foreground">
                  {item.thicknessMm} mm
                </TableCell>

                <TableCell className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <OrderEditItemEditButton
                      orderId={orderId}
                      item={item}
                      updateAction={updateAction}
                    />
                    <OrderEditRemoveItemButton
                      orderId={orderId}
                      item={item}
                      removeAction={removeAction}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
