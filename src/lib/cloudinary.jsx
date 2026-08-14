import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadOnCloudinary = async (file) => {
  if (!file) {
    return null;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Convert to base64 Data URI
    const mimeType = file.type || "application/pdf";
    const b64 = buffer.toString("base64");
    const dataURI = `data:${mimeType};base64,${b64}`;

    const isPdf = mimeType === "application/pdf" || (file.name && file.name.toLowerCase().endsWith('.pdf'));
    
    const options = {
      resource_type: isPdf ? "raw" : "auto",
      folder: "krisluxeco",
    };

    let ext = isPdf ? "pdf" : "jpg";
    let base = "catalog_upload";

    if (file.name && file.name !== "blob") {
      const parts = file.name.split('.');
      if (parts.length > 1) ext = parts.pop().toLowerCase();
      base = parts.join('_').replace(/[^a-zA-Z0-9]/g, '_');
      if (base.length === 0) base = "catalog";
    }

    // This GUARANTEES the public_id ends in .pdf if it's a PDF
    options.public_id = `${base}_${Date.now()}.${ext}`;

    const result = await cloudinary.uploader.upload(dataURI, options);
    return result?.secure_url ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default uploadOnCloudinary;
