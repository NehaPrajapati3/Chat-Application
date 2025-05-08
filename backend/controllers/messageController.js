import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        let {message} = req.body;
        console.log("req message ", req.body)
        console.log("req files ", req.files)

       if (req.files["file"]) {
         const filePath = req.files["file"][0].path;
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: "uploads/ChatFiles/files",
          resource_type:"auto",
        });

         console.log("resource_type ", uploadResult.resource_type);
         const finalUrl = uploadResult.secure_url.replace(
           "/image/",
           `/${uploadResult.resource_type}/`
         );

         message = finalUrl;
         fs.unlinkSync(filePath); // Delete local file after upload
       }

        let gotConversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };
        

        await Promise.all([gotConversation.save(), newMessage.save()]);
         
        // SOCKET IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        return res.status(201).json({
            newMessage
        })
    } catch (error) {
        console.log(error);
    }
}
export const getMessage = async (req,res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]}
        }).populate("messages"); 
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        console.log(error);
    }
}