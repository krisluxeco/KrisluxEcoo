import React from "react";
import SocialDashBoardClient from "@/components/admin/SocialDashBoardClient";
import connectDb from "@/lib/db";
import Visit from "@/models/visit.model";

const SocialDashBoard = async () => {
  await connectDb();

  // Fetch Traffic/Referral Data
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
    <SocialDashBoardClient trafficData={trafficData} />
  );
};

export default SocialDashBoard;
