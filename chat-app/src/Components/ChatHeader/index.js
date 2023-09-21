import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ChatContext from "../../Context/ChatContext";
import { stringAvatar } from "../../helpers/ReusedMethods";
import "./index.css";

const ChatHeader = (props) => {
    const { roomParticipants } = props;
    const first3 = roomParticipants.slice(0, 3);
    const remining = roomParticipants.slice(3, roomParticipants.length);

    const headerRoomAvatarSize = {
        width: "58px",
        height: "58px",
    };

    return (
        <ChatContext.Consumer>
            {(value) => {
                const { activeRoomDetails } = value;

                return (
                    <div className="chat-header-box">
                        <div className="room-name-avatar-box">
                            {activeRoomDetails.roomAvatar ? (
                                <Avatar
                                    alt=""
                                    src={activeRoomDetails.roomAvatar}
                                    sx={{ width: "58px", height: "58px" }}
                                />
                            ) : (
                                <Avatar {...stringAvatar(activeRoomDetails.roomName, headerRoomAvatarSize)} />
                            )}

                            <div className="room-name-box">
                                <h2 className="room-name">{activeRoomDetails.roomName}</h2>
                                <ul className="participants-list">
                                    {first3.map((e, index) => (
                                        <li className="participant" key={e.userId}>
                                            {index === first3.length - 1 && remining.length === 0
                                                ? e.name
                                                : `${e.name},`}
                                            {/* {remining.length !== 0 ? `${e.name},` : e.name} */}
                                        </li>
                                    ))}
                                    {remining.length !== 0 ? `${remining.length} more...` : null}
                                </ul>
                            </div>
                        </div>
                        <div className="search-notification-box">
                            <IconButton>
                                <SearchRoundedIcon className="header-icons" />
                            </IconButton>
                            <IconButton>
                                <FavoriteBorderRoundedIcon className="header-icons" />
                            </IconButton>
                            <IconButton>
                                <NotificationsNoneRoundedIcon className="header-icons" />
                            </IconButton>
                        </div>
                    </div>
                );
            }}
        </ChatContext.Consumer>
    );
};

export default ChatHeader;
