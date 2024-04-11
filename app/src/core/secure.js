import * as SecureStore from "expo-secure-store";

async function set(key, object) {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(object));
  } catch (error) {
    console.log("secure.set:", error);
  }
}

async function get(key) {
  try {
    const data = await SecureStore.getItemAsync(key);
    if (data !== null) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.log("secure.get:", error);
  }
}

async function remove(key) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log("secure.remove:", error);
  }
}

async function wipe() {
  try {
    // Attempt to delete individual items
    await SecureStore.deleteItemAsync("credentials");
    await SecureStore.deleteItemAsync("tokens");
    // Add more items to delete if needed
  } catch (error) {
    console.log("Error while wiping data:", error);
  }
}


// async function set(key, object) {
// 	try {
// 		await EncryptedStorage.setItem(key, JSON.stringify(object))
// 	} catch (error) {
// 		console.log('secure.set:', error)
// 	}
// }

// async function get(key) {
// 	try {
// 		const data = await EncryptedStorage.getItem(key)
// 		if (data !== undefined) {
// 			return JSON.parse(data)
// 		}
// 	} catch (error) {
// 		console.log('secure.get:', error)
// 	}
// }

// async function remove(key) {
// 	try {
// 		await EncryptedStorage.removeItem(key)
// 	} catch (error) {
// 		console.log('secure.remove:', error)
// 	}
// }

// async function wipe() {
// 	try {
// 		await EncryptedStorage.clear()
// 	} catch (error) {
// 		console.log('secure.wipe:', error)
// 	}
// }

export default { set, get, remove, wipe };
