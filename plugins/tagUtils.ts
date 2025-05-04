declare global {
    var tags: Set<string> | undefined;
  }
  
  export function tag(tagName: string): void {
    if (!global.tags) {
      global.tags = new Set();
    }
    global.tags.add(tagName);
  }
  
  export function getTags(): string[] {
    return global.tags ? Array.from(global.tags) : [];
  }