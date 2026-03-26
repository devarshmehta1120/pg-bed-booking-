import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  getProfile,
  updateProfile,
  uploadAvatar,
  requestPasswordChange,
  verifyPasswordChange,
} from "../api/userApi";

import { getMyBookings } from "../api/bookingApi";
import { Eye, EyeOff, User, Edit, LogOut, Lock, Camera } from "lucide-react";

function Profile() {
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [passwords, setPasswords] = useState({ newPassword: "" });

  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const getImageUrl = (img) => {
  if (!img) return "";

  // ✅ Cloudinary / external URL
  if (img.startsWith("http")) {
    return img;
  }

  // ✅ Local backend image
  return `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}${img}`;
};

  /* ---------------- PROFILE ---------------- */
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  /* ---------------- BOOKINGS ---------------- */
  const { data: bookings = [] } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  });

  const total = bookings.length;
  const cancelled = bookings.filter(
    (b) => b.bookingStatus === "cancelled"
  ).length;
  const refunded = bookings.filter(
    (b) => b.paymentStatus === "refunded"
  ).length;

  /* ---------------- PASSWORD VALIDATION ---------------- */
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!password) return "Password is required";
    if (!regex.test(password)) {
      return "Password must include uppercase, lowercase, number & special character";
    }
    return null;
  };

  /* ---------------- UPDATE PROFILE ---------------- */
  const handleUpdateProfile = async () => {
    try {
      await updateProfile(form);
      toast.success("Profile updated");
      setEditMode(false);
      queryClient.invalidateQueries(["profile"]);
    } catch {
      toast.error("Update failed");
    }
  };

  /* ---------------- PASSWORD FLOW ---------------- */
  const handleSendOtp = async () => {
    const error = validatePassword(passwords.newPassword);
    if (error) return toast.error(error);

    try {
      await requestPasswordChange();
      toast.success("OTP sent");
      setOtpMode(true);
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    const error = validatePassword(passwords.newPassword);
    if (error) return toast.error(error);

    if (!otp || otp.length !== 6) {
      return toast.error("Enter valid OTP");
    }

    try {
      await verifyPasswordChange({
        otp,
        newPassword: passwords.newPassword,
      });

      toast.success("Password updated");
      setOtpMode(false);
      setOtp("");
      setPasswords({ newPassword: "" });
    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    }
  };

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Uploading...");

    try {
      await uploadAvatar(file);

      toast.update(toastId, {
        render: "Profile updated",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      queryClient.invalidateQueries(["profile"]);
    } catch {
      toast.update(toastId, {
        render: "Upload failed",
        type: "error",
        isLoading: false,
      });
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="bg-white p-6 rounded-2xl shadow border text-center">

          <div className="relative w-24 h-24 mx-auto mb-4">

            {/* ✅ FIXED IMAGE (Cloudinary) */}
            {user?.avatar ? (
              <img
  src={getImageUrl(user.avatar)}
  className="w-full h-full rounded-full object-cover"
/>
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <User size={40} />
              </div>
            )}

            <label className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer">
              <Camera size={14} />
              <input type="file" hidden onChange={handleImageUpload} />
            </label>
          </div>

          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>

          <button
            onClick={logout}
            className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg flex justify-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-2 space-y-6">

          {/* INFO */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Personal Info</h2>

              <button
                onClick={() => setEditMode(!editMode)}
                className="text-blue-600 flex gap-1"
              >
                <Edit size={16} /> {editMode ? "Cancel" : "Edit"}
              </button>
            </div>

            <input
              disabled={!editMode}
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border px-4 py-2 rounded mb-3"
            />

            <input
              disabled
              value={form.email || ""}
              className="w-full border px-4 py-2 rounded mb-3 bg-gray-100"
            />

            <input
              disabled={!editMode}
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border px-4 py-2 rounded"
            />

            {editMode && (
              <button
                onClick={handleUpdateProfile}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            )}
          </div>

          {/* PASSWORD */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="font-semibold mb-3 flex gap-2">
              <Lock size={18} /> Change Password
            </h2>

            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ newPassword: e.target.value })
                }
                className="w-full border px-4 py-2 rounded pr-10"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {!otpMode ? (
              <button
                onClick={handleSendOtp}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Send OTP
              </button>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border px-4 py-2 rounded mt-3 mb-2"
                />

                <button
                  onClick={handleVerifyOtp}
                  className="bg-green-600 text-white px-4 py-2 rounded w-full"
                >
                  Verify & Update Password
                </button>
              </>
            )}
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-gray-500 text-sm">Bookings</p>
              <p className="text-xl font-bold">{total}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-gray-500 text-sm">Cancelled</p>
              <p className="text-xl font-bold">{cancelled}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-gray-500 text-sm">Refunded</p>
              <p className="text-xl font-bold">{refunded}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;