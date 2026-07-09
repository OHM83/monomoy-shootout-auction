"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { dollarsToCents } from "@/lib/money";
import type { ItemStatus } from "@/generated/prisma/client";

export type ItemFormState = { error?: string };

const itemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().min(1, "Description is required").max(4000),
  imageUrl: z
    .string()
    .trim()
    .url("Image URL must be a valid URL")
    .optional()
    .or(z.literal("")),
  donatedBy: z.string().trim().max(200).optional().or(z.literal("")),
  minBid: z.coerce.number().positive("Minimum bid must be greater than 0"),
  increment: z.coerce.number().positive("Bid increment must be greater than 0"),
  status: z.enum(["DRAFT", "OPEN", "CLOSED"]),
});

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Not authorized");
  }
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const baseSlug = slugify(base) || "item";
  let candidate = baseSlug;
  let suffix = 2;
  for (;;) {
    const existing = await prisma.item.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === ignoreId) return candidate;
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function createItemAction(
  _prevState: ItemFormState,
  formData: FormData
): Promise<ItemFormState> {
  await requireAdmin();

  const parsed = itemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;
  const slug = await uniqueSlug(data.name);

  await prisma.item.create({
    data: {
      slug,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl || null,
      donatedBy: data.donatedBy || null,
      minBidCents: dollarsToCents(data.minBid),
      incrementCents: dollarsToCents(data.increment),
      status: data.status as ItemStatus,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateItemAction(
  itemId: string,
  _prevState: ItemFormState,
  formData: FormData
): Promise<ItemFormState> {
  await requireAdmin();

  const parsed = itemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;
  const existing = await prisma.item.findUnique({ where: { id: itemId } });
  if (!existing) {
    return { error: "Item not found" };
  }

  const slug =
    existing.name === data.name ? existing.slug : await uniqueSlug(data.name, itemId);

  await prisma.item.update({
    where: { id: itemId },
    data: {
      slug,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl || null,
      donatedBy: data.donatedBy || null,
      minBidCents: dollarsToCents(data.minBid),
      incrementCents: dollarsToCents(data.increment),
      status: data.status as ItemStatus,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/items/${slug}`);
  redirect("/admin");
}

export async function deleteItemAction(itemId: string) {
  await requireAdmin();
  await prisma.item.delete({ where: { id: itemId } });
  revalidatePath("/admin");
  revalidatePath("/");
}
