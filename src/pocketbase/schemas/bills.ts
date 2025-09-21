import z from "zod";
import { BillsStatusOptions } from "../types";
import { insertBillItemsSchema } from "./billItems";

export const billSchema = z.object({
  created: z.date().optional(),
  dueDate: z.date(),
  id: z.string(),
  status: z.enum(BillsStatusOptions),
  tenancy: z.string(),
  updated: z.date().optional(),
});

export const insertBillSchema = billSchema.omit({
  id: true,
  created: true,
  updated: true,
}).extend({ items: z.array(insertBillItemsSchema) });

export const updateBillSchema = insertBillSchema.partial();
