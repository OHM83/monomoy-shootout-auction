import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { createItemAction } from "@/app/actions/items";
import { ItemForm } from "@/components/item-form";

export default async function NewItemPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 text-xl font-bold">Add item</h1>
      <ItemForm action={createItemAction} submitLabel="Create item" />
    </div>
  );
}
