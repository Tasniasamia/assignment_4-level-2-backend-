export interface MealType {
    id?: string;
  
    name: string;
    description?: string;
  
    price: number;
    image?: string;
  
    isAvailable: boolean;
  
    providerId: string;
    categoryId: string;
  
    dietaryPreferences: string; 
  
    rating: number;
  
    createdAt: Date;
    updatedAt: Date;
  }
  