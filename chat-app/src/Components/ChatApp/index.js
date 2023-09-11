import { useEffect, useState } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase-config";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ChatContext from "../../Context/ChatContext";
import Cookies from "js-cookie";
import "./index.css";
import Sidebar from "../Sidebar";
import Chatbox from "../Chatbox";
import Roomdetails from "../RoomDetails";

const ChatApp = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [activeRoomDetails, setActiveRoomDetails] = useState({});
    const [snackbarData, setSnackData] = useState({ open: false, msg: "", type: "" });
    const vertical = "bottom";
    const horizontal = "right";

    useEffect(() => {
        const jwtToken = Cookies.get("jwt_token");
        if (jwtToken === undefined) {
            return navigate("/sign-in", { replace: true });
        }
        // getUserInfo()
    });

    // const getUserInfo = () => {
    //     const userInfo = JSON.parse(localStorage.getItem('user_info'))
    //     setUserInfo(userInfo)
    // }

    const onLogout = async () => {
        setUserInfo({});
        Cookies.remove("jwt_token");
        localStorage.removeItem("user_info");
        await signOut(auth);
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
        // this.setState({ snackbarData: { open, msg, type } });
    };

    return (
        <ChatContext.Provider
            value={{
                activeRoomDetails,
                setActiveRoomDetails,
            }}>
            <div className="chat-app-container">
                <div className="resp-container">
                    <Sidebar handleOpenSnackbar={handleOpenSnackbar} />
                    <Chatbox activeRoomDetails={activeRoomDetails} />
                    <Roomdetails activeRoomDetails={activeRoomDetails} />
                </div>
                <Snackbar
                    open={snackbarData.open}
                    autoHideDuration={6000}
                    anchorOrigin={{ vertical, horizontal }}
                    key={vertical + horizontal}
                    sx={{ margin: "0px 15px 15px 0px" }}
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
