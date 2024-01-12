import { validatePredictionInput } from "../predict/validateInput.ts";

// deno-lint-ignore no-explicit-any
export function validateReportInput(input: any): string | null {
    const error = validatePredictionInput(input)
    if (error) {
      return error
    }

    if (typeof input.acceptanceId !== 'number' || !Number.isInteger(input.acceptanceId)) {
        return 'Invalid acceptanceId';
    }

    if (typeof input.shouldBeBlocked !== 'number') {
      return `Invalid shouldBeBlocked: ${input.shouldBeBlocked}`;
    }

    if (typeof input.actionId !== 'number' || !Number.isInteger(input.actionId)) {
      return `Invalid actionId ${input.actionId}`;
    }

    if (typeof input.appUsageTime !== 'number' || !Number.isFinite(input.appUsageTime)) {
      return 'Invalid appUsageTime';
    }

    return null;
}
  