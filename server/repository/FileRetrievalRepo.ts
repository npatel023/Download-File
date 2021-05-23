import connection from '../db'
let instance: null|FileRetrievalRepo = null

class FileRetrievalRepo {
    static getInstance(): FileRetrievalRepo {
        if (instance === null) {
            instance = new FileRetrievalRepo()
        }
        return instance
    }

    async findFiles(): Promise<Array<{ fileId: number, fileName: string }>> {
        try {
            return await new Promise((resolve, reject) => {
                const selects = [
                    'file_id AS fileId',
                    'file_name AS fileName'
                ]

                connection.query(
                    `SELECT ${selects.join(',')} FROM uploaded_file`,
                    [],
                    (error, results) => {
                        if (error) {
                            console.log(error)
                            reject([])
                        }
                        resolve(results)
                    }
                )
            })
        } catch (error) {
            return []
        }
    }

    async findFileById(fileId: number): Promise<false | { uniqueFileName: string, fileName: string }> {
        try {
            return await new Promise((resolve, reject) => {
                const selects = [
                    'unique_file_name AS uniqueFileName',
                    'file_name AS fileName'
                ]

                connection.query(
                    `SELECT ${selects.join(',')} FROM uploaded_file WHERE file_id = ? LIMIT 1`,
                    [fileId],
                    (error, results) => {
                        if (error) {
                            console.log(error)
                            reject(false)
                        }
                        resolve(results[0])
                    }
                )
            })
        } catch (error) {
            return false
        }
    }
}

export default FileRetrievalRepo.getInstance()