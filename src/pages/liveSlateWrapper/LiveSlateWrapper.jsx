import { useParams } from "react-router-dom";
import LiveSlate from "./pages/LiveSlate";

const LiveSlateWrapper = () => {
    const { roomID } = useParams();
    return <LiveSlate roomID={roomID} />;
};

export default LiveSlateWrapper;