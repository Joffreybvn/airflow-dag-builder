import {
    Grid,
    GridItem,
    Input,
    Badge
} from "@chakra-ui/react";
import React from "react";

const SettingInputText = ({name}) => {
    return (
        <Grid
            templateColumns="auto auto 1fr"
            gap={2}
            padding={1}
        >
            <GridItem
                display="flex"
                h="fit-content"
                m="auto"
            >
                <Badge
                    variant='outline'
                    colorScheme='green'
                >
                    Text
                </Badge>
            </GridItem>
            <GridItem
                display="flex"
                h="fit-content"
                m="auto"
                className="setting_name"
            >
                {name}
            </GridItem>
            <GridItem>
                <Input
                    size='sm'
                />
            </GridItem>
        </Grid>
    )
}

export default SettingInputText;
