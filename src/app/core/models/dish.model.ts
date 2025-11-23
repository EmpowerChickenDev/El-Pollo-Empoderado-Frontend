import { Category } from './category.model';

export interface Dish {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: Category;
  categoryId?: number;
}

export interface MenuResponse {
  categories: CategoryWithDishes[];
}

export interface CategoryWithDishes {
  category: Category;
  dishes: Dish[];
}