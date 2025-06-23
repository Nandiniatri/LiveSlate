import { useParams } from "react-router-dom";
import { useUsername } from "../../context/UsernamePrompt";

const FooterInfoPage = () => {
    const { footerNav } = useUsername();
    const { id } = useParams();

    const selectedItem = footerNav.find((item) => item.id === id);
    console.log(selectedItem);
    

    if (!selectedItem) {
        return <h2>No Item Found</h2>
    }


    return (
        <div>
            <h1>Hello</h1>

        </div>
    )
}

export default FooterInfoPage;