import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import {
    CircularProgress,
    Grid,
    Input,
    Center,
    GridItem,
    Flex
} from "@chakra-ui/react";
import fuzzysort from "fuzzysort";
import useOperatorDefinitions from "../../api/useOpertorDefinitions";
import Node from "./Node";
import AlertErrorCover from "../../utils/AlertErrorCover";


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
            h='100%'
            maxH='100%'
            gap={2}
        >
            <GridItem
                area='search'
                marginRight='42px'
            >
                <Input
                    placeholder="Find operators..."
                    size='md'
                    ref={searchBar}
                    onChange={listFuzzySearch}
                />
            </GridItem>
            <GridItem
                area='list'
                overflowY="scroll"
            >
                <Flex
                    flexDirection="column"
                    gap={2}
                    width='350px'
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
                            <AlertErrorCover
                                title="Load failed"
                                description="The operator catalog could not be loaded"
                            />
                            : null
                    }
                    {
                        displayedNodesList ? displayedNodesList : null
                    }
                </Flex>
            </GridItem>
        </Grid>
    )
}


export default NodeList;
