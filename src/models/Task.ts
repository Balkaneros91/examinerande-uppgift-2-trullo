import { Schema, model, type Types, type InferSchemaType } from 'mongoose';

const TaskSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        status: { type: String, enum: ['to-do','in progress','blocked','done'], default: 'to-do' },
        assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        finishedAt: { type: Date, default: null },
    },
    { timestamps: true, versionKey: false }
);

type Inferred = InferSchemaType<typeof TaskSchema>;

export type TaskType = 
    Omit<Inferred, 'assignedTo' | 'finishedAt'> & {
        _id: Types.ObjectId;
        assignedTo: Types.ObjectId | null;
        finishedAt: Date | null;
    };

export type TaskStatus = TaskType['status'];

export default model<TaskType>('Task', TaskSchema);