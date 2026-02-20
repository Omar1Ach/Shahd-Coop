import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: { fr: string; ar: string; en: string };
  slug: string;
  description?: { fr?: string; ar?: string; en?: string };
  image?: string;
  icon?: string;
  parent?: mongoose.Types.ObjectId;
  order: number;
  isActive: boolean;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      fr: { type: String, required: true },
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: {
      fr: String,
      ar: String,
      en: String,
    },
    image: { type: String },
    icon: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ parent: 1 });
CategorySchema.index({ isActive: 1, order: 1 });

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
