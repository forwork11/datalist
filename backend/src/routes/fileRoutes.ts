import express from 'express';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

let data: any[] = [];

router.post('/upload', upload.single('file'), (req: any, res: any) => {
    const results: any[] = [];
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const path = req.file.path;
    fs.createReadStream(path)
        .pipe(csv())
        .on('data', (row) => results.push(row))
        .on('end', () => {
            data = results;
            console.log(data)
            fs.unlinkSync(path);
            res.status(200).json({ message: 'File uploaded successfully', data: results });
        })
        .on('error', (error) => res.status(500).json({ error: error.message }));
});

router.get('/', (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedData = data.slice(startIndex, endIndex);
    res.json({
        totalItems: data.length,
        totalPages: Math.ceil(data.length / limit),
        currentPage: page,
        data: paginatedData,
    });
});

router.get('/search', (req, res) => {
    const searchTerm = req.query.q as string;
    const filteredData = data.filter((item) => 
        Object.values(item).some(value => value?.toString().includes(searchTerm))
    );
    res.json(filteredData);
});

module.exports = router;