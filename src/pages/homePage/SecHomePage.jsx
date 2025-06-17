import './HomePage.css';

const SecHomePage = () => {
    return (
        <div className="sec-homepage">
            <div className="container">
                <h1 className="section-title">Collaborate with others in   <br /><span className="highlight-blue">real time</span></h1>
                <p className="section-subtitle">
                    Live video calls, real-time shared canvas, and instant messaging—designed for students and teachers to connect effectively.
                </p>

                <div className="features">
                    <div className="feature-card">
                        <img src="./assets/videocall.png" alt="Video Call" className="feature-icon" />
                        <h3 className="feature-title">Live Video Calls</h3>
                        <p className="feature-desc">
                            Connect in real-time with high-quality video calling for smooth classroom interactions.
                        </p>
                    </div>

                    <div className="feature-card">
                        <img src="./assets/canvas.png" alt="Canvas" className="feature-icon" />
                        <h3 className="feature-title">Shared Canvas</h3>
                        <p className="feature-desc">
                            Teachers can write, draw, and explain in real-time while students view everything live.
                        </p>
                    </div>

                    <div className="feature-card">
                        <img src="./assets/chat.png" alt="Chat" className="feature-icon" />
                        <h3 className="feature-title">Instant Chat</h3>
                        <p className="feature-desc">
                            Ask questions and share thoughts instantly with the built-in real-time chat.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SecHomePage;
