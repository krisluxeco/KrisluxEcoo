import React from "react";
import AdminDashBoardClient from "@/components/admin/AdminDashBoardClient";

const AdminDashBoard = () => {
  // Mock data — swap with real DB queries once backend is connected
  const earning = {
    today: 4250,
    sevenDays: 28600,
    total: 184300,
  };

  const stats = [
    { title: "Total Orders", value: 312 },
    { title: "Total Customers", value: 148 },
    { title: "Pending Deliveries", value: 9 },
  ];

  const chartData = [
    { day: "Mon", orders: 12 },
    { day: "Tue", orders: 18 },
    { day: "Wed", orders: 9 },
    { day: "Thu", orders: 22 },
    { day: "Fri", orders: 15 },
    { day: "Sat", orders: 27 },
    { day: "Sun", orders: 19 },
  ];

  return (
    <AdminDashBoardClient
      earning={earning}
      stats={stats}
      chartData={chartData}
    />
  );
};

export default AdminDashBoard;