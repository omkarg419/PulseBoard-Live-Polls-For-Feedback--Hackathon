import admin from "firebase-admin";
import serviceAccount from "../../../firebase/pulseboard-48ff4-firebase-adminsdk-fbsvc-ff05f02036.json" with { type: "json" };

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

export default admin;
