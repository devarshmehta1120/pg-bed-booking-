import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, deleteUser } from "../../api/userApi";

const Users = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleDelete = (id) => {
    if (!confirm("Delete this user?")) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <p className="p-4 text-gray-600">Loading users...</p>;
  }

  if (error) {
    return (
      <p className="p-4 text-red-500">
        {error.message || "Failed to load users"}
      </p>
    );
  }

  return (
    <div className="p-4 sm:p-6">

      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Users</h1>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found</p>
      ) : (
        <>
          {/* ================= MOBILE CARDS ================= */}
          <div className="grid gap-4 sm:hidden">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white p-4 rounded-xl shadow"
              >
                <p className="font-semibold">{user.name || "N/A"}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">{user.phone || "-"}</p>

                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>

                  <span className="text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(user._id)}
                  className="mt-3 w-full bg-red-500 text-white py-2 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border rounded-xl overflow-hidden shadow-sm">

              <thead className="bg-gray-100 text-sm text-gray-700">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Joined</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">
                      {user.name || "N/A"}
                    </td>

                    <td className="p-3 text-gray-600">
                      {user.email}
                    </td>

                    <td className="p-3 text-gray-600">
                      {user.phone || "-"}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="p-3 text-gray-500 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;