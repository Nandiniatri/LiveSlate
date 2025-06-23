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
            <h1>{selectedItem.name}</h1>
            {selectedItem.info && selectedItem.info.map((item, id) => (
                <div key={id}>
                    <p>{item.status}</p>
                    <p>{item.note}</p>
                </div>
            ))}
        </div>
    )
}

export default FooterInfoPage;