// deno-lint-ignore no-explicit-any
export function validateInput(input: any): string | null {
    if (!input.userId || !input.packageName || !input.eventTime || !input.locationId) {
      return 'Missing required parameters';
    }
  
    if (typeof input.packageName !== 'string' || input.packageName.trim() === '') {
      return 'Invalid package name';
    }
  
    if (typeof input.userId !== 'string' || !input.userId.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)) {
      return 'Invalid user ID';
    }
  
    if (typeof input.eventTime !== 'number' || input.eventTime < 0 || new Date(input.eventTime) > new Date()) {
      return 'Invalid event time';
    }
  
    if (typeof input.locationId !== 'number') {
      return 'Invalid location ID';
    }
  
    return null;
  }
  