// import { useState } from "react";
// import Button from "../../components/Button";
// import SignUpPage from "../signUpPage/SignUp";
// import { Link } from "react-router-dom";
// import ModalB from "../../components/ModalB";
// import { useUsername } from "../../context/UsernamePrompt";

// const HomePageHeader = () => {
//     const { user, handleLogout } = useUsername();
//     console.log('User object:', user);


//     return (
//         <div className="header-wrapper">
//             <div className="header-container">
//                 <h2 className="header-title">LiveSlate</h2>
//                 <div className="toolbar">
//                     {user ? (
//                         <>
//                             <img
//                                 src={user.user_metadata.avatar_url}
//                                 style={{ width: 80, borderRadius: '50%', marginBottom: 10 }}
//                             />
//                             <p>{user.user_metadata.full_name}</p>
//                             <button className="logout-button" onClick={handleLogout}>
//                                 Logout
//                             </button>
//                         </>
//                     ) : (
//                         <Button className="home-header-btn"><Link to={'/signUp'}>Sign up</Link></Button>
//                     )}
//                 </div>
//             </div>

//         </div>
//     );
// };

// export default HomePageHeader;




import { useState } from "react";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import { useUsername } from "../../context/UsernamePrompt";

const HomePageHeader = () => {
    const { user, handleLogout } = useUsername();
    const [showProfileModal, setShowProfileModal] = useState(false);

    return (
        <div className="header-wrapper">
            <div className="header-container">
                <h2 className="header-title">LiveSlate</h2>
                <div className="toolbar">
                    {user ? (
                        <div className="avatar-wrapper">
                            <img
                                src={user.user_metadata.avatar_url}
                                style={{ width: 50, height: 50, borderRadius: "50%", cursor: "pointer" }}
                                onClick={() => setShowProfileModal(!showProfileModal)}
                                alt="User Avatar"
                            />

                            {showProfileModal && (
                                <div className="dropdown-profile-modal">
                                    <p style={{ margin: "0 0 10px", fontWeight: "bold" }}>
                                        {user.user_metadata.full_name}
                                    </p>
                                    <button className="logout-button" onClick={handleLogout}>
                                        Logout
                                    </button>
                                    <button className="close-button" onClick={() => setShowProfileModal(false)}>
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Button className="home-header-btn">
                            <Link to="/signUp">Sign up</Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePageHeader;

