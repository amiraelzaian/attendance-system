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
  addDoc,
  getCountFromServer,
} from "firebase/firestore";

/* ---------------- Users ---------------- */

/**
 * إنشاء مستخدم جديد
 * @param {string} id - معرف المستخدم (اختياري، يولد تلقائي لو مش موجود)
 * @param {Object} data - بيانات المستخدم { name, role, email, courses }
 */
export const createUser = async (id, data) => {
  try {
    if (!id) {
      id = `user_${Date.now()}`;
    }

    await setDoc(doc(db, "users", id), {
      Name: data.name,
      role: data.role,
      email: data.email,
      courses: data.courses || [],
    });

    console.log(` User created with ID: ${id}`);
    return id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * جلب بيانات مستخدم واحد
 * @param {string} id - معرف المستخدم
 * @returns object أو null
 */
export const getUser = async (id) => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

/**
 * جلب كل المستخدمين
 * @returns Array من المستخدمين
 */
export const getAllUsers = async () => {
  const colRef = collection(db, "users");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * تعديل بيانات مستخدم
 * @param {string} id
 * @param {Object} data - أي حقول لتحديثها
 */
export const updateUser = async (id, data) => {
  const docRef = doc(db, "users", id);
  await updateDoc(docRef, data);
};

/**
 * حذف مستخدم
 * @param {string} id
 */
export const deleteUser = async (id) => {
  const docRef = doc(db, "users", id);
  await deleteDoc(docRef);
};

/* ---------------- Courses ---------------- */

/**
 * إنشاء كورس جديد
 * @param {string} id - معرف الكورس (اختياري)
 * @param {Object} data - { CId, Name, department: Reference }
 */
export const createCourse = async (id, data) => {
  try {
    if (!id) id = `course_${Date.now()}`;
    await setDoc(doc(db, "courses", id), {
      CId: data.CId,
      Name: data.Name,
      department: data.department,
    });
    console.log(` Course created with ID: ${id}`);
    return id;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

/**
 * جلب كورس واحد
 */
export const getCourse = async (id) => {
  try {
    const docRef = doc(db, "courses", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Error getting course:", error);
    throw error;
  }
};

/**
 * جلب كل الكورسات
 */
export const getAllCourses = async () => {
  try {
    const colRef = collection(db, "courses");
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all courses:", error);
    throw error;
  }
};

/**
 * تعديل كورس
 */
export const updateCourse = async (id, data) => {
  try {
    const docRef = doc(db, "courses", id);
    await updateDoc(docRef, data);
    console.log(`Course updated: ${id}`);
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

/**
 * حذف كورس
 */
export const deleteCourse = async (id) => {
  try {
    const docRef = doc(db, "courses", id);
    await deleteDoc(docRef);
    console.log(` Course deleted: ${id}`);
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

/* ---------------- Departments ---------------- */

/**
 * إنشاء قسم جديد
 * @param {string} id - documentId للقسم (اختياري)
 * @param {Object} data - { dName }
 */
export const createDepartment = async (id, data) => {
  try {
    if (!id) id = `dept_${Date.now()}`;
    await setDoc(doc(db, "departments", id), {
      dName: data.dName,
      departmentId: id,
    });
    console.log(` Department created with ID: ${id}`);
    return id;
  } catch (error) {
    console.error("Error creating department:", error);
    throw error;
  }
};

/**
 * جلب قسم واحد
 */
export const getDepartment = async (id) => {
  try {
    const docRef = doc(db, "departments", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Error getting department:", error);
    throw error;
  }
};

/**
 * جلب كل الأقسام
 */
export const getAllDepartments = async () => {
  try {
    const colRef = collection(db, "departments");
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all departments:", error);
    throw error;
  }
};

/**
 * تعديل قسم
 */
export const updateDepartment = async (id, data) => {
  try {
    const docRef = doc(db, "departments", id);
    await updateDoc(docRef, data);
    console.log(` Department updated: ${id}`);
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};

/**
 * حذف قسم
 */
export const deleteDepartment = async (id) => {
  try {
    const docRef = doc(db, "departments", id);
    await deleteDoc(docRef);
    console.log(`Department deleted: ${id}`);
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};

/* ---------------- Attendance ---------------- */

/**
 * تسجيل حضور أو غياب
 * @param {string} id - documentId للحضور (اختياري)
 * @param {Object} data - { course: Reference, date: Timestamp, student: Reference, status: "present"|"absent" }
 */
export const markAttendance = async (id, data) => {
  try {
    if (!id) id = `att_${Date.now()}`;
    await setDoc(doc(db, "attendance", id), data);
    console.log(`Attendance recorded with ID: ${id}`);
    return id;
  } catch (error) {
    console.error("Error marking attendance:", error);
    throw error;
  }
};

/**
 * جلب سجل حضور واحد
 */
export const getAttendance = async (id) => {
  try {
    const docRef = doc(db, "attendance", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Error getting attendance:", error);
    throw error;
  }
};

/**
 * جلب كل الحضور
 */
export const getAllAttendance = async () => {
  try {
    const colRef = collection(db, "attendance");
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all attendance:", error);
    throw error;
  }
};

/**
 * تعديل سجل حضور
 */
export const updateAttendance = async (id, data) => {
  try {
    const docRef = doc(db, "attendance", id);
    await updateDoc(docRef, data);
    console.log(` Attendance updated: ${id}`);
  } catch (error) {
    console.error("Error updating attendance:", error);
    throw error;
  }
};

/**
 * حذف سجل حضور
 */
export const deleteAttendance = async (id) => {
  try {
    const docRef = doc(db, "attendance", id);
    await deleteDoc(docRef);
    console.log(` Attendance deleted: ${id}`);
  } catch (error) {
    console.error("Error deleting attendance:", error);
    throw error;
  }
};

/**
 * جلب حضور كل الطلاب لقسم معين
 * @param {string} departmentId
 */
export const getDepartmentAttendance = async (departmentId) => {
  try {
    // 1. جلب كل الكورسات التابعة للقسم
    const coursesSnapshot = await getDocs(collection(db, "courses"));
    const courseRefs = coursesSnapshot.docs
      .filter((doc) => doc.data().department.id === departmentId)
      .map((doc) => doc.ref);

    if (courseRefs.length === 0) return [];

    // 2. جلب كل attendance اللي الكورس بتاعها في courseRefs
    const attendanceSnapshot = await getDocs(collection(db, "attendance"));
    const filtered = attendanceSnapshot.docs.filter((att) =>
      courseRefs.some((cr) => cr.id === att.data().course.id)
    );

    return filtered.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting department attendance:", error);
    throw error;
  }
};

/**
 * جلب حضور كل الطلاب لكورس معين
 */
export const getCourseAttendance = async (courseId) => {
  try {
    const q = query(
      collection(db, "attendance"),
      where("course.id", "==", courseId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting course attendance:", error);
    throw error;
  }
};

/**
 * جلب حضور طالب معين
 */
export const getStudentAttendance = async (studentId) => {
  try {
    const q = query(
      collection(db, "attendance"),
      where("student.id", "==", studentId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting student attendance:", error);
    throw error;
  }
};

/* ---------------- Notifications ---------------- */

/**
 * إنشاء Notification جديد
 * @param {string} id - documentId للتنبيه (اختياري)
 * @param {Object} data - { title, message, user: Reference, date, read }
 */
export const createNotification = async (id, data) => {
  try {
    if (!id) id = `notif_${Date.now()}`;
    await setDoc(doc(db, "notifications", id), data);
    console.log(`Notification created with ID: ${id}`);
    return id;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * جلب Notification واحد
 */
export const getNotification = async (id) => {
  try {
    const docRef = doc(db, "notifications", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Error getting notification:", error);
    throw error;
  }
};

/**
 * جلب كل Notifications
 */
export const getAllNotifications = async () => {
  try {
    const colRef = collection(db, "notifications");
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all notifications:", error);
    throw error;
  }
};

/**
 * تعديل Notification
 */
export const updateNotification = async (id, data) => {
  try {
    const docRef = doc(db, "notifications", id);
    await updateDoc(docRef, data);
    console.log(`Notification updated: ${id}`);
  } catch (error) {
    console.error("Error updating notification:", error);
    throw error;
  }
};

/**
 * حذف Notification
 */
export const deleteNotification = async (id) => {
  try {
    const docRef = doc(db, "notifications", id);
    await deleteDoc(docRef);
    console.log(`Notification deleted: ${id}`);
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

/**
 * جلب كل Notifications لمستخدم معين
 * @param {string} userId - documentId للمستخدم
 */
export const getNotificationsForUser = async (userId) => {
  try {
    const q = query(
      collection(db, "notifications"),
      where("user.id", "==", userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting notifications for user:", error);
    throw error;
  }
};
