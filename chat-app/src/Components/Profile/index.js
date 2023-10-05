import { useState } from "react";
import { apiConstants } from "../AppConstants";
import { ThreeDotsLoader } from "../../helpers/ReusedElements";
import { stringAvatar } from "../../helpers/ReusedMethods";
import { sizeForUserProfileAvatar } from "../AppConstants";
import Avatar from "@mui/material/Avatar";
import Drawer from "react-modern-drawer";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ChatContext from "../../Context/ChatContext";
import "react-modern-drawer/dist/index.css";
import "./index.css";

const Profile = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    return (
        <ChatContext.Consumer>
            {(value) => {
                const { userData, userDataStatus } = value;
                const { userName, profileImageUrl } = userData;

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
