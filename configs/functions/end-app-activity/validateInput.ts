// deno-lint-ignore no-explicit-any
export function validateInput(input: any): string | null {
    if (typeof input.userId !== 'string' || !input.userId.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)) {
        return 'Invalid user ID';
    }

    if (typeof input.acceptance !== 'number' || !Number.isInteger(input.acceptance)) {
      return 'Invalid acceptance value';
    }
  
    if (typeof input.should_be_blocked !== 'boolean') {
      return 'Invalid should_be_blocked value';
    }
  
    if (typeof input.action !== 'number' || !Number.isInteger(input.action)) {
      return 'Invalid action value';
    }
  
    if (typeof input.app_usage_time !== 'number' || !Number.isInteger(input.app_usage_time) || input.app_usage_time < 0) {
      return 'Invalid app_usage_time value';
    }
  
    return null;
  }
  