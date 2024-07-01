'use client';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Home() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  return (
    <div className="flex">
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
        <h1 className="text-4xl text-green-900 font-bold">GoodHoly! {session?.data?.user?.email }</h1>
        <p>Signatory</p>
        {/* <div className="border-2 border-green-900 rounded-lg p-4">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John</td>
                <td>Doe</td>
                <td>Approved</td>
              </tr>
              <tr>
                <td>Jane</td>
                <td>Doe</td>
                <td>Pending</td>
              </tr>
            </tbody>
          </table>
        </div> */}
      </div>
    </div>
  );
}
