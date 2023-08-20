import {
    useCallback, useEffect, useRef,
    useState
} from 'react';
import {
    Accordion,
    Center,
    Flex
} from "@chakra-ui/react";
import DragVertical from "../../utils/DragVertical";
import InputText from "./form/InputText";
import SettingsAccordionItem from "./SettingsAccordionItem";


const NodeSetting = ({panelWrapper, selectedNode = null}) => {
    const [minWidth, maxWidth] = [60, 90];
    const [width, setWidth] = useState(400);
    const [displaySettings, setDisplaySettings] = useState(true);

    // Set drag ghost image to empty image
    const disableGhostImage = useCallback((event) => {
        event.dataTransfer.setDragImage(new Image(), 0, 0);
    }, [])

    // Panel can be resized by dragging left bar
    const resizePanel = useCallback((event) => {
        const panelBounds = panelWrapper.current.getBoundingClientRect();

        if (event.clientX !== 0) {
            let newWidth = panelBounds.width - event.clientX;
            newWidth = Math.min(Math.max(newWidth, minWidth), panelBounds.width - maxWidth)
            setWidth(newWidth);
        }
    }, [panelWrapper, minWidth, maxWidth]);

    let requiredSettings = [];
    let optionalSettings = [];

    if (selectedNode.data !== undefined) {
        for (let operatorSettings of selectedNode.data.parameters) {

            let requiredSettingsBlock = [];
            for (let requiredSetting of Object.values(operatorSettings[0])) {
                requiredSettingsBlock.push(<InputText name={requiredSetting.name}/>)
            }
            requiredSettings.push(
                <SettingsAccordionItem
                    name="Operator"
                    isRequired={true}
                >{requiredSettingsBlock}
                </SettingsAccordionItem>
            )

            // for (let optionalSettingList of operatorSettings[1]) {
            //     requiredSettings.push(<InputText name={optionalSettingList.name}/>)
            // }
        }
        // for (let parameter of Object.values(selectedNode.data.parameters[0][0])) {
        //     requiredSettings.push(<InputText name={parameter.name}/>)
        // }
    }

    // Display Node settings only if there is enough space
    // and if a node is selected
    useEffect(() => {
        if ((width === minWidth) || (requiredSettings.length === 0)) {
            setDisplaySettings(false);
        } else {
            setDisplaySettings(true)
        }
    }, [width, minWidth, requiredSettings]);

    return (
        <Flex
            background="rgb(248 250 252)"
            style={{width: width}}
        >

            {/* Draggable bar */}
            <Center
                w="20px"
                borderX="1px"
                borderColor="rgb(226 232 240)"
                cursor="ew-resize"
                draggable
                onDragStart={disableGhostImage}
                onDrag={resizePanel}
            >
                <DragVertical/>
            </Center>

            {/* Node settings */}
            <Flex
                flex={1}
                flexDirection="column"
                padding="1.25rem"
                overflow="hidden"
            >
                {
                    displaySettings ?
                        <Accordion>
                            {requiredSettings}
                            {/*<SettingsAccordionItem*/}
                            {/*    name="AthenaOperator"*/}
                            {/*    isRequired={true}*/}
                            {/*>*/}
                            {/*    { requiredSettings }*/}
                            {/*</SettingsAccordionItem>*/}
                            {/*<SettingsAccordionItem*/}
                            {/*    name="BaseOperator"*/}
                            {/*    isRequired={true}*/}
                            {/*>*/}
                            {/*    { requiredSettings }*/}
                            {/*</SettingsAccordionItem>*/}
                        </Accordion>
                        : null
                }
            </Flex>
        </Flex>
    );
};

export default NodeSetting;
