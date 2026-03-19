import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { getDashboardStats } from "../../api/dashboardApi";

export const Dashboard = () => {

  const { data = {}, isLoading, error } = useQuery({
    queryKey: ["dashboards"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return <p className="p-10">Loading Dashboard...</p>;
  }

  if (error) {
    return (
      <p className="p-10 text-red-500">
        {error.message || "Failed to load dashboard"}
      </p>
    );
  }

  const stats = [
    { title: "Total Rooms", value: data.totalRooms || 0 },
    { title: "Total Beds", value: data.totalBeds || 0 },
    { title: "Bookings", value: data.totalBookings || 0 },
    { title: "Revenue", value: `₹${data.revenue || 0}` },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition">

            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">{item.value}</p>
            </CardContent>

          </Card>
        ))}

      </div>
    </>
  );
};