import Avatar from "@mui/material/Avatar";
import "./index.css";
import { stringAvatar } from "../../helpers/ReusedMethods";

const MsgItem = (props) => {
    const { msgDetails, userData } = props;
    const { id, msgText, timeStamp, senderName, senderId, userProfileImg } = msgDetails;
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const msgDate = new Date(timeStamp?.seconds * 1000);

    const msgAvatarSize = {
        width: "45px",
        height: "45px",
        fontSize: "14px",
        fontWeight: "400",
        letterSpacing: "1px",
        marginTop: "15px",
    };

    // formatted time string for incoming messages
    const incomingMsgTime = `${weekday[msgDate.getDay()]} ${
        msgDate.getHours().toString().length > 1 ? msgDate.getHours() : `0${msgDate.getHours()}`
    }:${msgDate.getMinutes().toString().length > 1 ? msgDate.getMinutes() : `0${msgDate.getMinutes()}`}`;

    // formatted time string for outgoing messages
    const outgoingMsgTime = `${
        msgDate.getHours().toString().length > 1 ? msgDate.getHours() : `0${msgDate.getHours()}`
    }:${msgDate.getMinutes().toString().length > 1 ? msgDate.getMinutes() : `0${msgDate.getMinutes()}`}`;

    return userData.userId !== senderId ? (
        // incoming msg starts
        <li key={id} className="msg-item">
            {userProfileImg ? (
                <Avatar alt="" src={userProfileImg} sx={{ width: "50px", height: "50px", marginTop: "15px" }} />
            ) : (
                <Avatar {...stringAvatar(senderName, msgAvatarSize)} />
            )}
            <div className="username-time-msg-box">
                <div className="username-time-box">
                    <p className="user-name">{senderName}</p>
                    <p className="msg-time">{incomingMsgTime}</p>
                </div>
                <p className="msg-text">{msgText}</p>
            </div>
        </li>
    ) : (
        // incoming msg ends

        // outgoing msg starts
        <li key={id} className="curr-user-msg-item">
            <div className="time-msg-box">
                <p className="curr-user-msg-time">{outgoingMsgTime}</p>
                <p className="curr-user-msg-text">{msgText}</p>
            </div>
            {userProfileImg ? (
                <Avatar alt="" src={userProfileImg} sx={{ width: "50px", height: "50px", marginTop: "15px" }} />
            ) : (
                <Avatar {...stringAvatar(senderName, msgAvatarSize)} />
            )}
        </li>
        // outgoing msg ends
    );
};

export default MsgItem;
