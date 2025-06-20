import { useState } from "react";
import Button from "../../components/Button";
import SignUpPage from "../signUpPage/SignUp";
import { Link } from "react-router-dom";
import ModalB from "../../components/ModalB";
import { useUsername } from "../../context/UsernamePrompt";

const HomePageHeader = () => {
    const { user } = useUsername();
    console.log(user);


    return (
        <div className="header-wrapper">
            <div className="header-container">
                <h2 className="header-title">LiveSlate</h2>
                <div className="toolbar">
                    {user ? (
                        <img
                            src={user.user_metadata.avatar_url}
                            alt="Profile"
                            style={{ width: 80, borderRadius: '50%', marginBottom: 10 }}
                        />
                    ) : (
                        <Button className="home-header-btn"><Link to={'/signUp'}>Sign up</Link></Button>
                    )}
                </div>
            </div>

        </div>
    );
};

export default HomePageHeader;

