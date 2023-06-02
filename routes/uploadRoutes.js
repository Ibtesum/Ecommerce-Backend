
import { v2 as cloudinary } from 'cloudinary'
import express from 'express'
import asyncHandler from 'express-async-handler'
import fs from 'fs'
const router = express.Router()


router.post(
  '/',
  asyncHandler(async (req, res) => {
    
    const result = await cloudinary.uploader.upload(
      req.files.file.tempFilePath,
      {
        folder: 'proshop',
        use_filename: true,
      }
    )
    // fs.rm('tmp', { recursive: true }, (err) => {
    //   if (err) {
    //     throw (err)
    //   }
    // })
    return res.status(200).json({ image: result.secure_url })
  })
)

export default router