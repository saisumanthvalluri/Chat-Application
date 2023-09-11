import { useEffect, useState } from "react";
import { onSnapshot, collection, query, where, orderBy } from "firebase/firestore";
import { db } from "../../Firebase-config";
import Popover from "@mui/material/Popover";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AppLogo from "../AppLogo";
import RoomTab from "../RoomTab";
import SearchedRoomItem from "../SearchedRoomItem";
import ChatContext from "../../Context/ChatContext";
import "./index.css";

const Sidebar = (props) => {
    const { handleOpenSnackbar } = props;
    const [userData, setUserData] = useState({});
    const [allRooms, setAllRooms] = useState([]);
    const [userRooms, setUserRooms] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchedRoooms, setSearchedRooms] = useState([]);
    const [popOverAnchorEl, setPopOverAnchorEl] = useState(null);

    const popOverOpen = Boolean(popOverAnchorEl);
    const popOverId = popOverOpen ? "simple-popover" : undefined;

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user_info"));
        setUserData(userInfo);
        // console.log(userInfo);

        if (userInfo) {
            // getting rooms, user rooms
            const msgQuery = query(collection(db, "messages"), where("senderId", "==", userInfo?.userId));
            const unsub = onSnapshot(msgQuery, (snapshot) => {
                let allMsgs = [];
                snapshot.docs.forEach((e) => {
                    allMsgs.push({ ...e.data(), id: e.id });
                });

                let rooms = [];
                for (let msg of allMsgs) {
                    rooms.push({ roomId: msg.roomId, roomName: msg.roomName });
                }
                
                const uniqueRooms = [...new Map(rooms.map((room) => [room.roomId, room])).values()];

                // getting all rooms irrespective of curr. user
                const roomsQuery = query(collection(db, "rooms"), orderBy("lastMsg.timeStamp", "desc"));
                const unsubAllRooms = onSnapshot(roomsQuery, (snapshot) => {
                    let allrooms = [];
                    snapshot.docs.forEach((e) => allrooms.push({ ...e.data(), roomId: e.id }));
                    setAllRooms(allrooms);

                    let userRooms = [];
                    for (let i of allrooms) {
                        for (let j of uniqueRooms) {
                            if (j.roomId === i.roomId) {
                                userRooms.push(i);
                            }
                        }
                    }
                    setUserRooms(userRooms);
                });

                return () => {
                    unsubAllRooms();
                };
            });

            return () => {
                unsub();
            };
        }
    }, []);

    const handleOpenPopover = (event) => {
        setPopOverAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setPopOverAnchorEl(null);
        // setSearchInput('')
    };

    const searchRoom = () => {
        // if (searchInput !== "") {
        //     const docRef = doc(db, "rooms", searchInput);
        //     const docSnap = await getDoc(docRef);
        //     console.log(docSnap.data(), "000");
        // }
        let count = 0;
        for (let room of userRooms) {
            if (room.roomId === searchInput.trim()) {
                count = count + 1;
            }
        }
        // console.log(count);
        if (count === 0) {
            const filteredRooms = allRooms.filter((room) => room.roomId === searchInput);
            setSearchedRooms(filteredRooms);
        } else {
            setSearchedRooms([]);
            setPopOverAnchorEl(null);
            handleOpenSnackbar(true, "you have already in that room!", "warning");
        }
    };

    const handleSearch = (e) => {
        if (e.code === "Enter") {
            handleOpenPopover(e);
            searchRoom();
        }
    };

    return (
        <ChatContext.Consumer>
            {(value) => {
                return (
                    <div className="sidebar-container">
                        <AppLogo />
                        {/* <div class="search-box">
                            <button class="btn-search">
                                <SearchRoundedIcon sx={{margin: '0 0 5px 15px'}} />
                            </button>
                            <input type="text" class="input-search" placeholder="Click enter to search room" />
                        </div> */}
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
                                        <SearchedRoomItem
                                            setSearchInput={setSearchInput}
                                            handleClosePopover={handleClosePopover}
                                            roomDetails={e}
                                            key={e.roomId}
                                        />
                                    ))
                                ) : (
                                    <p>Oops! no rooms found</p>
                                )}
                            </ul>
                        </Popover>
                        <div className="rooms-box">
                            {userRooms.map((e) => (
                                <RoomTab roomDetails={e} key={e.roomId} />
                            ))}
                        </div>
                    </div>
                );
            }}
        </ChatContext.Consumer>
    );
};

export default Sidebar;
