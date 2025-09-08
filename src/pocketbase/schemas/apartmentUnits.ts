import z from "zod";

export const apartmentUnitSchema = z.object({
    id: z.string(),
    capacity: z.number().optional(),
    floorNumber: z.number(),
    price: z.number().nonnegative().optional(),
    property: z.string(),
    unitLetter: z.string().min(1).max(1),
    created: z.date().optional(),
    updated: z.date().optional(),
})

export const insertApartmentUnitSchema = apartmentUnitSchema.omit({
    id: true,
    created: true,
    updated: true
})

export const updateApartmentUnitSchema = insertApartmentUnitSchema.partial()