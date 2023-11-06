import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../Firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ChatContext from "../../Context/ChatContext";
import Cookies from "js-cookie";
import Sidebar from "../Sidebar";
import Chatbox from "../Chatbox";
import Roomdetails from "../RoomDetails";
import { apiConstants, SnackbarAnchorOrigin } from "../AppConstants";
import "./index.css";

const ChatApp = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [userDataStatus, setUserDataStatus] = useState(apiConstants.initial);
    const [activeRoomDetails, setActiveRoomDetails] = useState({});
    const [snackbarData, setSnackData] = useState({ open: false, msg: "", type: "" });
    const { vertical, horizontal } = SnackbarAnchorOrigin;

    useEffect(() => {
        const jwtToken = Cookies.get("json_web_token");
        if (jwtToken === undefined) {
            return navigate("/sign-in", { replace: true });
        }
        getUserInfo();
    }, [navigate]);

    const getUserInfo = () => {
        setUserDataStatus(apiConstants.inProgress);
        const userInfo = JSON.parse(localStorage.getItem("user_info"));
        if (userInfo) {
            const unSubUserData = onSnapshot(collection(db, "users"), (snapshot) => {
                snapshot.docs.forEach((doc) => {
                    if (doc.id === userInfo?.userId) {
                        setUserData({ ...userInfo, ...doc.data() });
                        setUserDataStatus(apiConstants.success);
                    }
                });
            });

            return () => {
                unSubUserData();
            };
        }
    };

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackData({ open: false });
    };

    const handleOpenSnackbar = (open, msg, type) => {
        setSnackData({ open, msg, type });
    };

    return (
        <ChatContext.Provider
            value={{
                activeRoomDetails,
                setActiveRoomDetails,
                userData,
                setUserData,
                userDataStatus,
                setUserDataStatus,
            }}>
            <div className="chat-app-container">
                <div className="resp-container">
                    <Sidebar handleOpenSnackbar={handleOpenSnackbar} />
                    <Chatbox activeRoomDetails={activeRoomDetails} />
                    <Roomdetails activeRoomDetails={activeRoomDetails} handleOpenSnackbar={handleOpenSnackbar} />
                </div>
                <Snackbar

                    open={snackbarData.open}
                    autoHideDuration={6000}
                    anchorOrigin={{ vertical, horizontal }}
                    key={vertical + horizontal}
                    // sx={{ margin: "0px 15px 15px 0px" }}
                    onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbarData.type} sx={{ width: "100%" }}>
                        {snackbarData.msg}
                    </Alert>
                </Snackbar>
            </div>
        </ChatContext.Provider>
    );
};

export default ChatApp;
