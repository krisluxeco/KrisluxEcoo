import React from "react";
import AdminDashBoardClient from "@/components/admin/AdminDashBoardClient";
import connectDb from "@/lib/db";
import Quote from "@/models/quote.model";
import User from "@/models/user.model";
import Product from "@/models/product.model"; // Ensure model is registered
import Visit from "@/models/visit.model";

const AdminDashBoard = async () => {
  await connectDb();

  // 1. Total Customers
  const totalCustomers = await User.countDocuments({ role: "user" });

  // 2. Fetch all orders (Quotes) with products to calculate earnings
  const allOrders = await Quote.find().populate("items.productId");

  let totalEarning = 0;
  let todayEarning = 0;
  let sevenDaysEarning = 0;
  let pendingOrders = 0;
  let canceledOrders = 0;
  
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfSevenDaysAgo = new Date(startOfToday);
  startOfSevenDaysAgo.setDate(startOfSevenDaysAgo.getDate() - 6);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  allOrders.forEach(order => {
    // Calculate order value
    let orderValue = 0;
    order.items.forEach(item => {
      const productPrice = item.productId?.discountPrice || item.productId?.price || 0;
      const displayPrice = item.targetBudget || productPrice;
      orderValue += displayPrice * item.quantity;
    });

    // Only count earnings for non-rejected, non-canceled orders
    if (order.status !== "Rejected" && order.status !== "Canceled") {
      totalEarning += orderValue;

      const orderDate = new Date(order.createdAt);
      if (orderDate >= startOfToday) {
        todayEarning += orderValue;
      }
      if (orderDate >= startOfSevenDaysAgo) {
        sevenDaysEarning += orderValue;
      }
    }

    if (order.status === "Pending") {
      pendingOrders += 1;
    }
    
    if (order.status === "Rejected") {
      canceledOrders += 1;
    }
  });

  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(startOfToday);
    d.setDate(d.getDate() - i);
    
    // Count non-rejected orders on this specific date
    const ordersOnDate = allOrders.filter(o => {
       if (o.status === "Rejected") return false;
       const oDate = new Date(o.createdAt);
       return oDate.getFullYear() === d.getFullYear() && 
              oDate.getMonth() === d.getMonth() && 
              oDate.getDate() === d.getDate();
    }).length;

    chartData.push({ day: days[d.getDay()], orders: ordersOnDate });
  }

  const earning = {
    today: todayEarning,
    sevenDays: sevenDaysEarning,
    total: totalEarning,
  };

  const activeOrdersCount = allOrders.filter(o => o.status !== "Rejected").length;

  const stats = [
    { title: "Total Orders", value: activeOrdersCount },
    { title: "Total Customers", value: totalCustomers },
    { title: "Pending Orders", value: pendingOrders },
    { title: "Canceled Orders", value: canceledOrders },
  ];

  // 3. Fetch Traffic/Referral Data
  const visits = await Visit.aggregate([
    { $group: { _id: "$source", count: { $sum: 1 } } }
  ]);

  const trafficData = {
    instagram: 0,
    linkedin: 0,
    direct: 0,
    other: 0,
    total: 0
  };

  visits.forEach(v => {
    if (v._id === "instagram") trafficData.instagram = v.count;
    else if (v._id === "linkedin") trafficData.linkedin = v.count;
    else if (v._id === "direct") trafficData.direct = v.count;
    else trafficData.other += v.count;
    
    trafficData.total += v.count;
  });

  return (
    <AdminDashBoardClient
      earning={earning}
      stats={stats}
      chartData={chartData}
      trafficData={trafficData}
    />
  );
};

export default AdminDashBoard;