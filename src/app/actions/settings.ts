"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function getEventSettings() {
  const settings = await prisma.eventSettings.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: {},
  });
  return settings;
}

export async function setBiddingOpenAction(open: boolean) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Not authorized");
  }
  await prisma.eventSettings.upsert({
    where: { id: 1 },
    create: { id: 1, biddingOpen: open },
    update: { biddingOpen: open },
  });
  revalidatePath("/admin");
  revalidatePath("/");
}
