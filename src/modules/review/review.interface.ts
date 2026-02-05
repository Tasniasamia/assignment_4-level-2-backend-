export interface reviewType {
  orderId:string,
  userId: string;
  mealId: string;
  rating: number;
  comment?: string;
}
export interface reviewUpdateType {
    id:string,
    userId: string;
    mealId: string;
    rating: number;
    comment?: string;
  }
export interface reviewUser {
  id: string;
  name: string;
  email: string;
  role: string | undefined;
  emailVerified: boolean;
}
