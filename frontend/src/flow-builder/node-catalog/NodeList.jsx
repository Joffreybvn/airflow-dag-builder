import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    Box, CircularProgress, Grid, Input, Center, Alert, AlertIcon, AlertTitle,
    AlertDescription
} from "@chakra-ui/react";
import fuzzysort from "fuzzysort";
import Node from "./Node";
import useOperatorDefinitions from "../../api/useOpertorDefinitions";


const NodeList = () => {
    const {isLoading, error, data} = useOperatorDefinitions();
    const searchBar = useRef(null);
    const [operatorDefinitions, setOperatorDefinitions] = useState([]);
    const [allNodesList, setAllNodesList] = useState([]);
    const [displayedNodesList, setDisplayedNodesList] = useState([]);

    // Filter Operators based on search bar
    const listFuzzySearch = useCallback(
        (event) => {
            if (event.target.value === '') {
                setDisplayedNodesList(allNodesList);

            } else {
                let filteredOperators = fuzzysort.go(
                    event.target.value,
                    operatorDefinitions,
                    {key: 'label'}
                )
                let newNodes = []
                for (let operator of filteredOperators) {
                    newNodes.push(<Node key={operator.obj.label} data={operator.obj}/>)
                }
                setDisplayedNodesList(newNodes);
            }
        },
        [allNodesList, operatorDefinitions]
    )

    // Save operator definitions
    useEffect(() => {
        if (data) {
            setOperatorDefinitions(data.data);
        }
    }, [data]);

    // Generate list of all Operator nodes + display it (default)
    useEffect(() => {
        let defaultNodes = []
        for (let operator of operatorDefinitions) {
            defaultNodes.push(<Node key={operator.label} data={operator}/>)
        }
        setAllNodesList(defaultNodes);
        setDisplayedNodesList(defaultNodes);
    }, [operatorDefinitions]);

    return (
        <Grid
            templateAreas={`"search" "list"`}
            gridTemplateRows='50px 1fr'
            maxHeight='100%'
            gap={2}
        >
            <Box
                area='search'
                marginRight='42px'
            >
                <Input
                    placeholder="Find operators..."
                    size='md'
                    ref={searchBar}
                    onChange={listFuzzySearch}
                />
            </Box>
            <Grid
                area='list'
                gap={2}
                width='350px'
                height='100%'
                maxHeight='100%'
                overflowY="scroll"
                paddingRight='10px'
            >
                {
                    isLoading ?
                        <Center>
                            <CircularProgress isIndeterminate/>
                        </Center>
                        : null
                }
                {
                    error ?
                        <Alert
                            status='error'
                            variant='subtle'
                            flexDirection='column'
                            alignItems='center'
                            justifyContent='center'
                            textAlign='center'
                            background='unset'
                        >
                            <AlertIcon boxSize='40px' mr={0}/>
                            <AlertTitle mt={4} mb={1} fontSize='lg'>
                                Load failed
                            </AlertTitle>
                            <AlertDescription maxWidth='sm'>
                                The operator catalog could not be loaded
                            </AlertDescription>
                        </Alert>
                        : null
                }
                {
                    displayedNodesList ? displayedNodesList : null
                }
            </Grid>
        </Grid>
    )
}


export default NodeList;
