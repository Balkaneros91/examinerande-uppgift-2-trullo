import { Schema, model, Types } from 'mongoose';
import type { InferSchemaType } from 'mongoose';


const TaskSchema = new Schema(
{
title: { type: String, required: true, trim: true },
description: { type: String, default: '' },
status: { type: String, enum: ['to-do','in progress','blocked','done'], default: 'to-do' },
assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
createdAt: { type: Date, default: Date.now },
finishedAt: { type: Date, default: null },
},
{ versionKey: false }
);


export type TaskDoc = InferSchemaType<typeof TaskSchema> & { _id: Types.ObjectId };
export default model('Task', TaskSchema);