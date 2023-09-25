import Avatar from "@mui/material/Avatar";
import { stringAvatar } from "../../helpers/ReusedMethods";
import { sizeForSearRoomItemUserAvatar } from "../AppConstants";
import "./index.css";

const RoomParticipantItem = (props) => {
    const { participantDetails, userData, adminId } = props;
    const { userId, name, about, profileImageUrl } = participantDetails;

    return (
        <li className="room-participant-item" key={userId}>
            {profileImageUrl ? (
                <Avatar src={profileImageUrl} sx={{ width: "50px", height: "50px" }} />
            ) : (
                <Avatar {...stringAvatar(name, sizeForSearRoomItemUserAvatar)} />
            )}

            <div className="participant-name-about-box">
                <h3 className="participant-name">{userData.userId === userId ? "You" : name}</h3>
                <p className="participant-about">{about}</p>
            </div>
            {adminId === userId && <p className="admin-text">Room admin</p>}
        </li>
    );
};

export default RoomParticipantItem;
