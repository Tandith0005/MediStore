import { userService } from "@/services/user.service";
import ProfileActions from "./ProfileActions";

const Profile = async () => {
  const { data: session, error } = await userService.getSession();

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">You are not logged in</p>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-8">
          My Profile
        </h1>

        {/* Profile Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Info label="Full Name" value={user.name || "Not provided"} />
          <Info label="Email" value={user.email} />
          <Info label="Role" value={user.role || "User"} />
          <Info label="Status" value="Active" />
        </div>

        {/* Edit + Delete */}
        <ProfileActions user={user} />
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold text-lg">{value}</p>
  </div>
);

export default Profile;
