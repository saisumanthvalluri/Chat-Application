import Avatar from "@mui/material/Avatar";
import "./index.css";

const RoomParticipantItem = (props) => {
    const { participantDetails, userData, adminId } = props;
    const { userId, name, about, joinedAt, profileImageUrl } = participantDetails;

    // getting room text logo
    const roomNamePair = name?.split(" ");
    const participantTextLogo = name
        ? roomNamePair?.length > 1
            ? `${roomNamePair[0][0].toUpperCase()}${roomNamePair[roomNamePair?.length - 1][0].toUpperCase()}`
            : roomNamePair[0][0].toUpperCase()
        : null;

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

    const stringAvatar = (val) => {
        return {
            sx: {
                bgcolor: stringToColor(val),
                width: "50px",
                height: "50px",
                fontSize: "16px",
                letterSpacing: "2px",
            },
            children: participantTextLogo,
        };
    };

    return (
        <li className="room-participant-item" key={userId}>
            {profileImageUrl ? (
                <Avatar src={profileImageUrl} sx={{width: '50px', height: '50px'}} />
            ) : (
                <Avatar {...stringAvatar(name)} />
            )}

            <div className="participant-name-about-box">
                <h3 className="participant-name">{userData.userId === userId ? "You" : name}</h3>
                <p className="participant-about">{about}</p>
            </div>
            {adminId === userId && <p className="admin-text">Admin</p>}
        </li>
    );
};

export default RoomParticipantItem;
