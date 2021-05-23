import { useState, useEffect } from 'react'
import {
    Flex,
    Text,
    UnorderedList,
    ListItem,
    Link,
    createStandaloneToast
} from '@chakra-ui/react'

import { getFileData } from '../service/fileDownloadService'

interface Props {
    fileId: number
}

function FileList(props: Props) {
    const {
        fileId
    } = props

    const [fileList, setFileList] = useState<Array<{ fileId: number, fileName: string }>>([])

    useEffect(() => {
        fetch('http://localhost:5000/getFiles', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => setFileList(data.files))
    }, [fileId])

    const handleFileDownload = async (fileId: number) => {
        const fileDownloadResponse = await getFileData(fileId)

        const toast = createStandaloneToast()
        
        toast({
            title: fileDownloadResponse ? 'Download Successful' : 'Download Failed',
            status: fileDownloadResponse ? 'success' : 'error',
            duration: 3000,
            isClosable: true
        })
    }

    if (fileList.length === 0) {
        return null
    }

    return (
        <Flex
            direction="column"
            justify="center"
            alignItems="center"
        >
            <Text
                fontSize="2xl"
                mb="4"
            >Uploaded Files</Text>
            <UnorderedList>
                {
                    fileList.map(({ fileId, fileName }) => (
                        <ListItem key={fileId}>
                            <Link color="blue.400" onClick={() => handleFileDownload(fileId)}>{fileName}</Link>
                        </ListItem>
                    ))
                }
            </UnorderedList>
        </Flex>
    )
}

export default FileList