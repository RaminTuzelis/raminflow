import { orders } from "@/data/orders";
import { notFound } from "next/navigation";

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;
  const order = orders.find((order) => order.id === id);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-white">{order.orderNumber}</h1>
      <p className="mt-4 text-slate-400">{order.projectName}</p>
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-white">Order items</h2>

        <div className="mt-4 grid gap-4">
          {order.items.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-slate-800 bg-slate-900/50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-medium text-white">{item.name}</h3>
                <span className="text-sm text-slate-400">
                  Quantity: {item.quantity}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {item.technicalDescription}
              </p>

              <ul className="mt-4 space-y-2">
                {item.materials.map((material) => (
                  <li
                    key={material.id}
                    className="rounded-md bg-slate-950 px-3 py-2 text-sm"
                  >
                    {material.partName ? `${material.partName}: ` : ""}
                    {material.materialType}, {material.thicknessMm} mm
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
