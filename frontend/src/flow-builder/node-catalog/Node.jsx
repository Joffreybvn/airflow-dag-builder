import React from "react";
import {Flex, Grid, GridItem, Image} from "@chakra-ui/react";
import python from "../static/icons/python.svg";


const Node = ({data}) => {

    const sendNodeData = (event, nodeType) => {
        data['nodeType'] = nodeType
        event.dataTransfer.setData('application/reactflow', JSON.stringify(data));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <Grid
            templateAreas={`
                "drag icon title"
                "drag icon description"
            `}
            gridTemplateRows="1fr 1fr"
            gridTemplateColumns="4px 48px 1fr"
            columnGap={2}
            border='1px'
            borderRadius="md"
            borderColor="rgb(30 41 59)"
            padding="8px"
            background="white"
            cursor="grabbing"
            draggable
            onDragStart={(event) => sendNodeData(event, 'default')}
        >
            <GridItem
                area='drag'
            >
                <Flex
                    flexDir="column"
                    justifyContent="center"
                    w="100%"
                    h="100%"
                >
                    <div className="w-1 h-5 border-x border-slate-500"></div>
                </Flex>
            </GridItem>
            <GridItem area='icon'>
                <Image
                    src={python}
                    boxSize='48px'
                    alt="Python"
                />
            </GridItem>
            <GridItem
                area='title'
                w='100%'
                maxW="100%"
                className="truncate"
            >
                <strong>{data.label}</strong>
            </GridItem>
            <GridItem
                area='description'
                w='100%'
                maxW="100%"
                className="truncate"
            >
                Execute a Python function
            </GridItem>
        </Grid>
    )
}

export default Node
