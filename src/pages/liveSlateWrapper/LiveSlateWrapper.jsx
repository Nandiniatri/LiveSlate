import { useParams } from "react-router-dom";
import LiveSlate from "../LiveSlate";

const LiveSlateWrapper = () => {
    const { roomID } = useParams();
    return <LiveSlate roomID={roomID} />
};

export default LiveSlateWrapper;