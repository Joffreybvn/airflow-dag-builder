import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box, Flex
} from "@chakra-ui/react";
import {
    useEffect,
    useState
} from "react";
import InputText from "./form/InputText";


const SettingsBlock = ({nodeId, name, isRequired, rawParameters}) => {
    const [parameters, setParameters] = useState(undefined);

    useEffect(() => {
        if (parameters === undefined) {
            let newParameters = [];
            for (let parameter of Object.values(rawParameters)) {
                newParameters.push(
                    <InputText
                        key={name + '_' + parameter.name}
                        nodeId={nodeId}
                        name={parameter.name}
                    />
                )
            }
            setParameters(newParameters)
        }
    }, [name, nodeId, rawParameters, parameters]);

    return (
        <AccordionItem>
            <h2>
                <AccordionButton>
                    <Box
                        as="span"
                        flex='1'
                        textAlign='left'
                    >
                        <strong>{ name }</strong> -&nbsp;
                        <i>{
                            isRequired ?
                                (<span style={{color: 'red'}}>Required</span>)
                                : 'Optional'
                        }</i> settings
                    </Box>
                    <AccordionIcon/>
                </AccordionButton>
            </h2>
            <AccordionPanel
                pb={4}
                background="white"
            >
                <Flex
                    gap={2}
                    flexDir="column"
                >
                    { parameters }
                </Flex>
            </AccordionPanel>
        </AccordionItem>
    )
}

export default SettingsBlock
