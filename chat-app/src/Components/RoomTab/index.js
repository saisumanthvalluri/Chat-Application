import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import ChatContext from "../../Context/ChatContext";
// import { formatDistanceToNow } from "date-fns";
import "./index.css";

const RoomTab = (props) => {
    const { roomDetails } = props;
    const [userData, setUserData] = useState({});
    // console.log(userData, "999");
    const { roomName, roomId, roomProfileAvatar, createdAt, lastMsg } = roomDetails;
    const { msgText, timeStamp, senderId, senderName } = lastMsg;
    const lastMsgDate = new Date(timeStamp?.seconds * 1000);

    // getting room text logo
    const roomNamePair = roomDetails.roomName.split(" ");
    const roomTextLogo =
        roomNamePair.length > 1
            ? `${roomNamePair[0][0].toUpperCase()}${roomNamePair[roomNamePair.length - 1][0].toUpperCase()}`
            : roomNamePair[0][0].toUpperCase();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user_info"));
        setUserData(userInfo);
    }, []);

    // random color generator based on the room name
    const stringToColor = (string) => {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = "#";

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    };

    const stringAvatar = (name) => {
        return {
            sx: {
                bgcolor: stringToColor(name),
                width: "60px",
                height: "60px",
            },
            children: roomTextLogo,
        };
    };

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
                        {roomProfileAvatar ? (
                            <Avatar alt="" src={roomProfileAvatar} sx={{ width: "60px", height: "60px" }} />
                        ) : (
                            <Avatar {...stringAvatar(roomName)} />
                        )}

                        <div className="roomname-msgtime-msg-box">
                            <div className="roomname-msgtime-box">
                                <p className="room-name">{roomName}</p>
                                <p className="msg-time">{lastMsgTime}</p>
                            </div>
                            <p className="last-msg">
                                {userData.userId === senderId
                                    ? `You: ${msgText.length > 38 ? `${msgText.substr(0, 38)}..` : msgText}`
                                    : `${senderName}: ${msgText.length > 25 ? `${msgText.substr(0, 28)}..` : msgText}`}
                            </p>
                        </div>
                    </li>
                );
            }}
        </ChatContext.Consumer>
    );
};

export default RoomTab;
