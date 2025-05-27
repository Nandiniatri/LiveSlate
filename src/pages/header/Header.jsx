// import { PiShareFatBold } from "react-icons/pi";
// import { FiPlus } from "react-icons/fi";
// import { LuVideo } from "react-icons/lu";

// const Header = () => {
//   return (
//     <div className="header-container">
//       <h2 className="header-title">LiveSlate</h2>

//       <div className="toolbar">
//         <div className="tool-item">
//           <LuVideo size={25} color='#fff' className="icon" />
//         </div>

//         <div className="tool-item">
//           <PiShareFatBold size={22} color='#fff' className="icon" />
//         </div>

//         <div className="tool-item">
//           <FiPlus size={25} color='#fff' className="icon" />
//         </div>
//       </div>
//     </div> 
//   );
// };

// export default Header;


import { PiShareFatBold } from "react-icons/pi";
import { FiPlus } from "react-icons/fi";
import { LuVideo } from "react-icons/lu";

const Header = () => {
  return (
    <div className="header-container">
      <h2 className="header-title">LiveSlate</h2>

      <div className="toolbar">
        <div className="tool-item">
          <LuVideo size={22} className="icon" />
        </div>

        <div className="tool-item">
          <PiShareFatBold size={20} className="icon" />
        </div>

        <div className="tool-item">
          <FiPlus size={22} className="icon" />
        </div>
      </div>
    </div>
  );
};

export default Header;

