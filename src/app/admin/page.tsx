"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // make sure you import db for Firestore
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"; // import Firestore functions
import { ToastContainer, toast } from "react-toastify"; // Import Toastify components
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [officerName, setOfficerName] = useState(""); // State for officer name selection
  const [officers, setOfficers] = useState([]); // State for storing officers list
  const [users, setUsers] = useState([]); // State for storing users list
  const [isEditing, setIsEditing] = useState(false); // State to check if editing
  const [editUserId, setEditUserId] = useState(""); // State to store the ID of the user being edited

  const signup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user info to Firestore
      await setDoc(doc(db, "offices", user.uid), {
        officeName,
        officerName,
        email,
      });

      // Fetch the updated users list after signing up
      fetchUsers();

      // Reset the form fields
      setEmail("");
      setPassword("");
      setPasswordAgain("");
      setOfficeName("");
      setOfficerName("");

      // Show success toast
      toast.success("Office registered successfully!");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        // Show error toast if the account already exists
        toast.error("Account already exists with this email!");
      } else {
        console.error("Error signing up: ", error);
        toast.error("Error signing up. Please try again.");
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "offices"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users: ", error);
      toast.error("Error fetching users. Please try again.");
    }
  };

  const fetchOfficers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "faculty"));
      const officersList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          fullName: `${data.firstName} ${data.lastName}`,
        };
      });
      setOfficers(officersList);
    } catch (error) {
      console.error("Error fetching officers: ", error);
      toast.error("Error fetching officers. Please try again.");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchOfficers();
  }, []);

  const handleOfficerChange = (event) => {
    const selectedOfficerName = event.target.value;
    setOfficerName(selectedOfficerName);

    // Find the selected officer from the officers list
    const selectedOfficer = officers.find(
      (officer) => officer.fullName === selectedOfficerName
    );

    // Set the email field to the selected officer's email
    if (selectedOfficer) {
      setEmail(selectedOfficer.email);
    }
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setEditUserId(user.id);
    setEmail(user.email);
    setOfficeName(user.officeName);
    setOfficerName(user.officerName);
    setPassword("");
    setPasswordAgain("");
  };

  const handleUpdate = async () => {
    try {
      const userDoc = doc(db, "offices", editUserId);

      await updateDoc(userDoc, {
        officeName,
        officerName,
        email,
      });

      // Fetch the updated users list after editing
      fetchUsers();

      // Reset the form fields
      setIsEditing(false);
      setEditUserId("");
      setEmail("");
      setOfficeName("");
      setOfficerName("");

      // Show success toast
      toast.success("Office updated successfully!");
    } catch (error) {
      console.error("Error updating user: ", error);
      toast.error("Error updating user. Please try again.");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, "offices", userId));

      // Fetch the updated users list after deleting
      fetchUsers();

      // Show success toast
      toast.success("Office deleted successfully!");
    } catch (error) {
      console.error("Error deleting user: ", error);
      toast.error("Error deleting user. Please try again.");
    }
  };

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  return (
    <>
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
      <div className="p-8">
        <div className="text-black">{session?.data?.user?.email}</div>
        <button className="text-black" onClick={() => signOut()}>
          Logout
        </button>
        <a href="studentregister" className="p-10">
          Register Student
        </a>
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h3 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            Admin
          </h3>
          <img
            className="mx-auto h-100 w-100"
            src="https://htcgsc.edu.ph/wp-content/uploads/2022/02/htc-new-seal.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black">
            {isEditing ? "Edit Office" : "Register Office"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="officeName"
                className="block text-sm font-medium leading-6 text-black"
              >
                Office Name
              </label>
              <div className="mt-2">
                <input
                  id="officeName"
                  name="officeName"
                  type="text"
                  value={officeName} // Bind value to state
                  onChange={(e) => setOfficeName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 bg-black/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="officerName"
                className="block text-sm font-medium leading-6 text-black"
              >
                Officer Name
              </label>
              <div className="mt-2">
                <select
                  id="officerName"
                  name="officerName"
                  value={officerName} // Bind value to state
                  onChange={handleOfficerChange} // Use the new change handler
                  required
                  className="block w-full rounded-md border-0 bg-black/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                >
                  <option value="" disabled>
                    Select officer
                  </option>
                  {officers.length === 0 && (
                    <option>No officers available</option>
                  )}
                  {officers.map((officer, index) => (
                    <option key={index} value={officer.fullName}>
                      {officer.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-black"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email} // Bind value to state
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 bg-black/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password} // Bind value to state
                  onChange={(e) => setPassword(e.target.value)}
                  required={!isEditing} // Make required only if not editing
                  className="block w-full rounded-md border-0 bg-black/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="passwordAgain"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Password Again
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="passwordAgain"
                  name="passwordAgain"
                  type="password"
                  autoComplete="current-password"
                  value={passwordAgain} // Bind value to state
                  onChange={(e) => setPasswordAgain(e.target.value)}
                  required={!isEditing} // Make required only if not editing
                  className="block w-full rounded-md border-0 bg-black/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              {isEditing ? (
                <button
                  disabled={!email || !officeName || !officerName}
                  onClick={() => handleUpdate()}
                  className="disabled:opacity-40 flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Update
                </button>
              ) : (
                <button
                  disabled={
                    !email ||
                    !password ||
                    !passwordAgain ||
                    !officeName ||
                    !officerName ||
                    password !== passwordAgain
                  }
                  onClick={() => signup()}
                  className="disabled:opacity-40 flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Register
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Office Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Officer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.officeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.officerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
