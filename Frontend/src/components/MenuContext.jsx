import React from "react";
import useContextMenu from "../hooks/useContectMenu";
import "./MenuContext.scss";
import * as Icon from "react-icons/fc";

const MenuContextClick = (envoieId) => {
  const { anchorPoint, show } = useContextMenu();
 
  const idMemo = envoieId.envoieId[(envoieId.envoieId.length)-1]
 

  if (show) {
    return (
      
      <ul className="menu" style={{ top: anchorPoint.y, left: anchorPoint.x, zIndex: 1 }}>
        <li className="menu__item">
          <Icon.FcAddDatabase size={25} className="menu__icon" />
          <a href={`/networks/add`} >Ajouter</a>
        </li>
        <li className="menu__item">
          <Icon.FcSettings size={25} className="menu__icon" />
          <a href={`/networks/edit/${idMemo}`} >Editer</a>
        </li>
        <li className="menu__item">
          <Icon.FcSerialTasks size={25} className="menu__icon" />
          Ansible
        </li>
        {/* <li className="menu__item">
          <Icon.Download size={20} className="menu__icon" />
          Download
        </li> */}
        <hr className="separatiste" />
        {/* <li className="menu__item">
          <Icon.RefreshCw size={20} className="menu__icon" />
          Refresh
        </li> */}
        <li className="menu__item">
          <Icon.FcMenu size={25} className="menu__icon" />
          Retour
        </li>
      </ul>
    );
  }
  return <></>;
};

export default MenuContextClick;