import z from "zod";

export const apartmentUnitSchema = z.object({
    id: z.string(),
    capacity: z.number().optional(),
    floorNumber: z.string(),
    price: z.number().optional(),
    property: z.string(),
    unitLetter: z.string(),
    created: z.date().optional(),
    updated: z.date().optional(),
})

export const insertApartmentUnitSchema = apartmentUnitSchema.omit({
    id: true,
    created: true,
    updated: true
})

export const updateApartmentUnitSchema = insertApartmentUnitSchema.partial()