import { z } from 'zod';

/** Shared by PATCH /api/devices/[id] and the client rename form. */
export const renameDeviceRequestSchema = z.object({
  displayName: z
    .string()
    .max(120, 'Use at most 120 characters')
    .transform((s) => s.trim())
    .refine((s) => s.length >= 1, 'Enter a name'),
});

export type RenameDeviceRequest = z.infer<typeof renameDeviceRequestSchema>;
