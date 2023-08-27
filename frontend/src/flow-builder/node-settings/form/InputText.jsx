import React, {
    useEffect
} from "react";
import {
    Input,
    Badge,
    InputGroup,
    InputLeftAddon,
    InputRightElement
} from "@chakra-ui/react";
import useStore from '../../../store';
import {shallow} from "zustand/shallow";


const InputText = ({nodeId, name}) => {
    const {getNodeSetting, setNodeSetting} = useStore((state) => ({
        getNodeSetting: state.getNodeSetting,
        setNodeSetting: state.setNodeSetting
    }), shallow);
    const [value] = React.useState(getNodeSetting(nodeId, name));

    return (
        <InputGroup size='sm'>
            <InputLeftAddon children={name} />
            <Input
                value={value}
                onChange={(event) => {
                    setNodeSetting(nodeId, name, event.target.value)
                }}
            />
            <InputRightElement width='4rem'>
                <Badge
                    variant='outline'
                    colorScheme='green'
                >
                    Text
                </Badge>
            </InputRightElement>
        </InputGroup>
    )
}

export default InputText;
