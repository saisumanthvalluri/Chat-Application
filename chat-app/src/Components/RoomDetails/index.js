import { useEffect, useState } from "react";
import { onSnapshot, collection, orderBy, query } from "firebase/firestore";
import { db } from "../../Firebase-config";
import { stringAvatar } from "../../helpers/ReusedMethods";
import { sizeForRoomDetailsAvatar } from "../AppConstants";
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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import RoomParticipantItem from "../RoomParticipantItem";
import "./index.css";

const Roomdetails = (props) => {
    const { activeRoomDetails, handleOpenSnackbar } = props;
    const [userData, setUserData] = useState({});
    const [roomParticipants, setRoomParticipants] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [tab, setTab] = useState(0);
    const [roomExitModalOpen, setRoomExitModalOpen] = useState(false);
    const [roomReportModalOpen, setRoomReportModalOpen] = useState(false);

    const { roomId, roomAvatar, roomName, createdAt, about, adminDetails } = activeRoomDetails;
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

    const handleNavBar = (event, newValue) => {
        setTab(newValue);
    };

    const handleCopy = (copyText) => {
        navigator.clipboard.writeText(copyText.toString());
        handleOpenSnackbar(true, "Room Id Copied✔", "success");
    };

    const onExitRoom = () => {
        setRoomExitModalOpen(false);
    };

    const onReportRoom = () => {
        setRoomReportModalOpen(false);
    };

    const renderOverView = () => {
        return (
            <div className="room-overView-box">
                {roomAvatar ? (
                    <Avatar alt="" src={roomAvatar} sx={{ width: "170px", height: "170px" }} />
                ) : (
                    <Avatar {...stringAvatar(roomName, sizeForRoomDetailsAvatar)} />
                )}
                <div className="room-detil-item-box">
                    <h2 className="room-name">{roomName}</h2>
                    {userData.userId === adminDetails.adminId ? (
                        <Tooltip TransitionComponent={Zoom} title="Edit Room Name">
                            <IconButton color="primary">
                                <EditIcon className="header-icons" />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip TransitionComponent={Zoom} title="Only admin can change room info">
                            <IconButton color="primary">
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
                <div className="room-detil-item-box">
                    <div>
                        <label className="label">About</label>
                        <p>{about}</p>
                    </div>
                    {userData.userId === adminDetails.adminId ? (
                        <Tooltip TransitionComponent={Zoom} title="Edit About">
                            <IconButton color="primary" sx={{ alignSelf: "flex-start" }}>
                                <EditIcon className="header-icons" />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip TransitionComponent={Zoom} title="Only admin can change room info">
                            <IconButton color="primary" sx={{ alignSelf: "flex-start" }}>
                                <InfoOutlinedIcon className="header-icons" />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
                <div className="room-detil-item-box">
                    <div>
                        <label className="label">Disappearing messsages</label>
                        <p>Off</p>
                    </div>
                    {userData.userId === adminDetails.adminId ? (
                        <Tooltip TransitionComponent={Zoom} title="Edit disappearing messages">
                            <IconButton color="primary" sx={{ alignSelf: "flex-start" }}>
                                <EditIcon className="header-icons" />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip TransitionComponent={Zoom} title="Only admin can change room info">
                            <IconButton color="primary" sx={{ alignSelf: "flex-start" }}>
                                <InfoOutlinedIcon className="header-icons" />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
                <label className="roomId-label">Room Id</label>
                <div className="room-id-box">
                    <strong className="room-id">{roomId}</strong>
                    <Tooltip TransitionComponent={Zoom} title="Copy room ID">
                        <IconButton color="primary" onClick={() => handleCopy(roomId)}>
                            <ContentCopyIcon />
                        </IconButton>
                    </Tooltip>
                </div>

                <div className="room-exit-report-btn-box">
                    <button className="room-btn exit" onClick={() => setRoomExitModalOpen(true)}>
                        Exit Room
                    </button>
                    <Modal
                        open={roomExitModalOpen}
                        onClose={() => setRoomExitModalOpen(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description">
                        <Box className="room-details-modal-box">
                            <h2 className="modal-question">{`Exit "${roomName}" room?`}</h2>
                            <p className="modal-description">
                                Only room admin will be notified that you left the room.
                            </p>
                            <div className="modal-btn-box">
                                <button className="modal-btn exit" onClick={onExitRoom}>
                                    Exit
                                </button>
                                <button className="modal-btn cancel" onClick={() => setRoomExitModalOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </Box>
                    </Modal>
                    <button className="room-btn report" onClick={() => setRoomReportModalOpen(true)}>
                        Report Room
                    </button>
                    <Modal
                        open={roomReportModalOpen}
                        onClose={() => setRoomReportModalOpen(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description">
                        <Box className="room-details-modal-box">
                            <h2 className="modal-heading">
                                Report spam and leave this group? If you report and leave, this chat's history will also
                                be deleted.
                            </h2>
                            <div className="modal-btn-box">
                                <button className="modal-btn exit" onClick={onReportRoom}>
                                    Report and leave
                                </button>
                                <button className="modal-btn cancel" onClick={() => setRoomReportModalOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </Box>
                    </Modal>
                </div>
            </div>
        );
    };

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
                        <RoomParticipantItem
                            key={e.userId}
                            participantDetails={e}
                            userData={userData}
                            adminId={adminDetails.adminId}
                        />
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
                        sx={{ flexShrink: 0 }}
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
