import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../../Firebase-config";
import { ref, getDownloadURL, deleteObject, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
// import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import ChatAppRemoveBgLogo from "../../Img/ChatAppRemoveBgLogo.png";
import "./index.css";

const style = {
    width: "350px",
    // height: "350px",
    padding: "20px 30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
};

const AppLogo = (props) => {
    const { handleOpenSnackbar } = props;
    const [popOverAnchorEl, setPopOverAnchorEl] = useState(null);
    const [userData, setUserData] = useState({});
    const [newRoomId, setNewRoomId] = useState("");
    const [newRoomIcon, setNewRoomIcon] = useState("");
    const [newRoomName, setNewRoomName] = useState("");
    const [canEdit, setCanEdit] = useState(false);

    const popOverOpen = Boolean(popOverAnchorEl);
    const popOverId = popOverOpen ? "simple-popover" : undefined;

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user_info"));
        setUserData(userInfo);

        // getting current user
        const unSubUserData = onSnapshot(collection(db, "users"), (snapshot) => {
            snapshot.docs.forEach((doc) => {
                if (doc.id === userInfo?.userId) {
                    setUserData({ ...userInfo, ...doc.data() });
                }
            });
        });

        return () => {
            unSubUserData();
        };
    }, []);

    const handleOpenPopover = (event) => {
        setPopOverAnchorEl(event.currentTarget);
        setNewRoomId(uuidv4());
    };

    const handleClosePopover = () => {
        setPopOverAnchorEl(null);
        setNewRoomId("");
        setNewRoomIcon("");
    };

    const toggleEditStatus = () => {
        setCanEdit((prev) => !prev);
    };

    const onChangeRoomAvatar = async (e) => {
        // setNewRoomIcon(e.target.files[0]);
        const roomImg = e.target.files[0];
        const roomImgRef = ref(storage, `room-avatars/${newRoomId}`);
        roomImg && (await uploadBytes(roomImgRef, roomImg));
        await getDownloadURL(roomImgRef).then((url) => setNewRoomIcon(url));
    };

    const onCreateNewRoom = async () => {
        if (newRoomName !== "") {
            const newRoom = {
                roomId: newRoomId,
                roomName: newRoomName,
                about: "",
                roomAvatar: newRoomIcon === "" ? "" : newRoomIcon,
                createdAt: serverTimestamp(),
                anyoneCanEditRoomDetails: canEdit,
                lastMsg: {
                    msgText: "",
                    senderId: "",
                    senderName: "",
                    timeStamp: serverTimestamp(),
                },
                adminDetails: {
                    adminId: userData?.userId,
                    adminName: userData?.userName,
                },
            };
            await setDoc(doc(db, "rooms", newRoomId), newRoom);
            await setDoc(doc(db, `rooms/${newRoomId}/participants`, userData.userId), {
                about: userData.about ? userData?.about : null,
                name: userData?.userName,
                profileImageUrl: userData.profileImageUrl ? userData?.profileImageUrl : null,
                joinedAt: serverTimestamp(),
            });

            await setDoc(doc(db, `users/${userData.userId}/userRooms`, newRoomId), {
                newRoomName,
            });
            handleOpenSnackbar(true, `Room created successfully`, "success");
            handleClosePopover();
        } else {
            handleOpenSnackbar(true, `Room name mandatory`, "warning");
        }
    };

    return (
        <div className="app-logo-box">
            <img src={ChatAppRemoveBgLogo} alt="app-logo" className="app-logo" />
            <h2 className="app-name">Chat Together</h2>
            <Tooltip TransitionComponent={Zoom} title="create new room">
                <IconButton
                    onClick={handleOpenPopover}
                    aria-label="delete"
                    sx={{ marginLeft: "50px", width: "50px", height: "50px" }}
                    color="primary">
                    <AddCircleOutlineIcon sx={{ fontSize: "30px" }} />
                </IconButton>
            </Tooltip>
            <Popover
                id={popOverId}
                open={popOverOpen}
                anchorEl={popOverAnchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}>
                <Box sx={style}>
                    <h1 className="create-new-room-hdg">Create New Room</h1>
                    <input
                        type="file"
                        accept="image/*"
                        id="ADDIMAGE"
                        onChange={onChangeRoomAvatar}
                        style={{ display: "none" }}
                    />
                    <Tooltip TransitionComponent={Zoom} title="Room profile avatar">
                        {newRoomIcon === "" ? (
                            <label className="room-avatar-box" htmlFor="ADDIMAGE">
                                <AddPhotoAlternateOutlinedIcon className="add-pto-icon" />
                            </label>
                        ) : (
                            <label className="room-avatar-box" htmlFor="ADDIMAGE">
                                <img src={newRoomIcon} alt="" className="room-avatar" />
                            </label>
                        )}
                    </Tooltip>
                    <TextField
                        onChange={(e) => setNewRoomName(e.target.value)}
                        fullWidth
                        id="standard-basic-roomName"
                        label="Room Name*"
                        variant="standard"
                    />
                    <Box
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}>
                        <label>Anyone can edit room info?</label>
                        <div className="checkbox-wrapper-34">
                            <input className="tgl tgl-ios" id="toggle-34" type="checkbox" onClick={toggleEditStatus} />
                            <label className="tgl-btn" htmlFor="toggle-34"></label>
                        </div>
                    </Box>
                    <Box
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            // border: '1px solid red'
                        }}>
                        <button className="room-cancel-btn" onClick={handleClosePopover}>
                            Cancel
                        </button>
                        <button className="create-room-btn" onClick={onCreateNewRoom}>
                            Create New Room
                        </button>
                    </Box>
                </Box>
            </Popover>
        </div>
    );
};

export default AppLogo;
