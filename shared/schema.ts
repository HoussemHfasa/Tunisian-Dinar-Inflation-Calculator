import { z } from "zod";

export const cpiDataSchema = z.object({
  year: z.number().min(1850).max(2050),
  month: z.number().min(1).max(12).optional(),
  base1962: z.number().optional(),
  base1970: z.number().optional(),
  base1977: z.number().optional(),
  base1983: z.number().optional(),
  base1990: z.number().optional(),
  base2000: z.number().optional(),
  base2005: z.number().optional(),
  base2010: z.number().optional(),
});

export const inflationCalculationSchema = z.object({
  amount: z.number().min(0.01),
  yearFrom: z.number().min(1850).max(2050),
  yearTo: z.number().min(1850).max(2050),
});

export const inflationResultSchema = z.object({
  originalAmount: z.number(),
  equivalentAmount: z.number(),
  yearFrom: z.number(),
  yearTo: z.number(),
  cpiFrom: z.number(),
  cpiTo: z.number(),
  baseYear: z.string(),
  totalInflation: z.number(),
  annualInflation: z.number(),
  period: z.number(),
  lastUpdate: z.string(),
});

export type CPIData = z.infer<typeof cpiDataSchema>;
export type InflationCalculation = z.infer<typeof inflationCalculationSchema>;
export type InflationResult = z.infer<typeof inflationResultSchema>;
