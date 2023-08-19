import axios from "axios";
import {useQuery} from "react-query";


export default function useOperatorDefinitions() {
    return useQuery(["operatorDefinitions"],  async () => {
        return await axios.get("http://0.0.0.0:8000/demo-data.json")
    });
}
