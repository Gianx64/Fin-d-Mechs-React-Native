import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.estoyop.rntest",
  projectId: "6650f527000272301fa1",
  storageId: "6652b6fb002a175738b2",
  databaseId: "6652b5c500381db7addd",
  userCollectionId: "6652b5fa002d3cd8ee23",
  appointmentCollectionId: "6653bdee001c1220a6b1",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username, mech) {
  try {
    try { await account.deleteSession("current"); } catch (error) {}
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
        mech: mech
      }
    );

    if (!newUser) throw Error;

    await signIn(email, password);

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    try { await account.deleteSession("current"); } catch (error) {}
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    //TODO: mensajes para cada error
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    console.log("User loading finished. Got: "+currentUser.documents[0].email);
    return currentUser.documents[0];
  } catch (error) {
    console.log("User loading error.");
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Register Appointment
export async function createAppointment(appointment) {
  try {
    const newAppointment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentCollectionId,
      ID.unique(),
      {
        user: appointment.user,
        date: appointment.date,
        city: appointment.city,
        address: appointment.address,
        car_make: appointment.car_make,
        car_model: appointment.car_model,
        description: appointment.description,
        service: appointment.service,
        workshop_id: appointment.workshop_id,
        mech: appointment.mech
      }
    );

    if (!newAppointment) throw Error;

    console.log("Appointment created, ID: "+newAppointment.$id);
    return newAppointment;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Appointments
export const getAppointments = async (user) => {
  if (user.mech) {
    try {
      const appointments = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.appointmentCollectionId,
        [Query.equal("mech", user.email)]
      );

      console.log("Appointment loading finished for: "+user.email);
      return appointments.documents;
    } catch (error) {
      console.log("Appointment loading error for: "+user.email);
      console.log(error);
      return null;
    }
  } else {
    try {
      const appointments = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.appointmentCollectionId,
        [Query.equal("user", user.email)]
      );

      if (!appointments) throw Error;

      console.log("Appointment loading finished for: "+user.email);
      return appointments.documents;
    } catch (error) {
      console.log("Appointment loading error for: "+user.email);
      console.log(error);
      return null;
    }
  }
}

// Get Single Appointment
export const getAppointment = async (appointmentID) => {
  try {
    const appointments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentCollectionId,
      [Query.equal("id", appointmentID)]
    );
    console.log("Appointment loading id: "+appointmentID);
    return appointments.documents;
  } catch (error) {
    console.log("Appointment loading error id: "+appointmentID);
    console.log(error);
    return null;
  }
}

// Update Appointment
export const updateAppointment = async (appointment) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentCollectionId,
      appointment.$id,
      {
        user: appointment.user,
        date: appointment.date,
        city: appointment.city,
        address: appointment.address,
        car_make: appointment.car_make,
        car_model: appointment.car_model,
        description: appointment.description,
        service: appointment.service,
        workshop_id: appointment.workshop_id,
        mech: appointment.mech
      }
    );

    if (!updatedAppointment) throw Error;

    console.log("Appointment updated, ID: "+updatedAppointment.$id);
    return updatedAppointment;
  } catch (error) {
    throw new Error(error);
  }
}

// Cancel Appointment
export const cancelAppointment = async (id) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentCollectionId,
      id,
      { cancelled: true }
    );

    if (!updatedAppointment) throw Error;

    console.log("Appointment cancelled, ID: "+updatedAppointment.$id);
    return updatedAppointment;
  } catch (error) {
    throw new Error(error);
  }
}

// Confirm Appointment
export const confirmAppointment = async (documentId) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentCollectionId,
      documentId,
      { confirmed: true }
    );

    if (!updatedAppointment) throw Error;

    console.log("Appointment confirmed, ID: "+updatedAppointment.$id);
    return updatedAppointment;
  } catch (error) {
    throw new Error(error);
  }
}

// Complete Appointment
export const completeAppointment = async (id) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentCollectionId,
      id,
      { completed: true }
    );

    if (!updatedAppointment) throw Error;

    console.log("Appointment completed, ID: "+updatedAppointment.$id);
    return updatedAppointment;
  } catch (error) {
    throw new Error(error);
  }
}