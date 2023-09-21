import { onSnapshot, collection, query, serverTimestamp, addDoc, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase-config";
import { useEffect, useState, useRef } from "react";
import ChatFooter from "../ChatFooter";
import ChatHeader from "../ChatHeader";
import MsgItem from "../MsgItem";
import ChatAppRemoveBgLogo from "../../Img/ChatAppRemoveBgLogo.png";
import "./index.css";

const Chatbox = (props) => {
    const { activeRoomDetails } = props;
    const { roomId } = activeRoomDetails;
    const [userData, setUserData] = useState({});
    const [roomMessages, setRoomMessages] = useState();
    const [roomParticipants, setRoomParticipants] = useState([]);
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

            return () => {
                unsubParticipants();
                unsubMessages();
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

    const sendMsg = async (msg) => {
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
        await updateDoc(doc(db, "rooms", roomId), {
            "lastMsg.msgText": msg,
            "lastMsg.timeStamp": serverTimestamp(),
            "lastMsg.senderId": userData.userId,
            "lastMsg.senderName": userData.userName,
        });
    };
    
    return (
        <div className="chatbox-container">
            {roomId ? (
                <>
                    <ChatHeader roomParticipants={roomParticipants} />
                    <ul className="all-msgs">
                        {roomMessages?.map((e) => (
                            <MsgItem msgDetails={e} userData={userData} key={e.id} roomId={roomId} />
                        ))}

                        {/* div for always getting reffered to the last msg */}
                        <div ref={ref}></div>
                    </ul>
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
