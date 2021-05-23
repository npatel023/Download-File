import { useState } from 'react'
import { ChakraProvider, Box } from '@chakra-ui/react'

import FileUpload from './FileUpload'
import FileList from './FileList'

function Main() {
    const [fileId, setFileId] = useState<number>(0)

    return (
        <ChakraProvider>
            <Box
                width="60%"
                m="100px auto"
            >
                <Box mb="10">
                    <FileUpload setFileId={setFileId} />
                </Box>
                <FileList fileId={fileId} />
            </Box>
        </ChakraProvider>
    )
}

export default Main