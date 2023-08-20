import {
    useCallback,
    useEffect,
    useState
} from 'react';
import {
    Accordion,
    Center,
    Flex
} from "@chakra-ui/react";
import DragVertical from "../../utils/DragVertical";
import SettingsAccordionItem from "./SettingsAccordionItem";


const NodeSetting = ({panelWrapper, selectedNode = null}) => {
    const [minWidth, maxWidth] = [60, 90];
    const [width, setWidth] = useState(400);
    const [displaySettings, setDisplaySettings] = useState(true);
    const [requiredSettings, setRequiredSettings] = useState([]);
    const [optionalSettings, setOptionalSettings] = useState([]);

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

    // Generate required and optional settings
    useEffect(() => {
        if (selectedNode.data !== undefined) {
            const newRequiredSettings = [];
            const newOptionalSettings = [];

            const operatorNames = [selectedNode.data.label].concat(selectedNode.data.children);
            for (let [i, operatorSettings] of selectedNode.data.parameters.entries()) {

                if (operatorSettings[0] !== undefined) {
                    newRequiredSettings.push(
                        <SettingsAccordionItem
                            name={operatorNames[i]}
                            isRequired={true}
                            rawParameters={operatorSettings[0]}
                        />
                    )
                }

                if (operatorSettings[1] !== undefined) {
                    newOptionalSettings.push(
                        <SettingsAccordionItem
                            name={operatorNames[i]}
                            isRequired={false}
                            rawParameters={operatorSettings[1]}
                        />
                    )
                }
            }

            setRequiredSettings(newRequiredSettings);
            setOptionalSettings(newOptionalSettings)
        }
    }, [selectedNode.data]);

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
                            {optionalSettings}
                        </Accordion>
                        : null
                }
            </Flex>
        </Flex>
    );
};

export default NodeSetting;
