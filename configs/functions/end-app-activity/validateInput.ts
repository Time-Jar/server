// deno-lint-ignore no-explicit-any
export function validateInput(input: any): string | null {
    if (typeof input.userId !== 'string' || !input.userId.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)) {
        return 'Invalid user ID';
    }

    if (typeof input.acceptance !== 'number' || !Number.isInteger(input.acceptance)) {
      return 'Invalid acceptance value';
    }
  
    if (typeof input.shouldBeBlocked !== 'boolean') {
      return 'Invalid should_be_blocked value';
    }
  
    if (typeof input.action !== 'number' || !Number.isInteger(input.action)) {
      return 'Invalid action value';
    }
  
    if (typeof input.eventTime !== 'number' || input.eventTime < 0 || new Date(input.eventTime) > new Date()) {
      return 'Invalid event time';
    }
  
    return null;
  }
  