import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  space_id: {
    type: String,
    required: false, // Optional for Cloudflare deployments
  },
  user_id: {
    type: String,
    required: true,
  },
  prompts: {
    type: [String],
    default: [],
  },
  title: {
    type: String,
    required: false,
  },
  pages: {
    type: Array,
    default: [],
  },
  // Cloudflare deployment fields
  cloudflare_subdomain: {
    type: String,
    required: false,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  cloudflare_deployment_id: {
    type: String,
    required: false,
  },
  cloudflare_url: {
    type: String,
    required: false,
  },
  deployment_type: {
    type: String,
    enum: ['huggingface', 'cloudflare'],
    default: 'huggingface',
  },
  _createdAt: {
    type: Date,
    default: Date.now,
  },
  _updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
