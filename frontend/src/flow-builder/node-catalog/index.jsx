import {Box, Flex, Image} from "@chakra-ui/react";
import toggle_left from "../static/icons/toggle-left.svg";
import toggle_right from "../static/icons/toggle-right.svg";
import React, {useCallback, useState} from "react";
import NodeList from "./NodeList";


const NodeCatalog = () => {
    const [isCollapsed, setCollapseState] = useState(false);

    const onClickToggle = useCallback(
        () => setCollapseState(!isCollapsed),
        [isCollapsed, setCollapseState]
    );

    return (
        <Flex
            position="absolute"
            zIndex={5}
            h="100%"
            minW='5rem'
            padding={7}
            background="rgb(248 250 252)"
        >
            {isCollapsed ? <NodeList/> : null}
            <Flex
                flexDirection='column'
                position='absolute'
                right={7}
                cursor='pointer'
                marginY='3px'
                onClick={onClickToggle}
            >
                <Image
                    src={isCollapsed ? toggle_left : toggle_right}
                    alt="Toggle"
                    boxSize='32px'
                />
                <Box
                    display={isCollapsed ? 'none' : 'block'}
                    marginTop='1rem'
                    className={"vertical-text"}
                >
                    <strong>Operators catalog</strong>
                </Box>
            </Flex>
        </Flex>
    );
};

export default NodeCatalog;
