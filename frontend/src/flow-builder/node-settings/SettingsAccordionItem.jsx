import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box
} from "@chakra-ui/react";


const SettingsAccordionItem = ({children, name, isRequired}) => {

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
                { children }
            </AccordionPanel>
        </AccordionItem>
    )
}

export default SettingsAccordionItem
