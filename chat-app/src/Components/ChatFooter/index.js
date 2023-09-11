import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import Popover from "@mui/material/Popover";
import EmojiPicker from "emoji-picker-react";
import EmojiClickData from "emoji-picker-react";
// import { EmojiStyle, Emoji } from "emoji-picker-react";
import "./index.css";

const ChatFooter = (props) => {
    const { sendMsg } = props;
    const [newMsg, setNewMsg] = useState("");
    const [popOverAnchorEl, setPopOverAnchorEl] = useState(null);
    // const [selectedEmoji, setSelectedEmoji] = useState("");

    const popOverOpen = Boolean(popOverAnchorEl);
    const popOverId = popOverOpen ? "simple-popover" : undefined;

    const handleOpenPopover = (event) => {
        setPopOverAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setPopOverAnchorEl(null);
    };

    const onSend = () => {
        newMsg && sendMsg(newMsg);
        setNewMsg("");
    };

    const handleEnter = (e) => {
        if (e.code === "Enter") {
            onSend()
        }
    }

    const onChangeEmoji = (emojiData = EmojiClickData, event = MouseEvent) => {
        // setSelectedEmoji(emojiData.unified);
        // const emoji = <Emoji unified={emojiData.unified} emojiStyle={EmojiStyle.APPLE} size={18} />;
        setNewMsg((prev) => prev + emojiData.emoji);
    };

    return (
        <div className="chat-footer">
            <input
                value={newMsg}
                className="msg-input"
                placeholder="Type message"
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={handleEnter}
            />
            <div className="send-import-box">
                <IconButton aria-label="attachFile">
                    <AttachFileIcon sx={{ color: "gray", fontSize: "25px", transform: "rotate(45deg)" }} />
                </IconButton>
                <IconButton aria-label="camera">
                    <CameraAltOutlinedIcon sx={{ color: "gray", fontSize: "25px" }} />
                </IconButton>
                <IconButton aria-label="insertEmoji" onClick={handleOpenPopover}>
                    <InsertEmoticonOutlinedIcon sx={{ color: "gray", fontSize: "25px" }} />
                </IconButton>
                <Popover
                    id={popOverId}
                    open={popOverOpen}
                    anchorEl={popOverAnchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}>
                    <div className="emoji-picker-box">
                        <EmojiPicker
                            height="350px"
                            width="350px"
                            onEmojiClick={onChangeEmoji}
                            autoFocusSearch={false}
                        />
                    </div>
                </Popover>
                <IconButton aria-label="send" onClick={onSend}>
                    <SendIcon sx={{ color: "#48aafa", fontSize: "35px" }} />
                </IconButton>
            </div>
        </div>
    );
};

export default ChatFooter;
