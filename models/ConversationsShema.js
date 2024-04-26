import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    conversationId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: false 
    },
    source: {
        type: String,
        enum: ['assistant', 'user'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Conversation = mongoose.model('Conversation', conversationShema);

export default Conversation;