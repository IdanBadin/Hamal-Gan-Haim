// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJhvGJU2t7YVuPI6ibeJVfujywYPFRq-U",
    authDomain: "hamal-gan-haim-d7041.firebaseapp.com",
    projectId: "hamal-gan-haim-d7041",
    storageBucket: "hamal-gan-haim-d7041.appspot.com",
    messagingSenderId: "715588532208",
    appId: "1:715588532208:web:c7ef59540631c7c2ef8f35"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

class DataManager {
    constructor() {
        this.db = firebase.firestore();
    }

    async fetchData(collectionName, docId) {
        try {
            const doc = await this.db.collection(collectionName).doc(docId).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error(`Error fetching data from ${collectionName}/${docId}:`, error);
            throw error;
        }
    }

    async saveData(collectionName, docId, data) {
        try {
            await this.db.collection(collectionName).doc(docId).set(data, { merge: true });
            console.log(`Data saved to ${collectionName}/${docId}`);
        } catch (error) {
            console.error(`Error saving data to ${collectionName}/${docId}:`, error);
            throw error;
        }
    }

    subscribeToData(collectionName, docId, callback) {
        return this.db.collection(collectionName).doc(docId).onSnapshot((doc) => {
            if (doc.exists) {
                callback(doc.data());
            } else {
                console.warn(`No document found at ${collectionName}/${docId}`);
                callback(null);
            }
        }, (error) => {
            console.error(`Error listening to ${collectionName}/${docId}:`, error);
        });
    }

    async deleteTableFromList(collectionName, docId, listKey, itemToRemove) {
        try {
            await this.db.collection(collectionName).doc(docId).update({
                [listKey]: firebase.firestore.FieldValue.arrayRemove(itemToRemove)
            });
        } catch (error) {
            console.error("Error removing item from array:", error);
            throw error;
        }
    }
}

// Export a singleton instance
window.dataManager = new DataManager();
