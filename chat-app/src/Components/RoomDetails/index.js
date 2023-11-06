import "./index.css";
import { useEffect, useState } from "react";
import { onSnapshot, collection, orderBy, query, updateDoc, doc, deleteDoc, where } from "firebase/firestore";
import { db, storage } from "../../Firebase-config";
import { stringAvatar } from "../../helpers/ReusedMethods";
import { apiConstants, sizeForRoomDetailsAvatar } from "../AppConstants";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Zoom from "@mui/material/Zoom";
import Tabs from "@mui/material/Tabs";
import Badge from "@mui/material/Badge";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import ChatContext from "../../Context/ChatContext";
import RoomParticipantItem from "../RoomParticipantItem";
import ChatRoomDetails from "../../Img/ChatRoomDetails.jpg";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FormControlLabel from "@mui/material/FormControlLabel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

const Roomdetails = (props) => {
    const { activeRoomDetails, handleOpenSnackbar } = props;
    const [userData, setUserData] = useState({});
    const [roomParticipants, setRoomParticipants] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [tab, setTab] = useState(0);
    const [roomExitModalOpen, setRoomExitModalOpen] = useState(false);
    const [roomReportModalOpen, setRoomReportModalOpen] = useState(false);
    const [newRoomAvatarUrl, setNewRoomAvatarUrl] = useState("");
    const [roomAvatarUpdateStatus, setRoomAvatarUpdateStatus] = useState(apiConstants.initial);
    const [onexitUserMsgsDel, setOnexitUserMsgsDel] = useState(false);
    const [roomDetailsEditStatus, setRoomDetailsEditStatus] = useState({
        editRoomName: false,
        editRoomAbout: false,
        editDisMsgs: false,
    });
    const [editedRoomDetails, setEditedRoomDetails] = useState({
        newRoomName: "",
        newRoomAbout: "",
        disMsg: null,
        disMsgsIn: null,
    });

    const {
        roomId,
        roomAvatar,
        roomName,
        createdAt,
        about,
        adminDetails,
        anyoneCanEditRoomDetails,
        autoDelMsgsDetails,
    } = activeRoomDetails;
    const roomCreatedDate = new Date(createdAt?.seconds * 1000);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user_info"));
        setUserData(userInfo);
    }, []);

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

    useEffect(() => {
        setNewRoomAvatarUrl("");
        setRoomDetailsEditStatus({ editRoomName: false, editRoomAbout: false, editDisMsgs: false });
        setEditedRoomDetails({ newRoomName: "", newRoomAbout: "", disMsg: null });
    }, [roomId]);

    const handleNavBar = (event, newValue) => {
        setTab(newValue);
    };

    const copyRoomId = (copyText) => {
        navigator.clipboard.writeText(copyText.toString());
        handleOpenSnackbar(true, "Room Id Copied ✔", "success");
    };

    const onReportRoom = () => {
        setRoomReportModalOpen(false);
    };

    const changeRoomAvatar = async (e) => {
        const roomImg = e.target.files[0];
        setRoomAvatarUpdateStatus(apiConstants.inProgress);
        const roomImgRef = ref(storage, `room-avatars/${roomId}`);
        roomImg && (await uploadBytes(roomImgRef, roomImg));
        roomImg &&
            (await getDownloadURL(roomImgRef).then(async (url) => {
                setNewRoomAvatarUrl(url);
                await updateDoc(doc(db, "rooms", roomId), { roomAvatar: url });
                handleOpenSnackbar(true, "Room avatar updated successfully", "success");
            }));
        setRoomAvatarUpdateStatus(apiConstants.success);
    };

    const renderRoomAvatar = () => {
        if (newRoomAvatarUrl !== "") {
            if (userData?.userId === adminDetails?.adminId || anyoneCanEditRoomDetails) {
                return roomAvatarUpdateStatus === apiConstants.inProgress ? (
                    <Skeleton animation="wave" sx={{ bgcolor: "#fff" }} variant="circular" width={170} height={170} />
                ) : (
                    <Tooltip TransitionComponent={Zoom} title="Edit Room Avatar">
                        <label htmlFor="ADDIMAGE">
                            <Avatar
                                alt=""
                                src={newRoomAvatarUrl}
                                sx={{ width: "170px", height: "170px" }}
                                className="room-avatar"
                            />
                        </label>
                    </Tooltip>
                );
            } else {
                return <Avatar alt="" src={newRoomAvatarUrl} sx={{ width: "170px", height: "170px" }} />;
            }
        } else {
            if (userData?.userId === adminDetails?.adminId || anyoneCanEditRoomDetails) {
                return roomAvatarUpdateStatus === apiConstants.inProgress ? (
                    <Skeleton animation="wave" sx={{ bgcolor: "#fff" }} variant="circular" width={170} height={170} />
                ) : (
                    <Tooltip TransitionComponent={Zoom} title="Edit Room Avatar">
                        <label htmlFor="ADDIMAGE">
                            {roomAvatar ? (
                                <Avatar
                                    alt=""
                                    src={roomAvatar}
                                    sx={{ width: "170px", height: "170px" }}
                                    className="room-avatar"
                                />
                            ) : (
                                <Avatar {...stringAvatar(roomName, sizeForRoomDetailsAvatar)} className="room-avatar" />
                            )}
                        </label>
                    </Tooltip>
                );
            } else {
                return roomAvatar ? (
                    <Avatar alt="" src={roomAvatar} sx={{ width: "170px", height: "170px" }} />
                ) : (
                    <Avatar {...stringAvatar(roomName, sizeForRoomDetailsAvatar)} />
                );
            }
        }
    };

    const onToggleRNEstatus = () => {
        setEditedRoomDetails({
            ...editedRoomDetails,
            newRoomName: editedRoomDetails?.newRoomName.length > 0 ? editedRoomDetails?.newRoomName : roomName,
        });
        setRoomDetailsEditStatus({ editDisMsgs: false, editRoomAbout: false, editRoomName: true });
    };

    const onToggleRAEstatus = () => {
        setEditedRoomDetails({
            ...editedRoomDetails,
            newRoomAbout: editedRoomDetails?.newRoomAbout.length > 0 ? editedRoomDetails?.newRoomAbout : about,
        });
        setRoomDetailsEditStatus({ editDisMsgs: false, editRoomAbout: true, editRoomName: false });
    };

    const OnToggleRDMEStatus = () => {
        setEditedRoomDetails((prev) => ({
            ...prev,
            disMsg: editedRoomDetails?.disMsg === null ? autoDelMsgsDetails?.autoDelMsgs : editedRoomDetails?.disMsg,
            disMsgsIn:
                editedRoomDetails?.disMsgsIn === "" ? autoDelMsgsDetails?.forEveryInDays : editedRoomDetails?.disMsgsIn,
        }));
        setRoomDetailsEditStatus({ editDisMsgs: true, editRoomAbout: false, editRoomName: false });
    };

    const toggleDisMsgs = (e) => {
        setEditedRoomDetails({
            ...editedRoomDetails,
            disMsg: e.target.checked,
            disMsgsIn: !e.target.checked ? "" : autoDelMsgsDetails?.forEveryInDays,
        });
    };

    const saveNewRoomAbout = async () => {
        try {
            if (editedRoomDetails?.newRoomAbout === about) {
                handleOpenSnackbar(true, "No changes to save", "warning");
            } else {
                await updateDoc(doc(db, `rooms/${roomId}`), { about: editedRoomDetails?.newRoomAbout });
                handleOpenSnackbar(true, "Room about updated successfuly", "success");
                setRoomDetailsEditStatus((prev) => ({ ...roomDetailsEditStatus, editRoomAbout: !prev.editRoomAbout }));
            }
        } catch (err) {
            handleOpenSnackbar(true, err.message, "error");
        }
    };

    const cancelSaveNewRoomAbout = () => {
        setRoomDetailsEditStatus({ ...roomDetailsEditStatus, editRoomAbout: false });
        setEditedRoomDetails({ ...editedRoomDetails, newRoomAbout: about });
    };

    const saveNewRoomName = async () => {
        try {
            if (editedRoomDetails?.newRoomName === roomName) {
                handleOpenSnackbar(true, "No changes to save", "warning");
            } else if (editedRoomDetails?.newRoomName.length === 0) {
                handleOpenSnackbar(true, "Room name can not be empty!", "warning");
            } else {
                await updateDoc(doc(db, `rooms/${roomId}`), { roomName: editedRoomDetails?.newRoomName });
                handleOpenSnackbar(true, "Room name updated successfuly", "success");
                setRoomDetailsEditStatus((prev) => ({ ...roomDetailsEditStatus, editRoomName: !prev.editRoomName }));
            }
        } catch (err) {
            handleOpenSnackbar(true, err.message, "error");
        }
    };

    const cancelSaveNewRoomName = () => {
        setRoomDetailsEditStatus({ ...roomDetailsEditStatus, editRoomName: false });
        setEditedRoomDetails({ ...editedRoomDetails, newRoomName: roomName });
    };

    const saveDisMsgs = async () => {
        if (editedRoomDetails?.disMsg === autoDelMsgsDetails?.autoDelMsgs) {
            if (editedRoomDetails?.disMsgsIn === autoDelMsgsDetails?.forEveryInDays) {
                handleOpenSnackbar(true, "No changes to save", "warning");
            } else {
                if (editedRoomDetails?.disMsgsIn === "") {
                    console.log(",,,");
                    handleOpenSnackbar(
                        true,
                        "Please select after how many days your messages has to auto delete!",
                        "warning"
                    );
                } else {
                    await updateDoc(doc(db, `rooms/${roomId}`), {
                        "autoDelMsgsDetails.autoDelMsgs": editedRoomDetails?.disMsg,
                        "autoDelMsgsDetails.forEveryInDays": editedRoomDetails?.disMsgsIn,
                    });
                    setRoomDetailsEditStatus({ ...roomDetailsEditStatus, editDisMsgs: false });
                    handleOpenSnackbar(true, "Disappearing messages changes are saved!", "success");
                    console.log(editedRoomDetails, "fineee");
                }
            }
        } else {
            if (editedRoomDetails?.disMsgsIn === "") {
                console.log("nnnnnn");
                handleOpenSnackbar(
                    true,
                    "Please select after how many days your messages has to auto delete!",
                    "warning"
                );
            } else {
                await updateDoc(doc(db, `rooms/${roomId}`), {
                    "autoDelMsgsDetails.autoDelMsgs": editedRoomDetails?.disMsg,
                    "autoDelMsgsDetails.forEveryInDays": editedRoomDetails?.disMsgsIn,
                });
                setRoomDetailsEditStatus({ ...roomDetailsEditStatus, editDisMsgs: false });
                handleOpenSnackbar(true, "Disappearing messages changes are saved!", "success");
                console.log(editedRoomDetails, "okkkk");
            }
        }
    };

    const cancelSaveDisMsgs = () => {
        setRoomDetailsEditStatus({ ...roomDetailsEditStatus, editDisMsgs: false });
        setEditedRoomDetails({
            ...editedRoomDetails,
            disMsg: autoDelMsgsDetails?.autoDelMsgs,
            disMsgsIn: autoDelMsgsDetails?.forEveryInDays,
        });
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

    const delUserMsgsInRoom = async () => {
        try {
            // const roomRef = collection(db, "rooms");
            const messagesRef = query(
                collection(db, `rooms/${roomId}/messages`),
                where("senderId", "==", userData?.userId)
            );

            const userMsgsRef = onSnapshot(messagesRef, (snapshot) => {
                snapshot.forEach(async (e) => {
                    try {
                        await deleteDoc(doc(db, `rooms/${roomId}/messages`, e.id));
                    } catch (error) {
                        handleOpenSnackbar(true, error.message, "error");
                    }
                });
            });

            return () => {
                userMsgsRef();
            };
        } catch (error) {
            handleOpenSnackbar(true, error.message, "error");
        }
    };

    return (
        <ChatContext.Consumer>
            {(value) => {
                const { setActiveRoomDetails } = value;

                const onExitRoom = async () => {
                    try {
                        onexitUserMsgsDel && (await delUserMsgsInRoom());
                        await deleteDoc(doc(db, "rooms", `${roomId}/participants/${userData?.userId}`));
                        await deleteDoc(doc(db, "users", `${userData?.userId}/userRooms/${roomId}`));
                        handleOpenSnackbar(true, `you exit from ${roomName} room!`, "success");
                        setActiveRoomDetails({});
                    } catch (err) {
                        handleOpenSnackbar(true, err.message, "error");
                    }
                    setRoomExitModalOpen(false);
                };

                const renderOverView = () => {
                    return (
                        <div className="room-overView-box">
                            <input
                                type="file"
                                accept="image/*"
                                id="ADDIMAGE"
                                onChange={changeRoomAvatar}
                                style={{ display: "none" }}
                            />
                            {renderRoomAvatar()}

                            {/* room name box starts */}
                            <div className="room-detil-item-box">
                                {!roomDetailsEditStatus.editRoomName ? (
                                    <>
                                        <h2 className="room-name">
                                            {editedRoomDetails?.newRoomName?.length > 0
                                                ? editedRoomDetails?.newRoomName
                                                : roomName}
                                        </h2>
                                        {userData.userId === adminDetails.adminId || anyoneCanEditRoomDetails ? (
                                            <Tooltip TransitionComponent={Zoom} title="Edit Room Name">
                                                <IconButton color="primary" onClick={onToggleRNEstatus}>
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
                                    </>
                                ) : (
                                    <div className="room-details-edit-box">
                                        <TextField
                                            onChange={(e) =>
                                                setEditedRoomDetails({
                                                    ...editedRoomDetails,
                                                    newRoomName: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            id="standard-basic-roomName"
                                            label={
                                                editedRoomDetails?.newRoomName.length > 0
                                                    ? `Room Name (${editedRoomDetails?.newRoomName.length}/28)`
                                                    : `Room Name`
                                            }
                                            variant="standard"
                                            value={editedRoomDetails?.newRoomName}
                                            // caretColor="#48aafa"
                                            inputProps={{ maxLength: 28 }}
                                        />
                                        <div className="edit-save-cancel-btn-box">
                                            <Tooltip TransitionComponent={Zoom} title="Cancel">
                                                <IconButton onClick={cancelSaveNewRoomName}>
                                                    <CancelPresentationIcon className="RD-cancel-icon" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip TransitionComponent={Zoom} title="Save">
                                                <IconButton color="primary" onClick={saveNewRoomName}>
                                                    <CheckBoxRoundedIcon className="RD-save-icon" />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* room name box ends */}

                            {/* room create at box starts */}
                            <div className="room-detil-item-box">
                                <div>
                                    <label className="label">Created</label>
                                    <p>{`${roomCreatedDate.toLocaleDateString()} ${roomCreatedDate.toLocaleTimeString()}`}</p>
                                </div>
                            </div>
                            {/* room create at box ends */}

                            {/* room about box starts */}
                            <div className="room-detil-item-box">
                                {!roomDetailsEditStatus.editRoomAbout ? (
                                    <>
                                        <div className="about-box">
                                            <label className="label">About</label>
                                            {editedRoomDetails?.newRoomAbout.length > 0 ? (
                                                <p className="room-about-text">{editedRoomDetails?.newRoomAbout}</p>
                                            ) : (
                                                <p className="room-about-text">{about}</p>
                                            )}
                                        </div>
                                        {userData.userId === adminDetails.adminId || anyoneCanEditRoomDetails ? (
                                            <Tooltip TransitionComponent={Zoom} title="Edit About">
                                                <IconButton
                                                    color="primary"
                                                    sx={{ alignSelf: "flex-start" }}
                                                    onClick={onToggleRAEstatus}>
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
                                    </>
                                ) : (
                                    <div className="room-details-edit-box">
                                        <TextField
                                            onChange={(e) =>
                                                setEditedRoomDetails({
                                                    ...editedRoomDetails,
                                                    newRoomAbout: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            id="standard-basic-roomName"
                                            label={
                                                editedRoomDetails?.newRoomAbout.length > 0
                                                    ? `About (${editedRoomDetails?.newRoomAbout.length}/200)`
                                                    : `About`
                                            }
                                            // variant="standard"
                                            value={editedRoomDetails?.newRoomAbout}
                                            multiline
                                            maxRows={4}
                                            // caretColor="#48aafa"
                                            inputProps={{ maxLength: 300 }}
                                        />
                                        <div className="edit-save-cancel-btn-box">
                                            <Tooltip TransitionComponent={Zoom} title="Cancel">
                                                <IconButton onClick={cancelSaveNewRoomAbout}>
                                                    <CancelPresentationIcon className="RD-cancel-icon" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip TransitionComponent={Zoom} title="Save">
                                                <IconButton color="primary" onClick={saveNewRoomAbout}>
                                                    <CheckBoxRoundedIcon className="RD-save-icon" />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* room about box ends */}

                            {/* room disappear messages box starts */}
                            <div className="room-detil-item-box">
                                {!roomDetailsEditStatus?.editDisMsgs ? (
                                    <>
                                        <div>
                                            <label className="label">Disappearing messsages</label>
                                            <p>
                                                {editedRoomDetails?.disMsg
                                                    ? editedRoomDetails?.disMsgsIn
                                                    : !autoDelMsgsDetails?.autoDelMsgs
                                                    ? "OFF"
                                                    : autoDelMsgsDetails?.forEveryInDays}
                                            </p>
                                        </div>
                                        {userData.userId === adminDetails.adminId || anyoneCanEditRoomDetails ? (
                                            <Tooltip TransitionComponent={Zoom} title="Edit disappearing messages">
                                                <IconButton
                                                    color="primary"
                                                    sx={{ alignSelf: "flex-start" }}
                                                    onClick={OnToggleRDMEStatus}>
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
                                    </>
                                ) : (
                                    <div className="room-details-edit-box">
                                        <div className="dis-msg-switch-seltime-box">
                                            <label className="label">Disappearing messsages</label>
                                            <div className="checkbox-wrapper-34">
                                                <input
                                                    className="tgl tgl-ios"
                                                    id="toggle-34"
                                                    type="checkbox"
                                                    checked={editedRoomDetails?.disMsg}
                                                    onChange={(e) => toggleDisMsgs(e)}
                                                />
                                                <label className="tgl-btn" htmlFor="toggle-34"></label>
                                            </div>
                                            {editedRoomDetails?.disMsg && (
                                                <FormControl>
                                                    <FormLabel id="demo-controlled-radio-buttons-group">
                                                        Disappear for every
                                                    </FormLabel>
                                                    <RadioGroup
                                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                                        name="controlled-radio-buttons-group"
                                                        value={editedRoomDetails?.disMsgsIn}
                                                        onChange={(e) =>
                                                            setEditedRoomDetails((prev) => ({
                                                                ...prev,
                                                                disMsgsIn: e.target.value,
                                                            }))
                                                        }>
                                                        <FormControlLabel
                                                            value="24days"
                                                            control={<Radio />}
                                                            label="24 hours"
                                                        />
                                                        <FormControlLabel
                                                            value="7days"
                                                            control={<Radio />}
                                                            label="7 days"
                                                        />
                                                        <FormControlLabel
                                                            value="90days"
                                                            control={<Radio />}
                                                            label="90 days"
                                                        />
                                                        {/* <FormControlLabel value={0} control={<Radio />} label="Off" /> */}
                                                    </RadioGroup>
                                                </FormControl>
                                            )}
                                        </div>
                                        <div className="edit-save-cancel-btn-box disMsg">
                                            <Tooltip TransitionComponent={Zoom} title="Cancel">
                                                <IconButton onClick={cancelSaveDisMsgs}>
                                                    <CancelPresentationIcon className="RD-cancel-icon" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip TransitionComponent={Zoom} title="Save">
                                                <IconButton color="primary" onClick={saveDisMsgs}>
                                                    <CheckBoxRoundedIcon className="RD-save-icon" />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* room disappear messages box ends */}

                            {/* room ID box starts */}
                            <label className="roomId-label">Room Id</label>
                            <div className="room-id-box">
                                <strong className="room-id">{roomId}</strong>
                                <Tooltip TransitionComponent={Zoom} title="Copy room ID">
                                    <IconButton color="primary" onClick={() => copyRoomId(roomId)}>
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            {/* room ID box ends */}

                            {/* room report and exit btn box starts */}
                            <div className="room-exit-report-btn-box">
                                <button className="room-btn exit" onClick={() => setRoomExitModalOpen(true)}>
                                    Exit Room
                                </button>

                                {/* exit modal starts */}
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
                                        <div className="checkbox-wrapper-18">
                                            <div className="round">
                                                <input
                                                    value={onexitUserMsgsDel}
                                                    type="checkbox"
                                                    id="checkbox-18"
                                                    onChange={(e) => setOnexitUserMsgsDel(e.target.checked)}
                                                />
                                                <label htmlFor="checkbox-18"></label>
                                            </div>
                                            <label htmlFor="checkbox-18">delete your messages in this room?</label>
                                        </div>
                                        <div className="modal-btn-box">
                                            <button className="modal-btn exit" onClick={onExitRoom}>
                                                Exit
                                            </button>
                                            <button
                                                className="modal-btn cancel"
                                                onClick={() => setRoomExitModalOpen(false)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </Box>
                                </Modal>
                                {/* exit modal starts */}

                                <button className="room-btn report" onClick={() => setRoomReportModalOpen(true)}>
                                    Report Room
                                </button>

                                {/* report modal starts */}
                                <Modal
                                    open={roomReportModalOpen}
                                    onClose={() => setRoomReportModalOpen(false)}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description">
                                    <Box className="room-details-modal-box">
                                        <h2 className="modal-heading">
                                            Report spam and leave this group? If you report and leave, this chat's
                                            history will also be deleted.
                                        </h2>
                                        <div className="checkbox-wrapper-18">
                                            <div className="round">
                                                <input
                                                    value={onexitUserMsgsDel}
                                                    type="checkbox"
                                                    id="checkbox-18"
                                                    onChange={(e) => setOnexitUserMsgsDel(e.target.checked)}
                                                />
                                                <label htmlFor="checkbox-18"></label>
                                            </div>
                                            <label htmlFor="checkbox-18">delete your messages in this room?</label>
                                        </div>
                                        <div className="modal-btn-box">
                                            <button className="modal-btn exit" onClick={onReportRoom}>
                                                Report and leave
                                            </button>
                                            <button
                                                className="modal-btn cancel"
                                                onClick={() => setRoomReportModalOpen(false)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </Box>
                                </Modal>
                                {/* report modal ends */}
                            </div>
                            {/* room report and exit btn box ends */}
                        </div>
                    );
                };

                const renderRespectiveTab = () => {
                    switch (tab) {
                        case 0:
                            return renderOverView();
                        case 1:
                            return renderParticipants();
                        case 2:
                            return renderEncryption();
                        default:
                            return handleOpenSnackbar(true, "Oops!, Something went wrong. please try again!", "error");
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
                            <>
                                <img src={ChatRoomDetails} alt="" className="room-details-img" />
                                <h4>Room Details</h4>
                            </>
                        )}
                    </div>
                );
            }}
        </ChatContext.Consumer>
    );
};

export default Roomdetails;
