import {
    useCallback,
    useState
} from 'react';
import {
    Center,
    Flex
} from "@chakra-ui/react";
import DragVertical from "../../utils/DragVertical";
import SettingInputText from "./SettingInputText";


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

            if (newWidth === minWidth) {
                setDisplaySettings(false);
            } else {
                setDisplaySettings(true)
            }
        }
    }, [panelWrapper, minWidth, maxWidth]);


    let settings = [];
    if (selectedNode.data !== undefined) {
        console.log(Object.entries(selectedNode.data.parameters[0][0]));
        for (let parameter of Object.values(selectedNode.data.parameters[0][0])) {
            settings.push(<SettingInputText name={parameter.name}/>)
        }
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
                {
                    displaySettings ? settings : null
                }
            </Flex>
        </Flex>
    );
};

export default NodeSetting;
