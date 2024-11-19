import { ProductImage, ProductOption } from "./product";
import { Database as GenerateDatabase } from "./supabase";

export type Database = GenerateDatabase & {
  public: {
    Tables: {
      products: {
        Row: {
          main_images: ProductImage | null;
          options: ProductOption;
        };
      };
    };
  };
};
