async function getFileData(fileId: number): Promise<boolean> {
    const fileResponse = await fetch(`http://localhost:5000/downloadFile/${fileId}`)

    if (fileResponse.headers.get('content-type') === 'application/octet-stream') {
        const blob = await fileResponse.blob()
        const fileName = getFileNameFromContentDisposition(fileResponse.headers)
        
        if (fileName === '') {
            return false
        }

        downloadFile(fileName, blob)

        return true
    }

    return true
}

function getFileNameFromContentDisposition(headers: Headers): string {
    return headers.get('Content-disposition')?.split('filename=')[1].replace('"', '') ?? ''
}

function downloadFile(fileName: string, blob: Blob) {
    const url = window.URL.createObjectURL(blob)

    if (navigator.appVersion.indexOf('Trident/') !== -1) {
        navigator.msSaveBlob(blob, fileName)
        return
    }

    const element = document.createElement('a')
    element.href = url
    element.download = fileName
    element.click()
}



export {
    getFileData
}