import {
    onSnapshot,
    collection,
    query,
    serverTimestamp,
    addDoc,
    orderBy,
    updateDoc,
    doc,
    // limit,
    // startAfter,
} from "firebase/firestore";
import { db } from "../../Firebase-config";
import { useEffect, useState, useRef } from "react";
// import { apiConstants } from "../AppConstants";
import ChatFooter from "../ChatFooter";
import ChatHeader from "../ChatHeader";
import MsgItem from "../MsgItem";
import ChatAppRemoveBgLogo from "../../Img/ChatAppRemoveBgLogo.png";
import "./index.css";

// let lastVisible = null;
const Chatbox = (props) => {
    const { activeRoomDetails } = props;
    const { roomId } = activeRoomDetails;
    const [userData, setUserData] = useState(null);
    const [roomMessages, setRoomMessages] = useState();
    const [roomParticipants, setRoomParticipants] = useState([]);
    const [roomDetails, setRoomDetails] = useState(null);
    // const [chatBoxApisStatus, setChatBoxApisStatus] = useState(apiConstants.initial);
    const ref = useRef();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user_info"));

        // getting current user
        const unSubUserData = onSnapshot(collection(db, "users"), (snapshot) => {
            snapshot.docs.forEach((doc) => {
                if (doc.id === userInfo?.userId) {
                    setUserData({ ...userInfo, ...doc.data() });
                }
            });
        });

        if (roomId) {
            // setChatBoxApisStatus(apiConstants.inProgress);
            const unsubRoomDetails = onSnapshot(collection(db, `rooms`), (snapShot) => {
                snapShot.docs.forEach((e) => {
                    e.id === roomId && setRoomDetails({ ...e.data() });
                });
            });

            // getting participants based on the room Id
            const unsubParticipants = onSnapshot(collection(db, `rooms/${roomId}/participants`), (snapshot) => {
                let participants = [];
                snapshot.docs.forEach((e) =>
                    participants.push({
                        ...e.data(),
                        userId: e.id,
                    })
                );
                setRoomParticipants(participants);
            });

            // getting messages based on the room Id
            const messagesQuery = query(collection(db, `rooms/${roomId}/messages`), orderBy("timeStamp"));
            const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
                let roomMessages = [];
                snapshot.docs.forEach((e) => roomMessages.push({ ...e.data(), id: e.id }));
                setRoomMessages(roomMessages);
            });

            // setTimeout(() => {
            //     setChatBoxApisStatus(apiConstants.success);
            // }, 200);

            return () => {
                unsubParticipants();
                unsubMessages();
                unsubRoomDetails();
            };
        }

        return () => {
            unSubUserData();
        };
    }, [roomId]);

    // useeffect for getting last msg reference
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [roomMessages]);

    // const loadMoreRoomMessages = () => {
    //     // const messagesQuery = query(collection(db, `rooms/${roomId}/messages`), orderBy("timeStamp"));
    //     // const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
    //     //     let roomMessages = [];
    //     //     snapshot.docs.forEach((e) => roomMessages.push({ ...e.data(), id: e.id }));
    //     //     setRoomMessages(roomMessages);
    //     // });
    //     console.log(lastVisible, "uuuuu");
    //     if (lastVisible) {
    //         let qq = query(
    //             collection(db, `rooms/${roomId}/messages`),
    //             orderBy("timeStamp"),
    //             startAfter(lastVisible),
    //             limit(10)
    //         );

    //         const unsub = onSnapshot(qq, (snapShot) => {
    //             let moreMsgs = [];
    //             snapShot.docs.forEach((e) => moreMsgs.push({ ...e.data(), id: e.id }));
    //             setRoomMessages((prev) => ({ ...prev.roomMessages, ...moreMsgs }));
    //             lastVisible = snapShot.docs[snapShot.docs.length - 1];
    //         });
    //         // let q = collection(db, `rooms/${roomId}/messages`).orderBy("timestamp").startAfter(lastVisible).limit(10);
    //         // qq.get().then((querySnapshot) => {
    //         //     querySnapshot.forEach((doc) => {
    //         //         // Process each document and add it to your chatbox UI
    //         //         console.log(doc.id, " => ", doc.data());
    //         //     });
    //         //     // Update the last visible document
    //         //     lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    //         // });

    //         return () => {
    //             unsub();
    //         };
    //     }
    // };

    const sendMsg = async (msg) => {
        // method for create new msg for that room
        const newMsg = {
            msgText: msg,
            timeStamp: serverTimestamp(),
            // roomId,
            // roomName,
            senderId: userData.userId,
            senderName: userData.userName,
            userProfileImg: userData.profileImageUrl ? userData?.profileImageUrl : null,
        };
        await addDoc(collection(db, `rooms/${roomId}/messages`), newMsg);

        // method for updating last msg for that room
        await updateDoc(doc(db, "rooms", roomId), {
            "lastMsg.msgText": msg,
            "lastMsg.timeStamp": serverTimestamp(),
            "lastMsg.senderId": userData.userId,
            "lastMsg.senderName": userData.userName,
        });
    };

    const renderMsgs = () => {
        return roomMessages?.length > 0 ? (
            <ul className="all-msgs hide-scrollbar" id="CHATBOXID">
                {roomMessages?.map((e) => (
                    <MsgItem msgDetails={e} userData={userData} key={e.id} roomId={roomId} />
                ))}

                {/* div for always getting reffered to the last msg */}
                <div ref={ref}></div>
            </ul>
        ) : (
            <div className="no-msgs-box">
                <img
                    src="https://res.cloudinary.com/duzlefgz6/image/upload/v1696327250/dkqusq18u0j9ynzn3grl.avif"
                    alt=""
                    className="no-msgs-img"
                />
                <h4 className="starting-new-room">You're starting new room</h4>
                <p className="type-first-msg">Type your first message below.</p>
            </div>
        );
    };

    // const chatbox = document.getElementById("CHATBOXID");
    // chatbox &&
    //     chatbox.addEventListener("scroll", () => {
    //         if (chatbox.scrollTop === 0) {
    //             // User has scrolled to the top
    //             // loadMoreDocuments();
    //             console.log(chatbox.scrollTop, "scroll");
    //             // loadMoreRoomMessages();
    //         }
    //     });

    return (
        <div className="chatbox-container">
            {roomId ? (
                <>
                    {roomDetails !== null && (
                        <ChatHeader roomParticipants={roomParticipants} roomDetails={roomDetails} />
                    )}
                    {renderMsgs()}
                    <ChatFooter sendMsg={sendMsg} />
                </>
            ) : (
                <>
                    <img src={ChatAppRemoveBgLogo} alt="" className="chat-box-app-logo" />
                    <p className="chat-box-app-caption">Send and recive the messages simple and seemless way!</p>
                </>
            )}
        </div>
    );
};

export default Chatbox;
