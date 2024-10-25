// import { v2 as cloudinaryInit } from 'cloudinary'
import { Cloudinary } from '@cloudinary/url-gen'

export const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
    // apiKey: import.meta.env.PUBLIC_CLOUDINARY_API_KEY,
    // apiSecret: import.meta.env.CLOUDINARY_API_SECRET,
  },
  url: {
    secure: true, // force https, set to false to force http
  },
})

export const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

// export const cloudinary = cloudinaryInit.config({
//   cloud_name: import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: import.meta.env.PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: import.meta.env.CLOUDINARY_API_SECRET,
//   // secure_distribution: 'mydomain.com',
//   // upload_prefix: 'myprefix.com',
// })
