// Simple in-memory storage for temporary CV data
const tempStorage = new Map<string, any>();

export function storeTempData(id: string, data: any): void {
  tempStorage.set(id, data);
  // Clean up after 5 minutes
  setTimeout(() => {
    tempStorage.delete(id);
  }, 5 * 60 * 1000);
}

export function getTempData(id: string): any | null {
  return tempStorage.get(id) || null;
}

export function removeTempData(id: string): void {
  tempStorage.delete(id);
} 