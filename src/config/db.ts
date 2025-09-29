import mongoose from 'mongoose';

export async function connectDB(uri: string) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  const dbName = (mongoose.connection.db as any)?.databaseName;
  console.log(`MongoDB connected to ( db: ${dbName})`);
}