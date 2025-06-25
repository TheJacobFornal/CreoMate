import React from 'react';
import zakupy from '../assets/zakupy.png';
import constructor from '../assets/constructors.png';
import setttings from '../assets/settings.png';
import tree from '../assets/tree_1.png';
import zakupy_blue from '../assets/zakupy_blue.png';
import constructors_blue from '../assets/constructors_blue.png';
import settings_blue from '../assets/settings_blue.png';
import tree_blue from '../assets/tree_blue.png';
import './SideMenu.css';

const SideMenu = ({ activePage, setActivePage }) => {
  return (
    <div className="side-menu">
      <div className="top-icons">
        <div className="icon" onClick={() => setActivePage(1)}>
          <img src={activePage === 1 ? constructors_blue : constructor} alt="Etap 1" />
        </div>
        <div className="icon" onClick={() => setActivePage(2)}>
          <img src={activePage === 2 ? zakupy_blue : zakupy} alt="Etap 2" />
        </div>
        <div className="icon" onClick={() => setActivePage(4)}>
          <img src={activePage === 4 ? tree_blue : tree} alt="Etap 4" />
        </div>
      </div>
      <div className="bottom-icon">
        <div className="icon" onClick={() => setActivePage(3)}>
          <img src={activePage === 3 ? settings_blue : setttings} alt="Etap 3" />
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
