export interface UserSettings {
  id: string;
  userId: string;
  settings: {
    preferences:{ 
      language: "pt" | "en";
    }
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}