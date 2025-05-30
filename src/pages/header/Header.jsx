import { PiShareFatBold } from "react-icons/pi";
import { FiPlus } from "react-icons/fi";
import { LuVideo } from "react-icons/lu";
import { useState } from "react";
import Modal from "../../components/Modal";

const Header = () => {
  const [isModalOpen , setIsModalOpen] = useState(false);

  const handleShare = () => {
    setIsModalOpen(true);
  }

  const handleCLoseModal = () => {
    setIsModalOpen(false);
  }

  return (
    <div className="header-container">
      <h2 className="header-title">LiveSlate</h2>

      <div className="toolbar">
        <div className="tool-item">
          <LuVideo size={22} className="icon" />
        </div>

        <div className="tool-item">
          <PiShareFatBold size={20} className="icon" onClick={handleShare} />
        </div>

        <div className="tool-item">
          <FiPlus size={22} className="icon" />
        </div>
      </div>

      <Modal isOpen={isModalOpen} isClose={handleCLoseModal}>
        <h1 style={{color:"white"}}>Hello</h1>
        <button onClick={handleCLoseModal}>Close</button>
      </Modal>
    </div>
  );
};

export default Header;

