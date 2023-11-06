import { useState } from "react";
import { apiConstants } from "../AppConstants";
import { ThreeDotsLoader } from "../../helpers/ReusedElements";
import { stringAvatar } from "../../helpers/ReusedMethods";
import { sizeForUserProfileAvatar } from "../AppConstants";
import { Modal, Box } from '@mui/material';
import Avatar from "@mui/material/Avatar";
import Drawer from "react-modern-drawer";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ChatContext from "../../Context/ChatContext";
import "react-modern-drawer/dist/index.css";
import "./index.css";
import Cookies from "js-cookie";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase-config";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
    const navigate = useNavigate();
    return (
        <ChatContext.Consumer>
            {(value) => {
                const { userData, userDataStatus } = value;
                const { userName, profileImageUrl } = userData;

                const onLogout = async () => {
                    Cookies.remove("json_web_token");
                    localStorage.removeItem("user_info");
                    await signOut(auth);
                    setLogoutDialogOpen(false)
                    navigate("/sign-in", { replace: true });
                };

                return (
                    <div className="profile-box" onClick={() => setDrawerOpen(true)}>
                        {userDataStatus === apiConstants.success ? (
                            <>
                                <div className="profile-content">
                                    {profileImageUrl ? (
                                        <Avatar src={profileImageUrl} sx={{ width: "60px", height: "60px" }} />
                                    ) : (
                                        <Avatar
                                            {...stringAvatar(userName, sizeForUserProfileAvatar)}
                                            onClick={() => setDrawerOpen(true)}
                                        />
                                    )}
                                    <h3 className="user-name">{userName}</h3>
                                    <ModeEditIcon sx={{ fontSize: "30px", marginLeft: "auto", color: "#737070" }} />
                                </div>

                                <Drawer
                                    open={drawerOpen}
                                    onClose={() => setDrawerOpen(false)}
                                    direction="left"
                                    style={{ width: "400px", cursor: "default" }}
                                    className="profile-drawer-box">
                                    <div>Hello World</div>
                                    <button onClick={() =>setLogoutDialogOpen(true)}>Logout</button>
                                    <Modal
                                        // animate={{scale: 1, x: 100}} initial={{scale: 0}}
                                        open={logoutDialogOpen}
                                        onClose={setLogoutDialogOpen}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                        >
                                        <Box  className="logout-dialog">
                                            <h3 className="are-you-sure-text">Are you Sure! You want to Logout?</h3>
                                            <div className='buttons-box'>
                                                <button className='btn cancel' onClick={() => setLogoutDialogOpen(false)}>Cancel</button>
                                                <button className='btn delete' onClick={onLogout}>Logout</button>
                                            </div>
                                        </Box>
                                    </Modal>
                                </Drawer>
                            </>
                        ) : (
                            ThreeDotsLoader(60, 60, 9, "#48aafa")
                        )}
                    </div>
                );
            }}
        </ChatContext.Consumer>
    );
};

export default Profile;
