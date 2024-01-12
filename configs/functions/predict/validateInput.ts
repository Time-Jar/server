// deno-lint-ignore no-explicit-any
export function validatePredictionInput(input: any): string | null {
    if (typeof input.packageName !== 'string' || input.packageName.trim() === '') {
      return 'Invalid package name';
    }
  
    if (typeof input.userId !== 'string' || !input.userId.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)) {
      return 'Invalid user ID';
    }

    if (typeof input.startTime !== 'number' || input.startTime < 0) {
      return `Invalid startTime: ${input.startTime}`;
    }

    if (typeof input.locationId !== 'number') {
      return "Invalid locationId";
    }
  
    return null;
  }
  