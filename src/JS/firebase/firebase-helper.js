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
} from "firebase/firestore";

/* ================ HELPER FUNCTIONS ================ */

// generate unique ID
const generateId = (prefix) => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// handle Errors
const handleError = (operation, error) => {
  console.error(`Error in ${operation}:`, error);
  throw new Error(`${operation} failed: ${error.message}`);
};

// check if document exists
const documentExists = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

/* ================ USERS ================ */

//create new account
export const createUser = async (id = null, data) => {
  try {
    // Validation
    if (!data.name || !data.email || !data.role) {
      throw new Error("Missing required fields: name, email, role");
    }

    const userId = id || generateId("user");

    await setDoc(doc(db, "users", userId), {
      Name: data.name,
      role: data.role,
      email: data.email.toLowerCase(),
      courses: data.courses || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`User created: ${userId}`);
    return userId;
  } catch (error) {
    handleError("createUser", error);
  }
};

// get single user by ID
export const getUser = async (id) => {
  console.log("Fetching user with ID:", id);
  try {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn(`User not found: ${id}`);
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    handleError("getUser", error);
  }
};

/**
 * جلب كل المستخدمين مع pagination
 */
export const getAllUsers = async (limitCount = 50, lastDoc = null) => {
  try {
    let q = query(
      collection(db, "users"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));


    //
    return {
      users,
      lastVisible: snapshot.docs[snapshot.docs.length - 1],
      hasMore: snapshot.docs.length === limitCount,
    };
  } catch (error) {
    handleError("getAllUsers", error);
  }
};

// get users by role
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
  }
};

// update user
export const updateUser = async (id, data) => {
  try {
    const exists = await documentExists("users", id);
    if (!exists) throw new Error(`User not found: ${id}`);

    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    console.log(` User updated: ${id}`);
  } catch (error) {
    handleError("updateUser", error);
  }
};
// delete user
export const deleteUser = async (id) => {
  try {
    const docRef = doc(db, "users", id);
    await deleteDoc(docRef);
    console.log(` User deleted: ${id}`);
  } catch (error) {
    handleError("deleteUser", error);
  }
};

/* ================ COURSES ================ */

//create a new course
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

    console.log(` Course created: ${courseId}`);
    return courseId;
  } catch (error) {
    handleError("createCourse", error);
  }
};

// get single course by ID
export const getCourse = async (id) => {
  try {
    const docRef = doc(db, "courses", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    handleError("getCourse", error);
  }
};

// get all courses
export const getAllCourses = async () => {
  try {
    const colRef = collection(db, "courses");
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleError("getAllCourses", error);
  }
};

// get courses by department
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
  }
};

// update course
export const updateCourse = async (id, data) => {
  try {
    const docRef = doc(db, "courses", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log(` Course updated: ${id}`);
  } catch (error) {
    handleError("updateCourse", error);
  }
};

// delete course
export const deleteCourse = async (id) => {
  try {
    const docRef = doc(db, "courses", id);
    await deleteDoc(docRef);
    console.log(` Course deleted: ${id}`);
  } catch (error) {
    handleError("deleteCourse", error);
  }
};

/* ================ DEPARTMENTS ================ */

//create a new department
export const createDepartment = async (id = null, data) => {
  try {
    if (!data.dName) {
      throw new Error("Missing required field: dName");
    }

    const deptId = id || generateId("dept");

    await setDoc(doc(db, "departments", deptId), {
      dName: data.dName,
      departmentId: deptId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(` Department created: ${deptId}`);
    return deptId;
  } catch (error) {
    handleError("createDepartment", error);
  }
};

// get single department by ID
export const getDepartment = async (id) => {
  try {
    const docRef = doc(db, "departments", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    handleError("getDepartment", error);
  }
};

// get all departments
export const getAllDepartments = async () => {
  try {
    const colRef = collection(db, "departments");
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleError("getAllDepartments", error);
  }
};

// update department
export const updateDepartment = async (id, data) => {
  try {
    const docRef = doc(db, "departments", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log(` Department updated: ${id}`);
  } catch (error) {
    handleError("updateDepartment", error);
  }
};

// delete department
export const deleteDepartment = async (id) => {
  try {
    const docRef = doc(db, "departments", id);
    await deleteDoc(docRef);
    console.log(` Department deleted: ${id}`);
  } catch (error) {
    handleError("deleteDepartment", error);
  }
};

/* ================ ATTENDANCE ================ */

//maark attendance for a student in a course
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

    console.log(` Attendance marked: ${attId}`);
    return attId;
  } catch (error) {
    handleError("markAttendance", error);
  }
};

//mark bulk attendance
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
    console.log(` Bulk attendance marked: ${ids.length} records`);
    return ids;
  } catch (error) {
    handleError("markBulkAttendance", error);
  }
};

// get single attendance by ID
export const getAttendance = async (id) => {
  try {
    const docRef = doc(db, "attendance", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    handleError("getAttendance", error);
  }
};

//get attendance records by course
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
  }
};

// get attendance records by student
export const getStudentAttendance = async (studentId) => {
  try {
    const studentRef = doc(db, "users", studentId);
    const q = query(
      collection(db, "attendance"),
      where("student", "==", studentRef),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleError("getStudentAttendance", error);
  }
};

// get attendance records by department
export const getDepartmentAttendance = async (departmentId) => {
  try {
    // استخدام Reference بدل ID string
    const departmentRef = doc(db, "departments", departmentId);

    // جلب الكورسات فقط بدون كل البيانات
    const coursesQuery = query(
      collection(db, "courses"),
      where("department", "==", departmentRef)
    );
    const coursesSnapshot = await getDocs(coursesQuery);
    const courseRefs = coursesSnapshot.docs.map((doc) => doc.ref);

    if (courseRefs.length === 0) return [];

    // استخدام where with 'in' بدلاً من filter
    // ملحوظة: Firestore تدعم max 10 items في 'in' query
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
  }
};

// update attendance
export const updateAttendance = async (id, data) => {
  try {
    const docRef = doc(db, "attendance", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log(`Attendance updated: ${id}`);
  } catch (error) {
    handleError("updateAttendance", error);
  }
};

// delete attendance
export const deleteAttendance = async (id) => {
  try {
    const docRef = doc(db, "attendance", id);
    await deleteDoc(docRef);
    console.log(` Attendance deleted: ${id}`);
  } catch (error) {
    handleError("deleteAttendance", error);
  }
};

/* ================ NOTIFICATIONS ================ */

// create a new notification
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
      read: data.read || false,
      date: data.date || serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    console.log(` Notification created: ${notifId}`);
    return notifId;
  } catch (error) {
    handleError("createNotification", error);
  }
};

// create bulk notifications
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
    console.log(` Bulk notifications created: ${ids.length} records`);
    return ids;
  } catch (error) {
    handleError("createBulkNotifications", error);
  }
};

// get single notification by ID
export const getNotification = async (id) => {
  try {
    const docRef = doc(db, "notifications", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    handleError("getNotification", error);
  }
};

// get notifications for a user
export const getNotificationsForUser = async (userId, unreadOnly = false) => {
  try {
    const userRef = doc(db, "users", userId);
    let q = query(
      collection(db, "notifications"),
      where("user", "==", userRef),
      orderBy("date", "desc")
    );

    if (unreadOnly) {
      q = query(q, where("read", "==", false));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleError("getNotificationsForUser", error);
  }
};

//update notification
export const updateNotification = async (id, data) => {
  try {
    const docRef = doc(db, "notifications", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log(` Notification updated: ${id}`);
  } catch (error) {
    handleError("updateNotification", error);
  }
};

// mark notifications as read (batch)
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
  } catch (error) {
    handleError("markNotificationsAsRead", error);
  }
};

//delete notification
export const deleteNotification = async (id) => {
  try {
    const docRef = doc(db, "notifications", id);
    await deleteDoc(docRef);
    console.log(` Notification deleted: ${id}`);
  } catch (error) {
    handleError("deleteNotification", error);
  }
};

// delete all notifications for a user
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
  } catch (error) {
    handleError("deleteAllUserNotifications", error);
  }
};
