import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase-config";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Popover from "@mui/material/Popover";
import ChatAppRemoveBgLogo from "../../Img/ChatAppRemoveBgLogo.png";
import "./index.css";

const AppLogo = () => {
    const [popOverAnchorEl, setPopOverAnchorEl] = useState(null);
    const [userData, setUserData] = useState({});

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
    };

    const handleClosePopover = () => {
        setPopOverAnchorEl(null);
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
                <div className="new-room-create-box">
                    <img src={ChatAppRemoveBgLogo} alt="" className="chat-box-app-logo" />
                    <p className="chat-box-app-caption">Send and recive the messages simple and seemless way!</p>
                </div>
            </Popover>
        </div>
    );
};

export default AppLogo;
