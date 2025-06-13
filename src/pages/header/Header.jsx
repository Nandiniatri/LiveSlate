import { PiShareFatBold } from "react-icons/pi";
import { LuVideo } from "react-icons/lu";
import { useState } from "react";
import Modal from "../../components/Modal";
import { IoIosClose } from "react-icons/io";
import { BsChatDots } from "react-icons/bs";
import ChatBox from "../chatBox/ChatBox";


const Header = ({ roomID }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleShare = () => {
    setIsModalOpen(true);
  }

  const handleCLoseModal = () => {
    setIsModalOpen(false);
  }

  const handleCopyLink = () => {
    // navigator.clipboard.writeText("https://liveslate.app/invite/abc123");
    // alert("Link copied!");
    const fullURL = `${window.location.origin}/room/${roomID}`;
    console.log(fullURL);
    navigator.clipboard.writeText(fullURL);
  }

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <div className="header-container">
      <h2 className="header-title">LiveSlate</h2>

      <div className="toolbar">
        <div className="tool-item videoIcon">
          <LuVideo size={22} className="icon" />
        </div>

        <div className="tool-item">
          <PiShareFatBold size={20} className="icon" onClick={handleShare} />
        </div>

        <div className="tool-item ChatIcon">
          <BsChatDots size={22} className="icon" onClick={openChat} />
        </div>

        <div className="tool-item header-ChatIcon">
          <BsChatDots size={22} className="icon" />
        </div>

      </div>

      <Modal isOpen={isModalOpen} isClose={handleCLoseModal}>
        <div className="closeBtn-div">
          <IoIosClose onClick={handleCLoseModal} size={23} className="close-btn" />
        </div>

        <div className="invite-modal">
          <h2 className="invite-title">Invite people</h2>

          <div className="link-section">
            <input
              type="text"
              value={`${window.location.origin}/room/${roomID}`}
              readOnly
              className="invite-link"
            />
            <button className="copy-btn" onClick={handleCopyLink}>Copy Link</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isChatOpen} isClose={closeChat} >
        <div className="closeBtn-div">
          <IoIosClose onClick={closeChat} size={23} className="close-btn" />
        </div>
        <ChatBox />
      </Modal>

    </div >
  );
};

export default Header;

