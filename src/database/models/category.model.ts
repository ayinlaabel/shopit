// Import mongoose and its types
import mongoose, { Schema, Document } from 'mongoose';
import { category } from '../../interface';

const categorySchema: Schema<category> = new Schema<category>({
  name: String,
  parent: String,
  // other fields...
});

// Create the 'Category' model based on the schema
const Categories = mongoose.model<category>('Categories', categorySchema);

export default Categories;
