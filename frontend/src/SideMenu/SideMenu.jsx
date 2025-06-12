import React from 'react';
import zakupy from '../assets/zakupy.png';
import constructor from '../assets/constructors.png';
import setttings from '../assets/settings.png';
import tree from '../assets/tree_1.png';
import './SideMenu.css';


const SideMenu = ({ setActivePage }) => {
  return (
    <div className="side-menu">
      <div style={{ margin: '20px 0', cursor: 'pointer' }} title="Etap 1" onClick={() => setActivePage(1)}>
        <img src={constructor} alt="Hint Icon" style={{ width: '24px', height: '24px' }} />
      </div>
      <div style={{ margin: '20px 0', cursor: 'pointer' }} title="Etap 2" onClick={() => setActivePage(2)}>
        <img src={zakupy} alt="Hint Icon" style={{ width: '24px', height: '24px' }} />
      </div>
      <div style={{ margin: '20px 0', cursor: 'pointer' }} title="Etap 4" onClick={() => setActivePage(4)}>
         <img src={tree} alt="Hint Icon" style={{ width: '24px', height: '24px' }} />
      </div>
      <div style={{ margin: '20px 0', cursor: 'pointer' }} title="Etap 3" onClick={() => setActivePage(3)}>
         <img src={setttings} alt="Hint Icon" style={{ width: '24px', height: '24px' }} />
      </div>
    </div>
  );
};

export default SideMenu;
