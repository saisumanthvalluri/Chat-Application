import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../Firebase-config";
import Modal from "@mui/material/Modal";
import ChatContext from "../../Context/ChatContext";
import "./index.css";

const SearchedRoomItem = (props) => {
    const { roomDetails, handleClosePopover, setSearchInput } = props;
    const { roomName, roomId, roomProfileAvatar, createdAt } = roomDetails;
    const [userData, setUserData] = useState({});
    const [modelOpen, setModelOpen] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user_info"));
        setUserData(userInfo);
    }, []);

    // getting room text logo
    const roomNamePair = roomDetails.roomName.split(" ");
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
                width: "60px",
                height: "60px",
            },
            children: roomTextLogo,
        };
    };

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
                const { setActiveRoomDetails } = value;

                const joinRoom = async () => {
                    setActiveRoomDetails(roomDetails);
                    setModelOpen(false);
                    handleClosePopover();
                    setSearchInput("");
                    
                    // adding paricipant to the searched room
                    await setDoc(doc(db, `rooms/${roomId}/participants`, userData.userId), {
                        about: userData.about ? userData?.about : null,
                        name: userData?.name,
                        profileImageUrl: userData.profileImageUrl ? userData?.profileImageUrl : null,
                        joinedAt: serverTimestamp(),
                    });
                };

                return (
                    <>
                        <li className="searched-room-tab" key={roomId} onClick={onJoinRoom}>
                            {roomProfileAvatar ? (
                                <Avatar alt="" src={roomProfileAvatar} sx={{ width: "60px", height: "60px" }} />
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
                                {roomProfileAvatar ? (
                                    <Avatar alt="" src={roomProfileAvatar} sx={{ width: "60px", height: "60px" }} />
                                ) : (
                                    <Avatar {...stringAvatar(roomName)} />
                                )}
                                <h3>{roomName}</h3>
                                <button onClick={joinRoom}> Join Room</button>
                            </Box>
                        </Modal>
                    </>
                );
            }}
        </ChatContext.Consumer>
    );
};

export default SearchedRoomItem;
