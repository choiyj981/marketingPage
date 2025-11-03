import multer from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    const uploadPath = isImage ? 'public/uploads/images' : 'public/uploads/files';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedFileTypes = /pdf|doc|docx|xls|xlsx|zip|rar|txt|csv|py|js|ts/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  
  if (file.mimetype.startsWith('image/')) {
    if (allowedImageTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다 (jpeg, jpg, png, gif, webp)'));
    }
  } else {
    if (allowedFileTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('허용되지 않는 파일 형식입니다'));
    }
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
});

export const uploadImage = upload.single('image');
export const uploadFile = upload.single('file');
