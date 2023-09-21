import ChatContext from "../../Context/ChatContext";
import { apiConstants } from "../AppConstants";
import { stringAvatar } from "../../helpers/ReusedMethods";
import Avatar from "@mui/material/Avatar";
import "./index.css";

const Profile = () => {
    return (
        <ChatContext.Consumer>
            {(value) => {
                const { userData, userDataStatus } = value;
                const { userName, profileImageUrl } = userData;
                const userProfileSize = {
                    height: "60px",
                    width: "60px",
                };
                return (
                    <div className="profile-box">
                        {userDataStatus === apiConstants.success ? (
                            <>
                                <div className="profile-content">
                                    {profileImageUrl ? (
                                        <Avatar src={profileImageUrl} sx={{ width: "60px", height: "60px" }} />
                                    ) : (
                                        <Avatar {...stringAvatar(userName, userProfileSize)} />
                                    )}
                                    <h3 className="user-name">{userName}</h3>
                                </div>
                            </>
                        ) : null}
                    </div>
                );
            }}
        </ChatContext.Consumer>
    );
};

export default Profile;
