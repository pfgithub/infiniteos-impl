import React from 'react';

function UsersSettings() {
  return (
    <div className="flex-grow p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
      <div className="space-y-6">

        {/* Current User */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2">Current User</h3>
          <div className="bg-black/20 p-4 rounded-lg mt-3 flex items-center gap-4">
            <img src="/filesystem/Users/Admin/Pictures/Avatars/admin_avatar.png" alt="Admin Avatar" className="w-20 h-20 rounded-full bg-gray-500 object-cover" />
            <div>
              <p className="text-xl font-bold">Admin</p>
              <p className="text-gray-400">Administrator</p>
              <p className="text-gray-400">admin@cuos.local</p>
              <div className="mt-2 flex gap-3">
                 <button className="text-sm text-blue-400 hover:underline">Change picture</button>
                 <button className="text-sm text-blue-400 hover:underline">Sign out</button>
              </div>
            </div>
          </div>
        </div>

        {/* Other Users */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2">Other users</h3>
          <div className="bg-black/20 p-4 rounded-lg mt-3">
             <div className="space-y-3">
                <div className="flex items-center gap-4 p-2 rounded hover:bg-white/10 cursor-pointer">
                    <img src="/filesystem/Users/Admin/Pictures/Avatars/guest_avatar.png" alt="Guest Avatar" className="w-12 h-12 rounded-full bg-gray-500 object-cover" />
                    <div>
                        <p className="font-semibold">Guest</p>
                        <p className="text-sm text-gray-400">Standard User</p>
                    </div>
                </div>
             </div>
             <button id="settings_add_user" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors w-full sm:w-auto">
              Add account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersSettings;
