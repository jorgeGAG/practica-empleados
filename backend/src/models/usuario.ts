import { Schema, model } from 'mongoose';

const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Usuario = model('Usuario', usuarioSchema);
export default Usuario;
