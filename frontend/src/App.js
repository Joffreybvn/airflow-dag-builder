import {
    ChakraBaseProvider,
    extendBaseTheme
} from '@chakra-ui/react'
import chakraTheme from '@chakra-ui/theme'
import {
    QueryClient,
    QueryClientProvider
} from "react-query";
import DagBuilder from "./flow-builder";


const {
    Button,
    Input,
    InputGroup,
    InputLeftAddon,
    Flex,
    Box,
    Grid,
    Image,
    CircularProgress,
    Center,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    GridItem,
    Badge,
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
} = chakraTheme.components

const theme = extendBaseTheme({
    components: {
        Button,
        Input,
        InputGroup,
        InputLeftAddon,
        Flex,
        Box,
        Grid,
        Image,
        CircularProgress,
        Center,
        Alert,
        AlertIcon,
        AlertTitle,
        AlertDescription,
        GridItem,
        Badge,
        Accordion,
        AccordionButton,
        AccordionIcon,
        AccordionItem,
        AccordionPanel,
    },
})

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            notifyOnChangeProps: "tracked",
            refetchOnWindowFocus: false,
            retry: 1,
            retryDelay: 500,
            refetchOnMount: true, // Refetches stale queries, not "always"
            staleTime: 5 * 60 * 1000, // 5 minutes
            initialDataUpdatedAt: new Date().setMinutes(-6), // make sure initial data is already expired
        },
        mutations: {
            retry: 1,
            retryDelay: 500,
        },
    },
});


function App() {
    return (
        <ChakraBaseProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <DagBuilder/>
            </QueryClientProvider>
        </ChakraBaseProvider>
    );
}

export default App;
