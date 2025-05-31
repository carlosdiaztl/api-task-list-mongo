// src/models/user.model.ts (Modelo de Mongoose - Representación de la Entidad de Dominio para Persistencia)

import mongoose, { Schema, Document, Model } from 'mongoose';

// ====================================================================
// 1. Interfaz para el Documento (La "firma" de tu entidad de dominio)
//    Define las propiedades que tendrá tu documento de usuario en la base de datos.
// ====================================================================

export interface IUser extends Document {
  email: string;
  password: string; // Aquí se asume que la contraseña ya estará HASHEADA antes de llegar a este modelo.
  nombre?: string;
  createdAt?: Date; // Mongoose añade estos con timestamps: true
  updatedAt?: Date;
}

// ====================================================================
// 2. Definición del Esquema (Schema Definition)
//    Esto es la "blueprint" de cómo MongoDB almacenará los documentos de usuario.
// ====================================================================

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Asegura que no haya emails duplicados
      lowercase: true, // Guarda el email en minúsculas
      trim: true,      // Elimina espacios en blanco
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      // Nota: Las validaciones de longitud o complejidad de la contraseña
      // generalmente se harían en la capa de servicio o en el DTO/VO de entrada.
      // Aquí, el campo 'password' simplemente espera el hash.
    },
    nombre: {
      type: String,
      trim: true,
    },
  },
  {
    // Opciones del esquema: Añade campos createdAt y updatedAt automáticamente
    timestamps: true,
    // Opcional: Especifica el nombre de la colección si no quieres el pluralizado por defecto de Mongoose
    collection: 'personas',
  }
);

// ====================================================================
// 3. Creación y Exportación del Modelo
//    Este es el Mongoose Model que importarás en tu capa de Repositorio
//    para realizar operaciones CRUD directas en la base de datos.
// ====================================================================

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);