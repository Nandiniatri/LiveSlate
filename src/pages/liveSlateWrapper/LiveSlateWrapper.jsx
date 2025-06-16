import { useParams } from "react-router-dom";
import LiveSlate from "../LiveSlate";
import { useUser } from "../../context/UserContext";

const LiveSlateWrapper = () => {
    // const { roomID } = useParams();
    const { roomID } = useUser();
    return <LiveSlate roomID={roomID} />
};

export default LiveSlateWrapper;