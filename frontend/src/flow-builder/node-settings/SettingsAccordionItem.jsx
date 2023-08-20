import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box
} from "@chakra-ui/react";
import {
    useEffect,
    useState
} from "react";
import InputText from "./form/InputText";


const SettingsAccordionItem = ({name, isRequired, rawParameters}) => {
    const [parameters, setParameters] = useState([]);

    useEffect(() => {
        let parameters = [];
        for (let parameter of Object.values(rawParameters)) {
            parameters.push(<InputText name={parameter.name}/>)
        }
        setParameters(parameters)
    }, [rawParameters, setParameters]);

    return (
        <AccordionItem>
            <h2>
                <AccordionButton>
                    <Box
                        as="span"
                        flex='1'
                        textAlign='left'
                    >
                        <strong>{ name }</strong> - {isRequired ? 'Required' : 'Optional'} settings
                    </Box>
                    <AccordionIcon/>
                </AccordionButton>
            </h2>
            <AccordionPanel
                pb={4}
                background="white"
            >
                { parameters }
            </AccordionPanel>
        </AccordionItem>
    )
}

export default SettingsAccordionItem
