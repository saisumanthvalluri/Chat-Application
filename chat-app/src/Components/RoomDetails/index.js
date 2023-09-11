// import ChatContext from "../../Context/ChatContext";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { onSnapshot, collection, orderBy, query } from "firebase/firestore";
import { db } from "../../Firebase-config";
import RoomParticipantItem from "../RoomParticipantItem";
import "./index.css";

const Roomdetails = (props) => {
    const { activeRoomDetails } = props;
    const [userData, setUserData] = useState({});
    const [roomParticipants, setRoomParticipants] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [tab, setTab] = useState(0);

    const { roomId, roomProfileAvatar, roomName, createdAt, adminId } = activeRoomDetails;
    const roomCreatedDate = new Date(createdAt?.seconds * 1000);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user_info"));
        setUserData(userInfo);
        const participantsQuery = query(collection(db, `rooms/${roomId}/participants`), orderBy("joinedAt", "asc"));
        const unsubParticipants = onSnapshot(participantsQuery, (snapshot) => {
            let participants = [];
            snapshot.docs.forEach((e) =>
                participants.push({
                    ...e.data(),
                    userId: e.id,
                })
            );
            setRoomParticipants(participants);
        });

        return () => {
            unsubParticipants();
        };
    }, [roomId]);

    // getting room text logo
    const roomNamePair = roomName?.split(" ");
    const roomTextLogo = roomName
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

    const stringAvatar = (name) => {
        return {
            sx: {
                bgcolor: stringToColor(name),
                width: "200px",
                height: "200px",
                fontSize: "50px",
            },
            children: roomTextLogo,
        };
    };

    const handleNavBar = (event, newValue) => {
        setTab(newValue);
    };

    const handle = (copyText) => {
        navigator.clipboard.writeText(copyText.toString());
    };

    const renderOverView = () => {
        return (
            <div className="room-overView-box">
                {roomProfileAvatar ? (
                    <Avatar alt="" src={roomProfileAvatar} sx={{ width: "200px", height: "200px" }} />
                ) : (
                    <Avatar {...stringAvatar(roomName)} />
                )}
                <div className="room-detil-item-box">
                    <h2 className="room-name">{roomName}</h2>
                    {userData.userId === adminId ? (
                        <Tooltip TransitionComponent={Zoom} title="Edit Room Name">
                            <IconButton onClick={() => handle("hellooo")}>
                                <EditIcon className="header-icons" />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip TransitionComponent={Zoom} title="Only admin can change room info">
                            <IconButton>
                                <InfoOutlinedIcon className="header-icons" />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
                <div className="room-detil-item-box">
                    <div>
                        <label className="label">Created</label>
                        <p>{`${roomCreatedDate.toLocaleDateString()} ${roomCreatedDate.toLocaleTimeString()}`}</p>
                    </div>
                </div>
            </div>
        );
    };

    // const handleSearch = (e) => {
    //     if (e.code === "Enter") {
    //     }
    // };

    const renderParticipants = () => {
        let updatedParticipants;
        if (searchInput !== "") {
            updatedParticipants = roomParticipants.filter((e) =>
                e.name.toLowerCase().includes(searchInput.toLocaleLowerCase())
            );
        } else {
            updatedParticipants = roomParticipants;
        }
        return (
            <div className="room-participants-box">
                <div className="search-box">
                    <SearchRoundedIcon className="search-icon" />
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        // onKeyDown={handleSearch}
                        type="search"
                        className="search-input"
                        placeholder="Search participants"
                    />
                </div>
                <ul className="room-participants-list">
                    {updatedParticipants.map((e) => (
                        <RoomParticipantItem participantDetails={e} userData={userData} adminId={adminId} />
                    ))}
                </ul>
            </div>
        );
    };

    const renderEncryption = () => (
        <div className="room-encryption-box">
            <HttpsOutlinedIcon className="room-encryption-icon" />
            <p className="encryption-description">
                Chat Together secures your conversations with end-to-end encryption.
            </p>
            <p className="encryption-description">
                Your messsages and calls stay between you and the people and business you choose. Not even Chat Together
                can read or listen to them.
            </p>
            <a href="#\" className="room-encryption-learn-more">
                Learn more
            </a>
        </div>
    );

    const renderRespectiveTab = () => {
        switch (tab) {
            case 0:
                return renderOverView();
            case 1:
                return renderParticipants();
            case 2:
                return renderEncryption();
            default:
                break;
        }
    };

    return (
        <div className="room-details-container">
            {roomName ? (
                <div className="room-avatar-name-created-description-box">
                    <Tabs
                        variant="fullWidth"
                        value={tab}
                        onChange={handleNavBar}
                        aria-label="icon label tabs example"
                        className="room-details-nav">
                        <Tab icon={<InfoOutlinedIcon />} label="Overview" />
                        <Tab
                            icon={
                                <Badge badgeContent={roomParticipants?.length} color="primary">
                                    <GroupsRoundedIcon />
                                </Badge>
                            }
                            label="Participants"
                        />
                        <Tab icon={<HttpsOutlinedIcon />} label="Encryption" />
                    </Tabs>
                    {renderRespectiveTab()}
                </div>
            ) : (
                <h4>Room Details</h4>
            )}
        </div>
    );
};

export default Roomdetails;
