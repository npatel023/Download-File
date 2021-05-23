import express from 'express'
import path from 'path'
import { validateFileSize, validateFileType, validateInteger, validateUniqueFileName } from '../service/fileValidatorService'
import FileUploadService from '../service/FileUploadService'
import fileSessionService from '../service/FileSessionService'
import fileRetrievalService from '../service/FileRetrievalService'

let instance: null | FileController = null

class FileController
{
    static getInstance(): FileController {
        if (instance === null) {
            instance = new FileController()
            return instance
        }

        return instance
    }

    async createFileUploadSession(request: express.Request, response: express.Response) {
        try {
            let {
                fileName,
                fileSize
            } = request.body

            fileSize = parseInt(fileSize)

            const validFileType = await validateFileType(path.extname(fileName))
            const validFileSize = await validateFileSize(fileSize)

            if (!validFileType.isValid || !validFileSize.isValid) {
                return response.status(400).json({
                    success: false,
                    message: 'Invalid Request'
                })
            }

            const {
                fileSessionId,
                uniqueFileName
            } = await fileSessionService.createFileUploadSessionRecord(fileName, fileSize)

            if (fileSessionId === 0) {
                return response.status(500).json({
                    success: false,
                    message: 'Error uploading file'
                })
            }

            return response.status(201).json({
                success: true,
                fileSessionId,
                fileName: uniqueFileName
            })
        } catch(error) {
            console.log(error)
            response.status(500).json({
                success: false,
                message: 'Error uploading file'
            })
        }
    }

    async uploadFile(request: express.Request, response: express.Response) {
        try {
            const file = request.file
            let {
                fileSessionId,
                fileName,
                isLastBlock
            } = request.body

            isLastBlock = parseInt(isLastBlock)
            fileSessionId = parseInt(fileSessionId)

            const validFileSessionId = await validateInteger(fileSessionId)
            const validFileName = await validateUniqueFileName(fileName)

            if (!validFileSessionId.isValid ||
                !validFileName.isValid ||
                (isLastBlock !== 0 && isLastBlock !== 1)
            ) {
                return response.status(400).json({
                    success: false,
                    message: 'Invalid Request'
                })
            }

            const fileUploadService = new FileUploadService({
                file,
                fileName,
                fileSessionId,
                isLastBlock
            })
            const fileResponse = await fileUploadService.writeFileData()

            if (fileResponse.success === false) {
                return response.status(500).json({
                    success: false,
                    message: 'Error uploading file'
                })
            }

            response.status(201).json({
                success: true,
                fileId: fileResponse.fileId
            })
        } catch (error) {
            response.json({
                success: false,
                message: 'Error uploading file'
            })
        }
    }

    async getFiles(request: express.Request, response: express.Response) {
        try {
            const files = await fileRetrievalService.findFiles()

            response.json({
                success: true,
                files
            })
        } catch (error) {
            response.json({
                success: false,
                message: 'Error retrieving files'
            })
        }
    }

    async downloadFile(request: express.Request, response: express.Response) {
        const fileId = parseInt(request.params.id)

        const validId = await validateInteger(fileId)

        if (!validId.isValid) {
            return response.status(400).json({
                success: false,
                message: 'Invalid Request'
            })
        }

        try {
            const fileDetails = await fileRetrievalService.downloadFile(fileId)

            if (fileDetails === false) {
                return response.status(404).json({
                    success: false,
                    message: 'File not found'
                })
            }

            response.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-disposition': `attachment; "filename=${fileDetails.fileName}"`
            })
            response.write(fileDetails.fileData)
            response.end()
        } catch (error) {
            response.json({
                success: false,
                message: 'Error retrieving files'
            })
        } 
    }
}

export default FileController.getInstance()