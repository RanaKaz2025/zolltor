import React, { useState } from "react";
import { Save, Mail, Globe, Bell, Key, Eye, EyeOff } from "lucide-react";
import dummyData from "../data/dummyData.json";

const UserProfile = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    email: user?.email || "",
    country: user?.country || "US",
    language: user?.language || "english",
    role: user?.role || "ceo",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailAddress: user?.email || "",
    frequency: "daily",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [saveMessage, setSaveMessage] = useState("");

  const handleProfileSave = () => {
    // Update user data
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setSaveMessage("Profile updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleNotificationSave = () => {
    setSaveMessage("Notification settings updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handlePasswordSave = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveMessage("New passwords do not match!");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setSaveMessage("Password must be at least 6 characters long!");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    // Reset password form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setSaveMessage("Password updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const tabs = [
    { id: "profile", label: "Profile Information", icon: Globe },
    { id: "notifications", label: "Notification Settings", icon: Bell },
    { id: "password", label: "Change Password", icon: Key },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-3px p-4">
          <p className="text-green-800">{saveMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-3px shadow-sm border border-gray-200">
        {/* Vertical Tabs Layout */}
        <div className="flex">
          {/* Vertical Tab Navigation */}
          <div className="w-50 border-r border-gray-200">
            <nav className="flex flex-col">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium border-r-2 transition-colors text-left ${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600 bg-primary-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            {/* Profile Information Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Profile Information
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address (Read only)
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="email"
                          value={profileData.email}
                          readOnly
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-3px bg-gray-50 text-gray-500 cursor-not-allowed"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language Preference
                      </label>
                      <div className="flex space-x-6">
                        <div className="flex items-center">
                          <input
                            id="language-english"
                            name="language"
                            type="radio"
                            value="english"
                            checked={profileData.language === "english"}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                language: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <label
                            htmlFor="language-english"
                            className="ml-2 text-sm text-gray-700"
                          >
                            English
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="language-german"
                            name="language"
                            type="radio"
                            value="german"
                            checked={profileData.language === "german"}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                language: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <label
                            htmlFor="language-german"
                            className="ml-2 text-sm text-gray-700"
                          >
                            German
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center">
                          <input
                            id="role-ceo"
                            name="role"
                            type="radio"
                            value="ceo"
                            checked={profileData.role === "ceo"}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                role: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <label
                            htmlFor="role-ceo"
                            className="ml-2 text-sm text-gray-700"
                          >
                            CEO
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="role-cfo"
                            name="role"
                            type="radio"
                            value="cfo"
                            checked={profileData.role === "cfo"}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                role: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <label
                            htmlFor="role-cfo"
                            className="ml-2 text-sm text-gray-700"
                          >
                            CFO
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="role-supply-chain"
                            name="role"
                            type="radio"
                            value="supply-chain"
                            checked={profileData.role === "supply-chain"}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                role: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <label
                            htmlFor="role-supply-chain"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Supply Chain Manager
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="role-other"
                            name="role"
                            type="radio"
                            value="other"
                            checked={profileData.role === "other"}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                role: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <label
                            htmlFor="role-other"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Other
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country of Operation
                      </label>
                      <div className="relative">
                        <Globe
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <select
                          value={profileData.country}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              country: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {dummyData.countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        This determines your import/export perspective
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleProfileSave}
                      className="bg-primary-600 text-white px-6 py-2 rounded-3px hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Email Notifications
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address for Notifications
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="email"
                          value={notificationSettings.emailAddress}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emailAddress: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="notifications@example.com"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Leave blank to use your account email address
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notification Frequency
                      </label>
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center">
                          <input
                            id="frequency-daily"
                            name="frequency"
                            type="radio"
                            value="daily"
                            checked={notificationSettings.frequency === "daily"}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                frequency: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <label
                            htmlFor="frequency-daily"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Daily Digest
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="frequency-weekly"
                            name="frequency"
                            type="radio"
                            value="weekly"
                            checked={
                              notificationSettings.frequency === "weekly"
                            }
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                frequency: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <label
                            htmlFor="frequency-weekly"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Weekly Digest
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="frequency-monthly"
                            name="frequency"
                            type="radio"
                            value="monthly"
                            checked={
                              notificationSettings.frequency === "monthly"
                            }
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                frequency: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <label
                            htmlFor="frequency-monthly"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Monthly Digest
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="frequency-major"
                            name="frequency"
                            type="radio"
                            value="major"
                            checked={notificationSettings.frequency === "major"}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                frequency: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <label
                            htmlFor="frequency-major"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Major Changes Only
                          </label>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-500">
                        Choose your preferred frequency to balance information
                        needs with inbox management
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-3px border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      What you'll receive notifications about:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Rate changes affecting your tracked products</li>
                      <li>• New trade agreement implementations</li>
                      <li>• Market analysis updates</li>
                      <li>• Important policy changes</li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleNotificationSave}
                      className="bg-primary-600 text-white px-6 py-2 rounded-3px hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === "password" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Change Password
                  </h3>

                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Key
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              current: !showPasswords.current,
                            })
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Key
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              new: !showPasswords.new,
                            })
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Key
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              confirm: !showPasswords.confirm,
                            })
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handlePasswordSave}
                      className="bg-primary-600 text-white px-6 py-2 rounded-3px hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                      <span>Update Password</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
