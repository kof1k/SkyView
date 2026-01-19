// Storage interface for in-memory data
// Not used in this project since weather data comes from external APIs
// Kept for potential future user favorites/settings storage

export interface IStorage {
  // Add storage methods as needed
}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
