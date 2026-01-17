import TryCatch from "../config/TryCatch.js";
import { Chat } from "../models/Chat.js";
export const createNewChat = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;
    if (!otherUserId) {
        res.status(400).json({ message: "otherUserId is required" });
        return;
    }
    const existingChat = await Chat.findOne({
        users: { $all: [userId, otherUserId], $size: 2 },
    });
    if (existingChat) {
        res.json({
            message: "Chat already exists",
            chatId: existingChat._id,
        });
        return;
    }
    res.status(201).json({
        message: "New chat created",
        chatId: (await Chat.create({ users: [userId, otherUserId] }))._id,
    });
});
//# sourceMappingURL=chat.js.map