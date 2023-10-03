import { useEffect, useState } from "react";
import { onSnapshot, collection, query, where, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase-config";
import { apiConstants } from "../AppConstants";
import { ThreeDots } from "react-loader-spinner";
import Popover from "@mui/material/Popover";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AppLogo from "../AppLogo";
import RoomTab from "../RoomTab";
import SearchedRoomItem from "../SearchedRoomItem";
import Profile from "../Profile";
import "./index.css";

const Sidebar = (props) => {
    const { handleOpenSnackbar } = props;
    const [userRooms, setUserRooms] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchedRoooms, setSearchedRooms] = useState([]);
    const [popOverAnchorEl, setPopOverAnchorEl] = useState(null);
    const [userRoomsApiStatus, setUserRoomsApiStatus] = useState(apiConstants.initial);

    const popOverOpen = Boolean(popOverAnchorEl);
    const popOverId = popOverOpen ? "simple-popover" : undefined;

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user_info"));
        if (userInfo) {
            setUserRoomsApiStatus(apiConstants.inProgress);

            // getting userId's from the `users/${userInfo?.userId}/userRooms`
            const unsubUserRoomIds = onSnapshot(collection(db, `users/${userInfo?.userId}/userRooms`), (snapshot) => {
                let userRoomIds = [];
                snapshot.docs.forEach((e) => {
                    userRoomIds.push(e.id);
                });

                if (userRoomIds.length !== 0) {
                    var roomsQuery = query(
                        collection(db, "rooms"),
                        where("roomId", "in", userRoomIds),
                        orderBy("lastMsg.timeStamp", "desc")
                    );
                    
                    // getting user rooms from rooms collection based on the user room id's array
                    const unSubuserRooms = onSnapshot(roomsQuery, (snapshot) => {
                        let _userRooms = [];
                        snapshot.docs.forEach((e) => _userRooms.push({ ...e.data() }));
                        setUserRooms(_userRooms);
                        setUserRoomsApiStatus(apiConstants.success);
                    });

                    return () => {
                        unSubuserRooms();
                    };
                }
            });

            return () => {
                unsubUserRoomIds();
            };
        } 
        // else {
        //     handleOpenSnackbar(true, "Something went wrong!. Please try later.", "error");
        //     setUserRoomsApiStatus(apiConstants.failure);
        // }
    }, []);

    const handleOpenPopover = (event) => {
        setPopOverAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setPopOverAnchorEl(null);
        setSearchInput("");
        setSearchedRooms([]);
    };

    const searchRoom = async () => {
        let count = 0;
        for (let room of userRooms) {
            if (room.roomId === searchInput.trim()) {
                count = count + 1;
            }
        }
        // console.log(count);
        if (count === 0) {
            const docRef = doc(db, "rooms", searchInput);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSearchedRooms([docSnap.data()]);
            } else {
                handleOpenSnackbar(true, `Room not found with id:${searchInput}`, "warning");
            }
        } else {
            setSearchedRooms([]);
            setPopOverAnchorEl(null);
            handleOpenSnackbar(true, "you have already in that room!", "warning");
        }
    };

    const handleSearch = (e) => {
        if (e.code === "Enter") {
            handleOpenPopover(e);
            searchInput !== "" ? searchRoom() : handleOpenSnackbar(true, "Room ID can not be empty!", "warning");
        }
    };

    const renderUserRooms = () => {
        return (
            <div className="rooms-box">
                {userRoomsApiStatus === apiConstants.inProgress ? (
                    <ThreeDots
                        height="60"
                        width="60"
                        radius="9"
                        color="#48aafa"
                        ariaLabel="three-dots-loading"
                        visible={true}
                    />
                ) : (
                    userRooms.map((e) => <RoomTab roomDetails={e} key={e.roomId} />)
                )}
            </div>
        );
    };

    return (
        <div className="sidebar-container">
            <AppLogo handleOpenSnackbar={handleOpenSnackbar} />
            <div className="search-box">
                <SearchRoundedIcon className="search-icon" />
                <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearch}
                    type="search"
                    className="search-input"
                    placeholder="Enter roomId and click enter"
                />
            </div>
            <Popover
                id={popOverId}
                open={popOverOpen}
                anchorEl={popOverAnchorEl}
                onClose={handleClosePopover}
                // anchorPosition={{ top: 250, left: 0 }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}>
                <ul className="searched-rooms-box">
                    {searchedRoooms.length > 0 ? (
                        searchedRoooms.map((e) => (
                            <SearchedRoomItem handleClosePopover={handleClosePopover} roomDetails={e} key={e.roomId} />
                        ))
                    ) : (
                        <p>Oops! no rooms found</p>
                    )}
                </ul>
            </Popover>
            {renderUserRooms()}
            <Profile />
        </div>
    );
};

export default Sidebar;
