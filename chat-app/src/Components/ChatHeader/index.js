import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ChatContext from "../../Context/ChatContext";

import "./index.css";

const ChatHeader = (props) => {
    const { roomParticipants } = props;
    const first3 = roomParticipants.slice(0, 3);
    const remining = roomParticipants.slice(3, roomParticipants.length);

    return (
        <ChatContext.Consumer>
            {(value) => {
                const { activeRoomDetails } = value;
                const roomNamePair = activeRoomDetails.roomName.split(" ");
                const roomTextLogo =
                    roomNamePair.length > 1
                        ? `${roomNamePair[0][0].toUpperCase()}${roomNamePair[roomNamePair.length - 1][0].toUpperCase()}`
                        : roomNamePair[0][0].toUpperCase();

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
                            width: "58px",
                            height: "58px",
                        },
                        children: roomTextLogo,
                    };
                };

                return (
                    <div className="chat-header-box">
                        <div className="room-name-avatar-box">
                            {activeRoomDetails.roomProfileAvatar ? (
                                <Avatar
                                    alt=""
                                    src={activeRoomDetails.roomProfileAvatar}
                                    sx={{ width: "58px", height: "58px" }}
                                />
                            ) : (
                                <Avatar {...stringAvatar(activeRoomDetails.roomName)} />
                            )}

                            <div className="room-name-box">
                                <h2 className="room-name">{activeRoomDetails.roomName}</h2>
                                <ul className="participants-list">
                                    {first3.map((e, index) => (
                                        <li className="participant" key={e.uerId}>
                                            {remining.length !== 0 ? `${e.name}, ` : e.name}
                                        </li>
                                    ))}
                                    {remining.length !== 0 ? `${remining.length} more...` : null}
                                </ul>
                            </div>
                        </div>
                        <div className="search-notification-box">
                            {/* <div class="search-box">
                                <button class="btn-search">
                                    <SearchRoundedIcon sx={{ margin: "0 0 5px 15px" }} />
                                    <IconButton sx={{ margin: "0 0 10px 15px" }} className="lll">
                                        <SearchRoundedIcon />
                                    </IconButton>
                                </button>
                                <input type="text" class="input-search" placeholder="Click enter to search room" />
                            </div> */}
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
