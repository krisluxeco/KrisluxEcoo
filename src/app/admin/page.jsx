import React from "react";
import AdminDashBoardClient from "@/components/admin/AdminDashBoardClient";
import connectDb from "@/lib/db";
import Quote from "@/models/quote.model";
import User from "@/models/user.model";
import Product from "@/models/product.model"; // Ensure model is registered
import Visit from "@/models/visit.model";

const AdminDashBoard = async ({ searchParams }) => {
  await connectDb();
  
  // URL Filter logic
  const filter = searchParams?.filter || "sevenDays";
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfSevenDaysAgo = new Date(startOfToday);
  startOfSevenDaysAgo.setDate(startOfSevenDaysAgo.getDate() - 6);

  let globalStartDate = new Date(0); // For "total"
  if (filter === "today") globalStartDate = startOfToday;
  if (filter === "sevenDays") globalStartDate = startOfSevenDaysAgo;

  // 1. Total Customers (All-time, as it represents the total user base)
  const totalCustomers = await User.countDocuments({ role: "user" });

  // 2. Fetch all orders (Quotes) with products to calculate earnings
  const allOrders = await Quote.find().populate("items.productId");

  let totalEarning = 0;
  let todayEarning = 0;
  let sevenDaysEarning = 0;
  let pendingOrders = 0;
  let canceledOrders = 0;
  

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
      // Calculate earnings for the static cards (independent of global filter)
      if (orderDate >= startOfToday) {
        todayEarning += orderValue;
      }
      if (orderDate >= startOfSevenDaysAgo) {
        sevenDaysEarning += orderValue;
      }
    }

    // Stats based on all-time (so older pending orders don't disappear)
    if (order.status === "Pending") {
      pendingOrders += 1;
    }
    if (order.status === "Rejected") {
      canceledOrders += 1;
    }
  });

  // Calculate all-time active orders
  const activeOrdersCount = allOrders.filter(o => o.status !== "Rejected").length;

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

  const stats = [
    { title: "Total Orders", value: activeOrdersCount },
    { title: "Total Customers", value: totalCustomers },
    { title: "Pending Orders", value: pendingOrders },
    { title: "Canceled Orders", value: canceledOrders },
  ];

  // 3. Fetch Traffic/Referral Data (Filtered)
  const visits = await Visit.aggregate([
    { $match: { ...(globalStartDate.getTime() > 0 && { createdAt: { $gte: globalStartDate } }) } },
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

  const allVisits = await Visit.find({ createdAt: { $gte: startOfSevenDaysAgo } });
  const trafficChartData = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(startOfToday);
    d.setDate(d.getDate() - i);
    
    const visitsOnDate = allVisits.filter(v => {
       const vDate = new Date(v.createdAt);
       return vDate.getFullYear() === d.getFullYear() && 
              vDate.getMonth() === d.getMonth() && 
              vDate.getDate() === d.getDate();
    }).length;

    trafficChartData.push({ day: days[d.getDay()], visitors: visitsOnDate });
  }

  // 4. Advanced Traffic Stats (Unique, Growth)
  const allVisitsFull = await Visit.find();
  const uniqueIPs = new Set(allVisitsFull.map(v => v.ipAddress));
  
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  let thisMonthVisits = 0;
  let lastMonthVisits = 0;

  allVisitsFull.forEach(v => {
    const vDate = new Date(v.createdAt);
    if (vDate >= thisMonthStart) {
      thisMonthVisits++;
    } else if (vDate >= lastMonthStart && vDate <= lastMonthEnd) {
      lastMonthVisits++;
    }
  });

  const growth = lastMonthVisits === 0 
    ? (thisMonthVisits > 0 ? 100 : 0) 
    : Math.round(((thisMonthVisits - lastMonthVisits) / lastMonthVisits) * 100);

  const advancedTrafficStats = {
    total: allVisitsFull.length,
    unique: uniqueIPs.size,
    thisMonth: thisMonthVisits,
    lastMonth: lastMonthVisits,
    growth: growth,
  };

  return (
    <AdminDashBoardClient
      earning={earning}
      stats={stats}
      chartData={chartData}
      trafficData={trafficData}
      trafficChartData={trafficChartData}
      advancedTrafficStats={advancedTrafficStats}
    />
  );
};

export default AdminDashBoard;