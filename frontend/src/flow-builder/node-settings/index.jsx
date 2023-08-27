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
import SettingsBlock from "./SettingsBlock";
import {isObjectEmpty} from "../../utils/functools";


const generateSettingId = (nodeId, operatorName, isRequired) => {
    let id = nodeId + '_' + operatorName;
    if (isRequired) {
        id += '_required';
    }
    return id
}

const NodeSetting = ({panelWrapper, selectedNode = undefined}) => {
    const [minWidth, maxWidth] = [60, 90];
    const [width, setWidth] = useState(400);
    const [settings, setSettings] = useState({});
    let displayedSettings;

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
        if ((selectedNode !== undefined) && !(settings.hasOwnProperty(selectedNode.id))) {
            const newSettings = {
                required: [],
                optional: []
            }

            const operatorNames = [selectedNode.data.label].concat(selectedNode.data.children);
            for (let [i, operatorSettings] of selectedNode.data.parameters.entries()) {

                if ((operatorSettings[0] !== undefined) && !isObjectEmpty(operatorSettings[0])) {
                    newSettings.required.push(
                        <SettingsBlock
                            key={
                            generateSettingId(
                                operatorNames[i],
                                selectedNode.id,
                                true
                            )}
                            nodeId={selectedNode.id}
                            name={operatorNames[i]}
                            isRequired={true}
                            rawParameters={operatorSettings[0]}
                        />
                    )
                }

                if ((operatorSettings[1] !== undefined) && !isObjectEmpty(operatorSettings[1])) {
                    newSettings.optional.push(
                        <SettingsBlock
                            key={
                            generateSettingId(
                                operatorNames[i],
                                selectedNode.id,
                                true
                            )}
                            nodeId={selectedNode.id}
                            name={operatorNames[i]}
                            isRequired={false}
                            rawParameters={operatorSettings[1]}
                        />
                    )
                }
            }

            const nodeSettings = {};
            nodeSettings[selectedNode.id] = newSettings;
            setSettings({...settings,...nodeSettings});
        }
    }, [selectedNode, settings]);


    // Display Node settings only if there is enough space and if a node is selected
    if (
        (selectedNode === undefined)
        || (settings[selectedNode.id] === undefined)
        || (width === minWidth)
    ) {
        displayedSettings = (<Accordion></Accordion>)
    } else {
        displayedSettings = (
            <Accordion>
                {settings[selectedNode.id].required}
                {settings[selectedNode.id].optional}
            </Accordion>
        )
    }

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
                {displayedSettings}
            </Flex>
        </Flex>
    );
};

export default NodeSetting;
