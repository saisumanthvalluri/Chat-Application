import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import ChatContext from "../../Context/ChatContext";
import { stringAvatar } from "../../helpers/ReusedMethods";
import { sizeForRoomTabAvatar } from "../AppConstants";
import "./index.css";

const RoomTab = (props) => {
    const { roomDetails } = props;
    const [userData, setUserData] = useState({});
    // console.log(userData, "999");
    const { roomName, roomId, roomAvatar, lastMsg } = roomDetails;
    const { msgText, timeStamp, senderId, senderName } = lastMsg;
    const lastMsgDate = new Date(timeStamp?.seconds * 1000);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user_info"));
        setUserData(userInfo);
    }, []);

    let lastMsgTime;
    if (new Date().toDateString() === lastMsgDate.toDateString()) {
        // if date is equal to today then show as 'hours:minutes'
        lastMsgTime = `${
            lastMsgDate.getHours().toString().length > 1 ? lastMsgDate.getHours() : `0${lastMsgDate.getHours()}`
        }:${
            lastMsgDate.getMinutes().toString().length > 1 ? lastMsgDate.getMinutes() : `0${lastMsgDate.getMinutes()}`
        }`;
    } else {
        var yesterday = new Date(Date.now() - 864e5); // 864e5 == 86400000 == 24*60*60*1000
        if (yesterday.toDateString() === lastMsgDate.toDateString()) {
            // if date is equal to yesterday then show as 'yesterday'
            lastMsgTime = "Yesterday";
        } else {
            // else show the date as 'dd/mm/yyyy'
            lastMsgTime = lastMsgDate.toLocaleDateString().replace(/\//g, "-");
        }
    }

    return (
        <ChatContext.Consumer>
            {(value) => {
                const { activeRoomDetails, setActiveRoomDetails } = value;
                const roomTabClassName = activeRoomDetails.roomId === roomId ? "room-tab active" : "room-tab";

                const onChangeRoom = () => {
                    setActiveRoomDetails(roomDetails);
                };

                return (
                    <li className={roomTabClassName} key={roomId} onClick={onChangeRoom}>
                        {roomAvatar ? (
                            <Avatar alt="" src={roomAvatar} sx={{ width: "60px", height: "60px" }} />
                        ) : (
                            <Avatar {...stringAvatar(roomName, sizeForRoomTabAvatar)} />
                        )}

                        <div className="roomname-msgtime-msg-box">
                            <div className="roomname-msgtime-box">
                                <p className="room-name">{roomName}</p>
                                <p className="msg-time">{lastMsgTime}</p>
                            </div>
                            {senderId && (
                                <p className="last-msg">
                                    {userData.userId === senderId
                                        ? `You: ${msgText.length > 38 ? `${msgText.substr(0, 38)}..` : msgText}`
                                        : `${senderName}: ${
                                              msgText.length > 25 ? `${msgText.substr(0, 28)}..` : msgText
                                          }`}
                                </p>
                            )}
                        </div>
                    </li>
                );
            }}
        </ChatContext.Consumer>
    );
};

export default RoomTab;
