import Avatar from "@mui/material/Avatar";
import "./index.css";

const MsgItem = (props) => {
    const { msgDetails, userData } = props;
    const { id, msgText, timeStamp, senderName, senderId, userProfileImg } = msgDetails;
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const msgDate = new Date(timeStamp?.seconds * 1000);

    // formatted time string for incoming messages
    const incomingMsgTime = `${weekday[msgDate.getDay()]} ${
        msgDate.getHours().toString().length > 1 ? msgDate.getHours() : `0${msgDate.getHours()}`
    }:${msgDate.getMinutes().toString().length > 1 ? msgDate.getMinutes() : `0${msgDate.getMinutes()}`}`;

    // formatted time string for outgoing messages
    const outgoingMsgTime = `${
        msgDate.getHours().toString().length > 1 ? msgDate.getHours() : `0${msgDate.getHours()}`
    }:${msgDate.getMinutes().toString().length > 1 ? msgDate.getMinutes() : `0${msgDate.getMinutes()}`}`;

    // if no user avatar then show username first last word's letters
    const userNameParts = senderName.split(" ");
    const userMsgAvatar =
        userNameParts.length > 1
            ? `${userNameParts[0][0].toUpperCase()}${userNameParts[userNameParts.length - 1][0].toUpperCase()}`
            : userNameParts[0][0].toUpperCase();

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
                width: "40px",
                height: "40px",
                fontSize: "15px",
                fontWeight: "400",
                letterSpacing: "1px",
                marginTop: "15px",
            },
            children: userMsgAvatar,
        };
    };

    return userData.userId !== senderId ? (
        // incoming msg starts
        <li key={id} className="msg-item">
            {/* <div className="user-avatar-box">{userMsgAvatar}</div> */}
            {userProfileImg ? (
                <Avatar alt="" src={userProfileImg} sx={{ width: "45px", height: "45px", marginTop: "15px" }} />
            ) : (
                <Avatar {...stringAvatar(senderName)} />
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
            {/* <div className="curr-user-avatar-box">{userMsgAvatar}</div> */}
            {userProfileImg ? (
                <Avatar alt="" src={userProfileImg} sx={{ width: "45px", height: "45px", marginTop: "15px" }} />
            ) : (
                <Avatar {...stringAvatar(senderName)} />
            )}
        </li>
        // outgoing msg ends
    );
};

export default MsgItem;
