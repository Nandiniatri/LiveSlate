import React from "react";
import { FaVideo, FaImage } from "react-icons/fa";

const Header = () => {
  return (
    <div className="header">
      <h2 className="title">liveSlate</h2>
      <div className="toolbar">
        <div className="tool-item">
          <FaVideo className="icon" />
          <span>Video Call</span>
        </div>
        <div className="tool-item">
          <FaImage className="icon" />
          <span>Image</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
