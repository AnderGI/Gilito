import { NextFunction, Request, Response, Router } from 'express';
import { param, validationResult } from 'express-validator';
import fs from 'fs';
import httpStatus from 'http-status';
import multer from 'multer';
import path from 'path';

const requestSchema = [param('id').isUUID('4').notEmpty()];
const storage = multer.diskStorage({
	destination(req, file, cb) {
		const uploadDir =
			process.env.NODE_ENV === 'test'
				? path.join(process.cwd(), 'tests/uploads')
				: path.join(process.cwd(), 'uploads');

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		cb(null, uploadDir);
	},
	filename(req, file, cb) {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${file.fieldname}-${uniqueSuffix}`);
	}
});

const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		const allowedMime = 'text/plain';
		const allowedExt = '.txt';

		const fileExt = path.extname(file.originalname).toLowerCase();

		if (file.mimetype !== allowedMime || fileExt !== allowedExt) {
			const error = new Error('Only .txt files are allowed') as Error & { status?: number };
			error.status = httpStatus.BAD_REQUEST;

			cb(error);

			return;
		}

		cb(null, true);
	}
});
export const register = (router: Router): void => {
	router.put(
		'/file/:id',
		requestSchema,
		(req: Request, res: Response, next: NextFunction) => {
			const errors = validationResult(req);
			if (errors.isEmpty()) {
				next();

				return;
			}

			return res.sendStatus(httpStatus.BAD_REQUEST);
		},
		upload.single('data'),
		(req: Request, res: Response) => {
			res.sendStatus(httpStatus.ACCEPTED);
		}
	);

	router.use(
		(err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
			if (err instanceof multer.MulterError || err.status === httpStatus.BAD_REQUEST) {
				return res.status(httpStatus.BAD_REQUEST).json({ error: err.message });
			}

			// Loguea el error para debug
			console.error('Unhandled error:', err);

			return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
		}
	);
};
