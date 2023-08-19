import {Alert, AlertDescription, AlertIcon, AlertTitle} from "@chakra-ui/react";
import React from "react";

const AlertErrorCover = ({title, description}) => {

    return (
        <Alert
            status='error'
            variant='subtle'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            background='unset'
        >
            <AlertIcon
                boxSize='40px'
                mr={0}
            />
            <AlertTitle
                mt={4}
                mb={1}
                fontSize='lg'
            >
                {title}
            </AlertTitle>
            <AlertDescription
                maxWidth='sm'
            >
                {description}
            </AlertDescription>
        </Alert>
    )
}

export default AlertErrorCover;
