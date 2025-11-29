import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  writeBatch,
  serverTimestamp,
  orderBy,
  limit,
  startAfter,
  addDoc,
} from "firebase/firestore";

/* ================ HELPER FUNCTIONS ================ */

// generate unique ID
const generateId = (prefix) => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// check if document exists
const documentExists = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

// Error handler function
const handleError = (functionName, error) => {
  console.error(`Error in ${functionName}:`, error);
  throw error;
};

/* ================ USERS ================ */

// Create new account
export const createUser = async (id = null, data) => {
  try {
    if (!data.name || !data.email || !data.role) {
      throw new Error("Missing required fields: name, email, role");
    }

    const userId = id || generateId("user");
    const userCourses = Array.isArray(data.courses) ? data.courses : [];

    await setDoc(doc(db, "users", userId), {
      name: data.name,
      role: data.role,
      email: data.email.toLowerCase(),
      department: data.department || "",
      courses: userCourses,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`User created: ${userId}`);
    return userId;
  } catch (error) {
    handleError("createUser", error);
    return null;
  }
};

// Get all users with pagination
export const getAllUsers = async (limitCount = 50, lastDoc = null) => {
  try {
    const usersRef = collection(db, "users");
    let q = query(usersRef, orderBy("createdAt", "desc"), limit(limitCount));

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { users: [], lastVisible: null, hasMore: false };
    }

    const users = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        name: d.name || "",
        email: d.email || "",
        role: d.role || "student",
        courses: Array.isArray(d.courses) ? d.courses : [],
        department: d.department || "",
        createdAt: d.createdAt || null,
      };
    });

    return {
      users,
      lastVisible: snapshot.docs[snapshot.docs.length - 1],
      hasMore: snapshot.docs.length === limitCount,
    };
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return { users: [], lastVisible: null, hasMore: false };
  }
};

// Get single user by ID
export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    return {
      id: userSnap.id,
      ...userSnap.data(),
    };
  } catch (error) {
    handleError("getUserById", error);
    return null;
  }
};

// Add new user (alternative to createUser using addDoc)
export const addUser = async (userData) => {
  try {
    const usersRef = collection(db, "users");
    const newUser = {
      ...userData,
      email: userData.email?.toLowerCase() || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(usersRef, newUser);
    return {
      id: docRef.id,
      ...newUser,
    };
  } catch (error) {
    handleError("addUser", error);
    return null;
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
    console.log(`User updated: ${userId}`);
    return true;
  } catch (error) {
    handleError("updateUser", error);
    return false;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    console.log(`User deleted: ${userId}`);
    return true;
  } catch (error) {
    handleError("deleteUser", error);
    return false;
  }
};

// Get users by role
export const getUsersByRole = async (role) => {
  try {
    const q = query(
      collection(db, "users"),
      where("role", "==", role),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleError("getUsersByRole", error);
    return [];
  }
};

/* ================ COURSES ================ */

// Create a new course
export const createCourse = async (id = null, data) => {
  try {
    if (!data.CId || !data.Name || !data.department) {
      throw new Error("Missing required fields: CId, Name, department");
    }
    const courseId = id || generateId("course");
    await setDoc(doc(db, "courses", courseId), {
      CId: data.CId,
      Name: data.Name,
      department: data.department,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`Course created: ${courseId}`);
    return courseId;
  } catch (error) {
    handleError("createCourse", error);
    return null;
  }
};

// Get all courses
export const getAllCourses = async () => {
  try {
    const snapshot = await getDocs(collection(db, "courses"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleError("getAllCourses", error);
    return [];
  }
};

// Get single course by ID
export const getCourse = async (id) => {
  try {
    const docRef = doc(db, "courses", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    handleError("getCourse", error);
    return null;
  }
};

// Get courses by department
export const getCoursesByDepartment = async (departmentId) => {
  try {
    const departmentRef = doc(db, "departments", departmentId);
    const q = query(
      collection(db, "courses"),
      where("department", "==", departmentRef)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleError("getCoursesByDepartment", error);
    return [];
  }
};

// Update course
export const updateCourse = async (id, data) => {
  try {
    const docRef = doc(db, "courses", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log(`Course updated: ${id}`);
    return true;
  } catch (error) {
    handleError("updateCourse", error);
    return false;
  }
};

// Delete course
export const deleteCourse = async (id) => {
  try {
    const docRef = doc(db, "courses", id);
    await deleteDoc(docRef);
    console.log(`Course deleted: ${id}`);
    return true;
  } catch (error) {
    handleError("deleteCourse", error);
    return false;
  }
};

/* ================ DEPARTMENTS ================ */

// Create a new department
export const createDepartment = async (id = null, data) => {
  try {
    if (!data.dName) throw new Error("Missing required field: dName");
    const deptId = id || generateId("dept");
    await setDoc(doc(db, "departments", deptId), {
      dName: data.dName,
      departmentId: deptId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`Department created: ${deptId}`);
    return deptId;
  } catch (error) {
    handleError("createDepartment", error);
    return null;
  }
};

// Get all departments
export const getAllDepartments = async () => {
  try {
    const snapshot = await getDocs(collection(db, "departments"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleError("getAllDepartments", error);
    return [];
  }
};

// Get single department by ID
export const getDepartment = async (id) => {
  try {
    const docRef = doc(db, "departments", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    handleError("getDepartment", error);
    return null;
  }
};

// Update department
export const updateDepartment = async (id, data) => {
  try {
    const docRef = doc(db, "departments", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log(`Department updated: ${id}`);
    return true;
  } catch (error) {
    handleError("updateDepartment", error);
    return false;
  }
};

// Delete department
export const deleteDepartment = async (id) => {
  try {
    const docRef = doc(db, "departments", id);
    await deleteDoc(docRef);
    console.log(`Department deleted: ${id}`);
    return true;
  } catch (error) {
    handleError("deleteDepartment", error);
    return false;
  }
};

/* ================ ATTENDANCE ================ */

// Mark attendance
export const markAttendance = async (id = null, data) => {
  try {
    if (!data.course || !data.student || !data.status) {
      throw new Error("Missing required fields: course, student, status");
    }

    const attId = id || generateId("att");
    await setDoc(doc(db, "attendance", attId), {
      ...data,
      date: data.date || serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    console.log(`Attendance marked: ${attId}`);
    return attId;
  } catch (error) {
    handleError("markAttendance", error);
    return null;
  }
};

// Get student attendance
export const getStudentAttendance = async (studentId) => {
  try {
    const q = query(
      collection(db, "attendance"),
      where("student", "==", doc(db, "users", studentId)),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleError("getStudentAttendance", error);
    return [];
  }
};

// Mark bulk attendance
export const markBulkAttendance = async (attendanceList) => {
  try {
    const batch = writeBatch(db);
    const ids = [];

    for (const data of attendanceList) {
      const attId = generateId("att");
      const docRef = doc(db, "attendance", attId);

      batch.set(docRef, {
        ...data,
        date: data.date || serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      ids.push(attId);
    }

    await batch.commit();
    console.log(`Bulk attendance marked: ${ids.length} records`);
    return ids;
  } catch (error) {
    handleError("markBulkAttendance", error);
    return [];
  }
};

// Get single attendance by ID
export const getAttendance = async (id) => {
  try {
    const docRef = doc(db, "attendance", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    handleError("getAttendance", error);
    return null;
  }
};

// Get attendance records by course
export const getCourseAttendance = async (courseId) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    const q = query(
      collection(db, "attendance"),
      where("course", "==", courseRef),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleError("getCourseAttendance", error);
    return [];
  }
};

// Get attendance records by department
export const getDepartmentAttendance = async (departmentId) => {
  try {
    const departmentRef = doc(db, "departments", departmentId);

    const coursesQuery = query(
      collection(db, "courses"),
      where("department", "==", departmentRef)
    );
    const coursesSnapshot = await getDocs(coursesQuery);
    const courseRefs = coursesSnapshot.docs.map((doc) => doc.ref);

    if (courseRefs.length === 0) return [];

    // Firestore supports max 10 items in 'in' query
    const attendancePromises = [];
    for (let i = 0; i < courseRefs.length; i += 10) {
      const batch = courseRefs.slice(i, i + 10);
      const q = query(
        collection(db, "attendance"),
        where("course", "in", batch)
      );
      attendancePromises.push(getDocs(q));
    }

    const results = await Promise.all(attendancePromises);
    const allDocs = results.flatMap((snapshot) =>
      snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );

    return allDocs;
  } catch (error) {
    handleError("getDepartmentAttendance", error);
    return [];
  }
};

// Update attendance
export const updateAttendance = async (id, data) => {
  try {
    const docRef = doc(db, "attendance", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log(`Attendance updated: ${id}`);
    return true;
  } catch (error) {
    handleError("updateAttendance", error);
    return false;
  }
};

// Delete attendance
export const deleteAttendance = async (id) => {
  try {
    const docRef = doc(db, "attendance", id);
    await deleteDoc(docRef);
    console.log(`Attendance deleted: ${id}`);
    return true;
  } catch (error) {
    handleError("deleteAttendance", error);
    return false;
  }
};

/* ================ NOTIFICATIONS ================ */

// Create a new notification
export const createNotification = async (id = null, data) => {
  try {
    if (!data.title || !data.message || !data.user) {
      throw new Error("Missing required fields: title, message, user");
    }
    const notifId = id || generateId("notif");
    await setDoc(doc(db, "notifications", notifId), {
      title: data.title,
      message: data.message,
      user: data.user,
      read: false,
      date: data.date || serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    console.log(`Notification created: ${notifId}`);
    return notifId;
  } catch (error) {
    handleError("createNotification", error);
    return null;
  }
};

// Get notifications for user
export const getNotificationsForUser = async (userId) => {
  try {
    const q = query(
      collection(db, "notifications"),
      where("user", "==", doc(db, "users", userId)),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleError("getNotificationsForUser", error);
    return [];
  }
};

// Create bulk notifications
export const createBulkNotifications = async (notificationsList) => {
  try {
    const batch = writeBatch(db);
    const ids = [];

    for (const data of notificationsList) {
      const notifId = generateId("notif");
      const docRef = doc(db, "notifications", notifId);

      batch.set(docRef, {
        title: data.title,
        message: data.message,
        user: data.user,
        read: false,
        date: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      ids.push(notifId);
    }

    await batch.commit();
    console.log(`Bulk notifications created: ${ids.length} records`);
    return ids;
  } catch (error) {
    handleError("createBulkNotifications", error);
    return [];
  }
};

// Get single notification by ID
export const getNotification = async (id) => {
  try {
    const docRef = doc(db, "notifications", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    handleError("getNotification", error);
    return null;
  }
};

// Update notification
export const updateNotification = async (id, data) => {
  try {
    const docRef = doc(db, "notifications", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log(`Notification updated: ${id}`);
    return true;
  } catch (error) {
    handleError("updateNotification", error);
    return false;
  }
};

// Mark notifications as read (batch)
export const markNotificationsAsRead = async (notificationIds) => {
  try {
    const batch = writeBatch(db);

    for (const id of notificationIds) {
      const docRef = doc(db, "notifications", id);
      batch.update(docRef, {
        read: true,
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
    console.log(`Marked ${notificationIds.length} notifications as read`);
    return true;
  } catch (error) {
    handleError("markNotificationsAsRead", error);
    return false;
  }
};

// Delete notification
export const deleteNotification = async (id) => {
  try {
    const docRef = doc(db, "notifications", id);
    await deleteDoc(docRef);
    console.log(`Notification deleted: ${id}`);
    return true;
  } catch (error) {
    handleError("deleteNotification", error);
    return false;
  }
};

// Delete all notifications for a user
export const deleteAllUserNotifications = async (userId) => {
  try {
    const notifications = await getNotificationsForUser(userId);
    const batch = writeBatch(db);

    for (const notif of notifications) {
      const docRef = doc(db, "notifications", notif.id);
      batch.delete(docRef);
    }

    await batch.commit();
    console.log(
      `Deleted ${notifications.length} notifications for user: ${userId}`
    );
    return true;
  } catch (error) {
    handleError("deleteAllUserNotifications", error);
    return false;
  }
};
