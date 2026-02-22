import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductVariant {
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  weight?: number;
  attributes: Record<string, string>;
}

export interface IProduct extends Document {
  name: { fr: string; ar: string; en: string };
  slug: string;
  description: { fr: string; ar: string; en: string };
  shortDescription?: { fr?: string; ar?: string; en?: string };
  category: mongoose.Types.ObjectId;
  member: mongoose.Types.ObjectId;
  images: string[];
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  variants: IProductVariant[];
  weight?: number;
  tags: string[];
  attributes: Record<string, string>;
  averageRating: number;
  reviewCount: number;
  soldCount: number;
  isActive: boolean;
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IProductVariant>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    weight: { type: Number, min: 0 },
    attributes: { type: Map, of: String, default: {} },
  },
  { _id: true }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      fr: { type: String, required: true },
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: {
      fr: { type: String, required: true },
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    shortDescription: { fr: String, ar: String, en: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    member: { type: Schema.Types.ObjectId, ref: "User", required: true },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true },
    variants: { type: [VariantSchema], default: [] },
    weight: { type: Number, min: 0 },
    tags: [{ type: String }],
    attributes: { type: Map, of: String, default: {} },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    isFeatured: { type: Boolean, default: false },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

// Indexes
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ sku: 1 }, { unique: true });
ProductSchema.index({ category: 1, isActive: 1, isApproved: 1 });
ProductSchema.index({ member: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ averageRating: -1 });
ProductSchema.index({ soldCount: -1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index(
  { "name.fr": "text", "name.ar": "text", "name.en": "text",
    "description.fr": "text", "description.ar": "text", tags: "text" },
  { name: "product_text_search" }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
