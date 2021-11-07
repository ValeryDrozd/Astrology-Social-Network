import ws from "k6/ws";
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";
import http from "k6/http";
import { sleep, check } from "k6";
export default function sendMessages({ accessToken1, accessToken2 }) {
    const getWsParams = (accessToken) => ({
      headers: {
        cookie: `accessToken=${accessToken}`,
      },
    });
  
    const getRequestParams = (accessToken) => ({
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const profileRequest = (accessToken) =>
      http.get(`${url}/user/me`, getRequestParams(accessToken));
    // const profileResponse1 = profileRequest(accessToken1);
    const profile1 = JSON.parse(profileRequest(accessToken1).body);
    const profile2 = JSON.parse(profileRequest(accessToken2).body);
    let chat;
  
    const pack1 = {
      profile: profile1,
      otherProfile: profile2,
      counter: 1,
      accessToken: accessToken1,
    };
    const pack2 = {
      profile: profile2,
      otherProfile: profile1,
      counter: 1,
      accessToken: accessToken2,
    };
  
    // console.log(JSON.stringify(pack1))
  
    const generateMessage = (pack) => {
      const id = pack.counter++;
      const message = {
        id,
        jsonrpc: "2.0",
        method: "addNewMessage",
        params: {
          chatID: chat.chatID,
          messageID: uuidv4(),
          senderID: pack.profile.userID,
          text: (Math.random() * 1000).toString(),
          time: Date.now().toString(),
        },
      };
      return message;
    };
    const getConnection = (pack) =>
      ws.connect(
        "ws://localhost/chattings",
        getWsParams(pack.accessToken),
        function (socket) {
          socket.on("open", () => {
            if (!chat) {
              socket.send(
                JSON.stringify({
                  jsonrpc: "2.0",
                  method: "getMessages",
                  params: null,
                  id: pack.counter++,
                })
              );
            }
          });
          socket.on("message", (data) => {
            const res = JSON.parse(data);
            if (res.notification && res.notification == "connection-status")
              return;
            else if (res.result && res.id == 1) {
              chat = res.result.find(
                (item) => item.senderInfo.senderID == pack.otherProfile.userID
              );
              const message = generateMessage(pack);
              socket.send(JSON.stringify(message));
              socket.close();
            }
          });
          // socket.on("close", () => console.log("disconnected"));
        }
      );
  
    const res = getConnection(Math.random() > 0.5 ? pack1 : pack2);
    check(res, { "Stay connected via WebSocket (status 101)": (r) => r && r.status === 101 });
    sleep(1);
  }