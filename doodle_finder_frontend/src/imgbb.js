//
// imgbb helper for frontend image uploads
//

// PUBLIC_INTERFACE
/**
 * Uploads an image (file/blob/base64 string) to imgbb and gets the image URL.
 * @param {File|Blob|string} image - The image file, blob, or base64 string.
 * @returns {Promise<string>} - Resolves with the imgbb image URL on success.
 */
export async function uploadToImgbb(image) {
  // imgbb requires image data as base64 or file object in form-data POST
  const API_KEY = "6da4466201de0f91b97df4fe129c6d7a";
  const endpoint = `https://api.imgbb.com/1/upload?key=${API_KEY}`;

  // Convert File/Blob to base64 if needed
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (typeof file === "string") {
        // Already base64
        resolve(file);
      } else {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]); // Remove the data URL prefix
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      }
    });

  let payload;
  if (image instanceof File || image instanceof Blob) {
    // Convert to base64 string (imgbb expects 'image' field as base64)
    const base64Image = await getBase64(image);
    payload = new URLSearchParams();
    payload.append("image", base64Image);
  } else if (typeof image === "string") {
    // Assume it's already a base64 string
    payload = new URLSearchParams();
    payload.append("image", image);
  } else {
    throw new Error("Invalid image input");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    body: payload,
  });

  if (!response.ok) {
    throw new Error("Image upload failed");
  }
  const result = await response.json();
  if (result && result.data && result.data.url) {
    return result.data.url;
  } else {
    throw new Error("Failed to retrieve image URL");
  }
}
