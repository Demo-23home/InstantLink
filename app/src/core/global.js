import { create } from "zustand";
import secure from "./secure";
import api, { ADDRESS } from "./api";
import utils from "./utils";

//-------------------------------------
//     Socket receive message handlers
//-------------------------------------

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
    };

    socket.onmessage = (event) => {
      // Convert data to javascript object
      const parsed = JSON.parse(event.data);

      // Debug log formatted data
      utils.log("onmessage", parsed);

      const responses = {
        thumbnail: responseThumbnail,
        search: responseSearch,
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
      utils.log("socket.onclose ");
    };

    set((state) => ({
      socket: socket,
    }));

    utils.log("TOKENS:", tokens);
  },

  socketClose: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
    }
    set((state) => ({
      state: null,
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
    // socket.send(
    //   JSON.stringify({source:"thumbnail",filename: file.name})
    // // filename: file.fileName,
    // );

    socket.send(
      JSON.stringify({
        source: "thumbnail",
        base64: file.base64,
        filename: file.name,
      })
    );
  },
}));

export default useGlobal;
