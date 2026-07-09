import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateItemAction } from "@/app/actions/items";
import { ItemForm } from "@/components/item-form";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) notFound();

  const action = updateItemAction.bind(null, item.id);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 text-xl font-bold">Edit item</h1>
      <ItemForm
        action={action}
        submitLabel="Save changes"
        defaultValues={{
          name: item.name,
          description: item.description,
          imageUrl: item.imageUrl ?? "",
          donatedBy: item.donatedBy ?? "",
          minBid: item.minBidCents / 100,
          increment: item.incrementCents / 100,
          status: item.status,
        }}
      />
    </div>
  );
}
