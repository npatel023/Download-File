import express from 'express'
import cors from 'cors'
import multer from 'multer'

import fileController from './controllers/FileController'

const app = express()
const upload = multer()

app.use(cors({
    exposedHeaders: ['Content-Disposition']
}))

app.post('/uploadFile', upload.single('file'), fileController.uploadFile)
app.post('/createFileUploadSession', upload.none(), fileController.createFileUploadSession)
app.get('/getFiles', upload.none(), fileController.getFiles)
app.get('/downloadFile/:id', upload.none(), fileController.downloadFile)
app.listen(5000, () => console.log('server is running'))