'use client';
import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { db } from '../firebase'; // make sure you import db for Firestore
import { doc, collection, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'; // import Firestore functions
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export default function Home() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  const [users, setUsers] = useState([]); // State for storing users list
  const [isEditing, setIsEditing] = useState(false); // State to check if editing
  const [editUserId, setEditUserId] = useState(''); // State to store the ID of the user being edited
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [office, setOffice] = useState('');

  useEffect(() => {
    // Fetch users when the component mounts
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users: ', error);
      toast.error('Error fetching users. Please try again.');
    }
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setEditUserId(user.id);
    setEmail(user.email);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setOffice(user.office);
  };

  const handleUpdate = async () => {
    try {
      const userDoc = doc(db, 'users', editUserId);

      await updateDoc(userDoc, {
        firstName,
        lastName,
        email,
        office
      });

      // Fetch the updated users list after editing
      fetchUsers();

      // Reset the form fields
      setIsEditing(false);
      setEditUserId('');
      setEmail('');
      setFirstName('');
      setLastName('');
      setOffice('');

      // Show success toast
      toast.success('Account updated successfully!');
    } catch (error) {
      console.error('Error updating user: ', error);
      toast.error('Error updating user. Please try again.');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));

      // Fetch the updated users list after deleting
      fetchUsers();

      // Show success toast
      toast.success('Account deleted successfully!');
    } catch (error) {
      console.error('Error deleting user: ', error);
      toast.error('Error deleting user. Please try again.');
    }
  };

  return (
    <div className="flex">
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
      <aside className="flex flex-col items-center w-16 h-screen py-8 overflow-y-auto bg-white border-r rtl:border-l rtl:border-r-0 dark:bg-green-900 dark:border-gray-700">
        <nav className="flex flex-col flex-1 space-y-6">
          <a href="signatory">
            <img className="w-auto h-9" src="https://htcgsc.edu.ph/wp-content/uploads/2022/02/htc-new-seal.png" alt="" />
          </a>
          <a href="signatorysign" className="p-1.5 text-gray-700 focus:outline-none transition-colors duration-200 rounded-lg dark:text-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </a>
          <a onClick={() => signOut()} className="p-1.5 text-gray-700 focus:outline-none transition-colors duration-200 rounded-lg dark:text-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100">
            <img className="w-auto h-6" src="logout-svgrepo-com.svg"></img>
          </a>
        </nav>
      </aside>
      <div className="flex-1 p-10">
        <h1 className="text-4xl text-green-900 font-bold">GoodHoly! {session?.data?.user?.email}</h1>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.firstName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.office}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Sign
                      </button>
                      {/* <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
