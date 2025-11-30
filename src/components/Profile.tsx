import { useState } from 'react';
import type { UserProfile } from '../types';
import { storage } from '../utils/storage';
import { User, Mail, Clock, Calendar, Save } from 'lucide-react';

export function Profile() {
  const [profile, setProfile] = useState<UserProfile>(storage.getProfile());
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updatedProfile: UserProfile = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      workHoursStart: formData.get('workHoursStart') as string,
      workHoursEnd: formData.get('workHoursEnd') as string,
      calendarSyncEnabled: formData.get('calendarSync') === 'on',
      lastSyncDate: profile.lastSyncDate,
    };

    storage.saveProfile(updatedProfile);
    setProfile(updatedProfile);
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000);
  };

  const stats = {
    totalTasks: storage.getTasks().length,
    completedTasks: storage.getTasks().filter(t => t.completed).length,
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-gray-900 mb-2">Profile</h2>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Profile Overview */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">{profile.name}</h3>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 mb-1">{stats.totalTasks}</p>
              <p className="text-gray-600">Total Tasks</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 mb-1">{stats.completedTasks}</p>
              <p className="text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-gray-900 mb-6">Settings</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-gray-900 mb-4">Personal Information</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      <span>Name</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={profile.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </div>
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={profile.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Work Hours */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-gray-900 mb-4">Work Hours</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4" />
                      <span>Start Time</span>
                    </div>
                  </label>
                  <input
                    type="time"
                    name="workHoursStart"
                    defaultValue={profile.workHoursStart}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4" />
                      <span>End Time</span>
                    </div>
                  </label>
                  <input
                    type="time"
                    name="workHoursEnd"
                    defaultValue={profile.workHoursEnd}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Calendar Sync */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-gray-900 mb-4">Calendar Integration</h4>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-gray-900">iPhone Calendar Sync</p>
                    <p className="text-gray-600">
                      {profile.lastSyncDate 
                        ? `Last synced: ${new Date(profile.lastSyncDate).toLocaleString()}`
                        : 'Never synced'}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="calendarSync"
                    defaultChecked={profile.calendarSyncEnabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
