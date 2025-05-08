import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Message = ({ message }) => {
  const scroll = useRef();
  const { authUser, selectedUser } = useSelector((store) => store.user);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const getMediaPreview = (url) => {
    const extension = url.split(".").pop().split("?")[0].toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return <img src={url} alt="sent media" height="100px" width="100px" className="max-w-xs rounded" />;
    }

    if (["mp4", "webm", "ogg"].includes(extension)) {
      return (
        <video controls className="max-w-xs rounded">
          <source src={url} type={`video/${extension}`} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (["mp3", "wav", "ogg"].includes(extension)) {
      return (
        <audio controls className="w-full">
          <source src={url} type={`audio/${extension}`} />
          Your browser does not support the audio tag.
        </audio>
      );
    }

    if (["pdf"].includes(extension)) {
      return (
        <div>
          <img
            src={url} // Cloudinary renders first page of PDF as an image
            alt="PDF Preview"
            className="w-32 h-auto border rounded shadow-sm"
          />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm"
          >
            View Full PDF
          </a>
        </div>
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {url}
      </a>
    );
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };


  return (
    <div
      ref={scroll}
      className={`chat ${
        message?.senderId === authUser?._id ? "chat-end" : "chat-start"
      }`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={
              message?.senderId === authUser?._id
                ? authUser?.profilePhoto
                : selectedUser?.profilePhoto
            }
          />
        </div>
      </div>
      <div className="chat-header">
        <time className="text-xs opacity-50 text-white">12:45</time>
      </div>
      <div
        className={`chat-bubble ${
          message?.senderId !== authUser?._id ? "bg-gray-200 text-black" : ""
        }`}
      >
        {isValidUrl(message?.message)
          ? getMediaPreview(message.message)
          : message.message}
      </div>
    </div>
  );
};

export default Message;
