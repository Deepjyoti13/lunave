const multer     = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Only JPEG, PNG and WebP images are allowed'), false)
}

const mediaFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
  ]
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Only images (JPEG/PNG/WebP) and videos (MP4/WebM/MOV) are allowed'), false)
}

// Product images → lunave/products  (auto WebP + quality optimisation)
// Product videos → lunave/videos
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/')
    const cleanName = file.originalname
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .slice(0, 40)
    return {
      folder:         isVideo ? 'lunave/videos'   : 'lunave/products',
      resource_type:  isVideo ? 'video'           : 'image',
      public_id:      `${cleanName}-${Date.now()}`,
      transformation: isVideo
        ? [{ quality: 'auto' }]
        : [{ quality: 'auto', fetch_format: 'auto' }],
    }
  },
})

// Hero / banner videos → lunave/videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder:         'lunave/videos',
    resource_type:  'video',
    public_id:      `video-${Date.now()}`,
    transformation: [{ quality: 'auto' }],
  }),
})

const _productImages = multer({
  storage:    productStorage,
  fileFilter: mediaFilter,
  limits:     { fileSize: 50 * 1024 * 1024 },   // 50 MB per file
}).array('images', 6)

const _singleImage = multer({
  storage:    productStorage,
  fileFilter: imageFilter,
  limits:     { fileSize: 10 * 1024 * 1024 },
}).single('image')

const _singleVideo = multer({
  storage:    videoStorage,
  fileFilter: mediaFilter,
  limits:     { fileSize: 200 * 1024 * 1024 },  // 200 MB for videos
}).single('video')

const wrap = (fn) => (req, res, next) =>
  fn(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const msg = err.code === 'LIMIT_FILE_SIZE'  ? 'File too large'
                : err.code === 'LIMIT_FILE_COUNT' ? 'Too many files — max 6'
                : err.message
      return res.status(400).json({ success: false, message: msg })
    }
    if (err) return res.status(400).json({ success: false, message: err.message })
    next()
  })

module.exports = {
  cloudinary,
  uploadSingle:        wrap(_singleImage),
  uploadProductImages: wrap(_productImages),
  uploadVideo:         wrap(_singleVideo),
}
