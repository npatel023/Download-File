import { readFile, constants } from 'fs'
import { access } from 'fs/promises'
import fileRetrievalRepo from '../repository/FileRetrievalRepo'
let instance: null|FileRetrievalService = null

class FileRetrievalService {
    static getInstance(): FileRetrievalService {
        if (instance == null) {
            instance = new FileRetrievalService()
        }
        return instance
    }

    async findFiles() {
        return await fileRetrievalRepo.findFiles()
    }

    async downloadFile(fileId: number): Promise<false | { fileData: Buffer, fileName: string }> {
        const fileResponse = await fileRetrievalRepo.findFileById(fileId)

        if (fileResponse === false) {
            return false
        }

        if (!(await this.checkIfFileExists(fileResponse.uniqueFileName))) {
            return false
        }

        const fileDataResponse = await this.readFileData(fileResponse.uniqueFileName)

        if (fileDataResponse === false) {
            return false
        }

        return {
            fileData: fileDataResponse,
            fileName: fileResponse.fileName
        }
    }

    private async checkIfFileExists(uniqueFileName: string): Promise<boolean> {
        try {
            await access(this.getFilePath(uniqueFileName), constants.R_OK)
            return true
        } catch (error) {
            return false
        }
    }

    private getFilePath(uniqueFileName: string): string {
        return `${__dirname}/../img/${uniqueFileName}`
    }

    private async readFileData(uniqueFileName: string): Promise<false | Buffer> {
        return await new Promise((resolve, reject) => {
            readFile(this.getFilePath(uniqueFileName), (error, data) => {
                if (error) {
                    console.log(error)
                    reject(false)
                }
                resolve(data)
            })
        })
    }
}

export default FileRetrievalService.getInstance()