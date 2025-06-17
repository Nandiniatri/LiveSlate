import Button from "../../components/Button";

const HomePageHeader = ({ }) => {

    return (
        <div className="header-wrapper">
            <div className="header-container">
                <h2 className="header-title">LiveSlate</h2>
                <div className="toolbar">
                    <Button className="home-header-btn">Login</Button>
                </div>
            </div>
        </div>
    );
};

export default HomePageHeader;

