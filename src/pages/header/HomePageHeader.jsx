import { useState } from "react";
import Button from "../../components/Button";
import SignUpPage from "../signUpPage/SignUp";

const HomePageHeader = () => {
    const [showLoginForm, setShowLoginForm] = useState(false);

    const handleLoginBtn = () => {
        setShowLoginForm(true);
    }

    return (
        <div className="header-wrapper">
            <div className="header-container">
                <h2 className="header-title">LiveSlate</h2>
                <div className="toolbar">
                    <Button className="home-header-btn" onClick={handleLoginBtn}>Sign up</Button>
                </div>
            </div>

            {showLoginForm && (
               <SignUpPage />
            )}

        </div>
    );
};

export default HomePageHeader;

