import "./index.css";
import * as React from "react";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import MuiAlert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import { auth } from "../../Firebase-config";
import Snackbar from "@mui/material/Snackbar";
import { apiConstants } from "../AppConstants";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useNavigate, Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import { signInWithEmailAndPassword } from "firebase/auth";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ChatAppRemoveBgLogo from "../../Img/ChatAppRemoveBgLogo.png";
import { ThreeDotsLoader } from "../../helpers/ReusedElements";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [snackbarData, setSnackData] = useState({ open: false, msg: "", type: "" });
    const [authApiStatus, setAuthApiStatus] = useState(apiConstants.initial);
    const vertical = "bottom";
    const horizontal = "right";
    const navigate = useNavigate();

    useEffect(() => {
        const jwtToken = Cookies.get("jwt_token");
        if (jwtToken !== undefined) {
            return navigate("/", { replace: true });
        }
    });

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackData({ open: false });
    };

    const handleForm = async (e) => {
        e.preventDefault();
        try {
            if (email !== "" && password !== "") {
                setAuthApiStatus(apiConstants.inProgress);
                const user = await signInWithEmailAndPassword(auth, email, password);
                const userInfo = {
                    userId: user.user.uid,
                    operationType: user.operationType,
                };
                Cookies.set("jwt_token", user.user.accessToken, { expires: 1 });
                localStorage.setItem("user_info", JSON.stringify(userInfo));
                setEmail("");
                setPassword("");
                navigate("/", { replace: true });
                setAuthApiStatus(apiConstants.success);
            } else {
                setSnackData({ open: true, msg: "Email and password can not be empty!", type: "warning" });
            }
        } catch (error) {
            if (error.message === "Firebase: Error (auth/user-not-found).") {
                setSnackData({ open: true, msg: "User Does not exists!", type: "warning" });
            } else if (error.message === "Firebase: Error (auth/wrong-password).") {
                setSnackData({ open: true, msg: "Invalid password", type: "warning" });
            } else if (error.message === "Firebase: Error (auth/invalid-email).") {
                setSnackData({ open: true, msg: "Invalid email!", type: "warning" });
            } else if (error.message === "Firebase: Error (auth/network-request-failed).") {
                setSnackData({ open: true, msg: "You are offline. please check your network!", type: "warning" });
            } else if (
                error.message ===
                "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."
            ) {
                setSnackData({
                    open: true,
                    msg: "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later!",
                    type: "warning",
                });
            } else {
                setSnackData({ open: true, msg: error.message, type: "warning" });
            }
        }
    };

    return (
        <div className="sign-up-container">
            <div className="resp-container">
                <div className="form-container">
                    <div className="form-content">
                        <form className="sign-up-form" onSubmit={handleForm}>
                            <img src={ChatAppRemoveBgLogo} alt="chat-app-logo" className="chat-app-logo" />
                            <h1 className="app-title">Chat Together</h1>
                            <p className="app-caption">Fastest way to chat and simple!</p>
                            <Box sx={{ width: "100%" }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        mb: 3,
                                    }}>
                                    <MailOutlinedIcon
                                        sx={{
                                            color: "action.active",
                                            mr: 2,
                                            my: 0.5,
                                            fontSize: 33,
                                        }}
                                    />
                                    <TextField
                                        id="input-Email"
                                        label="Email"
                                        variant="standard"
                                        fullWidth
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        mb: 3,
                                    }}>
                                    <LockOutlinedIcon
                                        sx={{
                                            color: "action.active",
                                            mr: 2,
                                            my: 0.5,
                                            fontSize: 33,
                                        }}
                                    />
                                    <FormControl sx={{ width: "310px" }} variant="standard">
                                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                                        <Input
                                            id="standard-adornment-password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            type={showPassword ? "text" : "password"}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword((prev) => !prev)}>
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Box>
                            </Box>
                            {authApiStatus === apiConstants?.inProgress ? (
                                <button className="signup-btn">{ThreeDotsLoader(30, 60, 6, "#fff")}</button>
                            ) : (
                                <button className="signup-btn" type="submit">
                                    Sign In
                                </button>
                            )}
                            <p>
                                Don't have an account? <Link to="/sign-up">Sign Up</Link>
                            </p>
                        </form>
                    </div>
                </div>
                <div className="app-logo">
                    <img src={ChatAppRemoveBgLogo} alt="chat-app-img" className="chat-app-img" />
                </div>
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
    );
};

export default SignIn;
