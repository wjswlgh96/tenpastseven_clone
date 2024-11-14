import { ProductImage, ProductionOption } from "./product";
import { Database as GenerateDatabase } from "./supabase";

export type Database = GenerateDatabase & {
  public: {
    Tables: {
      products: {
        Row: {
          images: ProductImage | null;
          options: ProductionOption[] | null;
        };
      };
    };
  };
};
