import { create } from "zustand";
import secure from "./secure";
import api, { ADDRESS } from "./api";
import utils from "./utils";
import { useReducer } from "react";

//-------------------------------------
//     Socket receive message handlers
//-------------------------------------

function responseFriendList(set, get, friendList) {
  set((state) => ({
    friendList:friendList
  }))
}

function responseRequestAccept(set, get, connection) {
  const user = get().user;
  // if i was the one who sent the request, remove
  // request from the request list
  if (user.username === connection.receiver.username) {
    const requestList = [...get().requestList];
    const requestIndex = requestList.findIndex(
      (request) => request.id === connection.id
    );
    if (requestIndex >= 0) {
      requestList.splice(requestIndex, 1);
      set((state) => ({
        requestList: requestList,
      }));
    }
  }

  // if the corrsponding user is contained within
  // the searchList for the acceptor or the accepte
  // update the state of the searchList item

  const sl = get().searchList;
  if (sl === null) {
    return;
  }

  const searchList = [...sl];
  let searchIndex = -1;
  // if this user is accepted
  if (user.username === connection.receiver.username) {
    searchIndex = searchList.findIndex(
      (user) => user.username === connection.sender.username
    );
  }
  // if the other user is accepted
  else {
    searchIndex = searchList.findIndex(
      (user) => user.username === connection.receiver.username
    );
  }

  if (searchIndex >= 0) {
    searchList[searchIndex].status = "connected";
    set((state) => ({
      searchList: searchList,
    }));
  }
}

function responseRequestConnect(set, get, connection) {
  const user = get().user;
  // If i was the one that made the connect request,
  // update the search list row
  if (user.username === connection.sender.username) {
    const searchList = [...get().searchList];
    const searchIndex = searchList.findIndex(
      (request) => request.username === connection.receiver.username
    );
    if (searchIndex >= 0) {
      searchList[searchIndex].status = "pending-them";
      set((state) => ({
        searchList: searchList,
      }));
    }
    // If they were the one  that sent the connect
    // request, add request to request list
  } else {
    const requestList = [...get().requestList];
    const requestIndex = requestList.findIndex(
      (request) => request.sender.username === connection.sender.username
    );
    if (requestIndex === -1) {
      requestList.unshift(connection);
      set((state) => ({
        requestList: requestList,
      }));
    }
  }
}

function responseRequestList(set, get, requestList) {
  set((state) => ({
    requestList: requestList,
  }));
}

function responseThumbnail(set, get, data) {
  set((state) => ({
    user: data,
  }));
}

function responseSearch(set, get, data) {
  set((state) => ({
    searchList: data,
  }));
}

const useGlobal = create((set, get) => ({
  //---------------------
  //   Initialization
  //---------------------

  initialized: false,

  init: async () => {
    const credentials = await secure.get("credentials");
    if (credentials) {
      try {
        const response = await api({
          method: "POST",
          url: "/accounts/signin/",
          data: {
            username: credentials.username,
            password: credentials.password,
          },
        });
        if (response.status !== 200) {
          throw "Authentication error";
        }
        const user = response.data.user;
        const tokens = response.data.tokens;

        secure.set("tokens", tokens);

        set((state) => ({
          initialized: true,
          authenticated: true,
          user: user,
        }));
        return;
      } catch (error) {
        console.log("useGlobal.init: ", error);
      }
    }
    set((state) => ({
      initialized: true,
    }));
  },

  //---------------------
  //   Authentication
  //---------------------

  authenticated: false,
  user: {},

  login: (credentials, user, tokens) => {
    secure.set("credentials", credentials);
    secure.set("tokens", tokens);
    set((state) => ({
      authenticated: true,
      user: user,
    }));
  },

  logout: () => {
    secure.wipe();
    set((state) => ({
      authenticated: false,
      user: {},
    }));
  },

  //---------------------
  //     Websocket
  //---------------------

  socket: null,

  socketConnect: async () => {
    const tokens = await secure.get("tokens");

    const url = `ws://${ADDRESS}/chat/?token=${tokens.access}`;

    const socket = new WebSocket(url);
    socket.onopen = () => {
      utils.log("socket.onopen");

      socket.send(
        JSON.stringify({
          source: "request.list",
        })
      );

      socket.send(
        JSON.stringify({
          source: "friend.list",
        })
      );
    };

    socket.onmessage = (event) => {
      // Convert data to javascript object
      const parsed = JSON.parse(event.data);

      // Debug log formatted  data
      utils.log("onmessage:", parsed);

      const responses = {
        "friend.list": responseFriendList,
        "request.accept": responseRequestAccept,
        "request.connect": responseRequestConnect,
        "request.list": responseRequestList,
        search: responseSearch,
        thumbnail: responseThumbnail,
      };

      const resp = responses[parsed.source];
      if (!resp) {
        utils.log('parsed.source "' + parsed.source + '" not found');
        return;
      }
      // Call response function
      resp(set, get, parsed.data);
    };
    socket.onerror = (e) => {
      utils.log("socket.onerror", e.message);
    };
    socket.onclose = () => {
      utils.log("socket.onclose");
    };
    set((state) => ({
      socket: socket,
    }));
  },

  socketClose: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
    }
    set((state) => ({
      socket: null,
    }));
  },

  //---------------------
  //   Search
  //---------------------

  searchList: null,

  searchUsers: (query) => {
    if (query) {
      const socket = get().socket;
      socket.send(
        JSON.stringify({
          source: "search",
          query: query,
        })
      );
    } else {
      set((state) => ({
        searchList: null,
      }));
    }
  },

  //---------------------
  //     Thumbnail
  //---------------------

  uploadThumbnail: (file) => {
    const socket = get().socket;
    socket.send(
      JSON.stringify({
        source: "thumbnail",
        base64: file.base64,
        filename: file.name,
      })
    );
  },

  //---------------------
  //     Friends
  //---------------------

  friendList: null,

  //---------------------
  //     Requests
  //---------------------

  requestList: null,

  requestAccept: (username) => {
    const socket = get().socket;
    socket.send(
      JSON.stringify({
        source: "request.accept",
        username: username,
      })
    );
  },

  requestConnect: (username) => {
    const socket = get().socket;
    socket.send(
      JSON.stringify({
        source: "request.connect",
        username: username,
      })
    );
  },
}));

export default useGlobal;
