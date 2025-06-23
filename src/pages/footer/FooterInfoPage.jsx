import { useUsername } from "../../context/UsernamePrompt";

const FooterInfoPage = () => {
    const { footerNav } = useUsername();

    return (
        <div>
            <h1>Hello</h1>
            {footerNav.map((footItm) => (
                <h2>{footItm.name}</h2>
            ))}
        </div>
    )
}

export default FooterInfoPage;