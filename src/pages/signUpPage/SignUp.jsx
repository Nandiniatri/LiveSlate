// import { supabase } from '../../supabaseClient';
// import './SignUp.css';

// const SignUpPage = () => {

//     const handleGoogleLogin = async () => {
//         const { error } = await supabase.auth.signInWithOAuth({
//             provider: 'google',
//         })
//         if (error) {
//             console.error("Login error:", error.message);
//         }
//     }

//     return (
//         <div className="signup-container">
//             <div className="signup-icon">👤</div>
//             <h1 className="signup-heading">Welcome to <br />LiveSlate</h1>
//             <p className="signup-subheading">
//                 Create your account and discover<br />
//                 world-class collaboration.
//             </p>

//             {/* <button className="google-button">
//                 <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
//                 />
//                 Continue with Google
//             </button> */}

//             <div className="or-text">or</div>

//             <button className="continue-button" onClick={handleGoogleLogin}>Continue</button>

//             <p className="terms-text">
//                 By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
//             </p>

//             <p className="login-text">
//                 Already have an account? <a href="#">Login</a>
//             </p>
//         </div>
//     );
// };

// export default SignUpPage;














// import './SignUp.css';
// import { useEffect, useState } from 'react';
// import { supabase } from '../../supabaseClient'; // ✅ make sure path is correct
// import { useUsername } from '../../context/UsernamePrompt';

// const SignUpPage = () => {
//     //   const [user, setUser] = useState(null);
//     const { user, setUser } = useUsername();

//     // 🔐 Google login handler
//     const handleGoogleLogin = async () => {
//         const { error } = await supabase.auth.signInWithOAuth({
//             provider: 'google',
//         });
//         if (error) {
//             console.error("Login error:", error.message);
//         }
//     };

//     // 🔓 Logout handler
//     const handleLogout = async () => {
//         await supabase.auth.signOut();
//         setUser(null); // clear user on logout
//     };

//     // 🧠 Check user on mount
//     useEffect(() => {
//         const fetchUser = async () => {
//             const { data: { user } } = await supabase.auth.getUser();
//             setUser(user);
//         };

//         fetchUser();
//     }, []);

//     return (
//         <div className="signup-container">
//             {!user ? (
//                 <>
//                     <div className="signup-icon">👤</div>
//                     <h1 className="signup-heading">Welcome to <br />LiveSlate</h1>
//                     <p className="signup-subheading">
//                         Create your account and discover<br />
//                         world-class collaboration.
//                     </p>

//                     <button className="google-button" onClick={handleGoogleLogin}>
//                         <img
//                             src="https://icon2.cleanpng.com/20240216/yhs/transparent-google-logo-google-logo-with-colorful-letters-on-black-1710875297222.webp"
//                             style={{ width: 20, marginRight: 8 }}
//                         />
//                         Continue with Google
//                     </button>

//                     <div className="or-text">or</div>

//                     <button className="continue-button" onClick={handleGoogleLogin}>Continue</button>

//                     <p className="terms-text">
//                         By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
//                     </p>

//                     <p className="login-text">
//                         Already have an account? <a href="#">Login</a>
//                     </p>
//                 </>
//             ) : (
//                 <div className="user-info" style={{ textAlign: 'center' }}>
//                     <img
//                         src={user.user_metadata.avatar_url}
//                         alt="Profile"
//                         style={{ width: 80, borderRadius: '50%', marginBottom: 10 }}
//                     />
//                     <h2>{user.user_metadata.full_name}</h2>
//                     <p>{user.email}</p>

//                     <button className="logout-button" onClick={handleLogout}>
//                         Logout
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SignUpPage;















import './SignUp.css';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient'; // ✅ make sure path is correct
import { useUsername } from '../../context/UsernamePrompt';

const SignUpPage = () => {
    const { handleGoogleLogin } = useUsername();

    return (
        <div className="signup-container">
            <>
                <div className="signup-icon">👤</div>
                <h1 className="signup-heading">Welcome to <br />LiveSlate</h1>
                <p className="signup-subheading">
                    Create your account and discover<br />
                    world-class collaboration.
                </p>

                <button className="google-button" onClick={handleGoogleLogin}>
                    <img
                        src="https://icon2.cleanpng.com/20240216/yhs/transparent-google-logo-google-logo-with-colorful-letters-on-black-1710875297222.webp"
                        style={{ width: 20, marginRight: 8 }}
                    />
                    Continue with Google
                </button>

                <div className="or-text">or</div>

                <button className="continue-button" onClick={handleGoogleLogin}>Continue</button>

                <p className="terms-text">
                    By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
                </p>

                <p className="login-text">
                    Already have an account? <a href="#">Login</a>
                </p>
            </>
        </div>
    );
};
3
export default SignUpPage;




{/* <div className="user-info" style={{ textAlign: 'center' }}>
    <img
        src={user.user_metadata.avatar_url}
        alt="Profile"
        style={{ width: 80, borderRadius: '50%', marginBottom: 10 }}
    />
    <h2>{user.user_metadata.full_name}</h2>
    <p>{user.email}</p>

    <button className="logout-button" onClick={handleLogout}>
        Logout
    </button>
</div>
         */}