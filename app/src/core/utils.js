import { Platform } from "react-native";
import ProfileImage from "../assets/Profile.webp";
import { ADDRESS } from "./api";

function log() {
  // Much better console.log function that formats/indents
  // objects for better reabability
  for (let i = 0; i < arguments.length; i++) {
    let arg = arguments[i];
    // Stringify and indent object
    if (typeof arg === "object") {
      arg = JSON.stringify(arg, null, 2);
    }
    console.log(`[${Platform.OS}]`, arg);
  }
}

function thumbnail(url) {
	if (!url) {
		return ProfileImage
	}
	return {
		uri: 'http://' + ADDRESS + url
	}
}


export default { log, thumbnail };
