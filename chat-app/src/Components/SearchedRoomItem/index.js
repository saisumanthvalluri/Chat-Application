import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../Firebase-config";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import ChatContext from "../../Context/ChatContext";
import { stringAvatar } from "../../helpers/ReusedMethods";
import "./index.css";

const SearchedRoomItem = (props) => {
    const { roomDetails, handleClosePopover } = props;
    const { roomName, roomId, roomAvatar } = roomDetails;
    const [modelOpen, setModelOpen] = useState(false);
    const [roomParticipants, setRoomParticipants] = useState([]);

    useEffect(() => {
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

    const onJoinRoom = () => {
        handleOpenModel();
    };

    const handleOpenModel = () => {
        setModelOpen(true);
    };

    const handleCloseModel = () => {
        setModelOpen(false);
    };

    return (
        <ChatContext.Consumer>
            {(value) => {
                const { setActiveRoomDetails, userData } = value;
                const sizeForUserAvatar = {
                    width: "50px",
                    height: "50px",
                    fontSize: "16px",
                };

                const joinRoom = async () => {
                    setActiveRoomDetails(roomDetails);
                    setModelOpen(false);
                    handleClosePopover();

                    // adding paricipant to the searched room
                    await setDoc(doc(db, `rooms/${roomId}/participants`, userData.userId), {
                        about: userData.about ? userData?.about : null,
                        name: userData?.userName,
                        profileImageUrl: userData.profileImageUrl ? userData?.profileImageUrl : null,
                        joinedAt: serverTimestamp(),
                    });

                    await setDoc(doc(db, `users/${userData.userId}/userRooms`, roomId), {
                        roomName,
                    });
                };

                return (
                    <>
                        <li className="searched-room-tab" key={roomId} onClick={onJoinRoom}>
                            {roomAvatar ? (
                                <Avatar alt="" src={roomAvatar} sx={{ width: "60px", height: "60px" }} />
                            ) : (
                                <Avatar {...stringAvatar(roomName)} />
                            )}
                            <p className="room-name">{roomName}</p>
                        </li>
                        <Modal
                            open={modelOpen}
                            onClose={handleCloseModel}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description">
                            <Box className="modal-box">
                                {roomAvatar ? (
                                    <Avatar alt="" src={roomAvatar} sx={{ width: "130px", height: "130px" }} />
                                ) : (
                                    <Avatar {...stringAvatar(roomName)} />
                                )}
                                <h3 className="join-room-name">{roomName}</h3>
                                <AvatarGroup total={roomParticipants.length}>
                                    {roomParticipants.map((e) =>
                                        e.avatar ? (
                                            <Tooltip TransitionComponent={Zoom} title={e.name} arrow>
                                                <Avatar
                                                    className="participants-avatar"
                                                    alt={e.name}
                                                    src={e.avatar}
                                                    sx={{ width: "50px", height: "50px" }}
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Tooltip TransitionComponent={Zoom} title={e.name} arrow>
                                                <Avatar
                                                    className="participants-avatar"
                                                    {...stringAvatar(e.name, sizeForUserAvatar)}
                                                />
                                            </Tooltip>
                                        )
                                    )}
                                </AvatarGroup>
                                <div className="join-room-btn-box">
                                    <button className="join-room-btn cancel" onClick={handleCloseModel}>
                                        Cancel
                                    </button>
                                    <button className="join-room-btn join" onClick={joinRoom}>
                                        Join Room
                                    </button>
                                </div>
                            </Box>
                        </Modal>
                    </>
                );
            }}
        </ChatContext.Consumer>
    );
};

export default SearchedRoomItem;
