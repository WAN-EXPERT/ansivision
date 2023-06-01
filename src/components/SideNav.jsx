import React, { useState } from "react";
import { Link } from "react-router-dom";
import useWindowSize from "../hooks/Hooks";
import * as Icon from "react-icons/fc";
import DropDown from "../components/dropdown"
import { useNavigate } from 'react-router-dom' ;
import { LOGSMENU } from '../constantes/logsmenu';
import { VERSION } from '../constantes/version';
import "./SideNav.scss";


export default function SideNav(isSearch) {

  const menuPaths = [
    {
      name: "Accueil",
      path: "/",
      icon: <Icon.FcHome size={30} />
    },
    {
      name: "A propos",
      path: "/about",
      icon: <Icon.FcAbout size={30}/>
    },
    {
      name: "Vision Globale",
      path: "/networks",
      icon: <Icon.FcAddDatabase size={30}/>
    },  
    {
      name: "Menu Ansible",
      path: "/ansible",
      icon: <Icon.FcProcess size={30}/>
    },
    {
      name: "Menu Recherche",
      path: "/networks/search",
      icon: <Icon.FcSearch size={30}/>
    },
    
    {
      name: "Synchronisation Status",
      path: "/networks/status",
      icon: <Icon.FcProcess size={30}/>
    },
    {
      name: "Paramètrage",
      path: "/settings",
      icon: <Icon.FcSettings size={30}/>
    }

  ];

  const [showDropDown, setShowDropDown] = useState(false);
  const [selectLog, setSelectLog] = useState("");
  const logs = () => {
    return LOGSMENU;
  };

  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const history = useNavigate();
  /**
   * Hide the drop down menu if click occurs
   * outside of the drop-down element.
   *
   * @param event  The mouse event
   */
  const dismissHandler = (event) => {
    if (event.currentTarget === event.target) {
      setShowDropDown(false);
    }
  };

  /**
   * Callback function to consume the
   * city name from the child component
   *
   * @param log  The selected city
   */
  const logSelection = (log) => {
    let tableaulog = log.split('/');
    console.log(tableaulog)
    setSelectLog(tableaulog[0]);
    history(`/${tableaulog[1]}`);
    setSlider(s => !s);

  };





  const [slider, setSlider] = useState(false);
  const size = useWindowSize();





  return (
    <>
      <nav className="nav-wrapper">
        <a  
          onClick={() => setSlider(s => !s)} 
        >
          <i className="titre">CONSOLE D'ADMINISTRATION</i>  
          <div className="logo-version">
            <img src={`/wan_logo-vert.png`} alt="logo2"/> 
            {VERSION}
          </div>

        </a>

      </nav>
      <div
        className="sidenav-overlay"
        onClick={() => setSlider(s => !s)}
        style={{
          display: slider && size.width < 980 ? "block" : "none",
          opacity: "1"
        }}
      />
      <ul
        id="slide-out"
        className="sidenav"
        style={{
          transform: slider ? "translateX(0%)" : "",
          transitionProperty: "transform",
          transitionDuration: ".25s",
          boxShadow: "0 0 1px 0 #2C2D2E",
          border: "solid"
        }}
      >
        <li>
           <img src={`/wan_logo-vert.png`} alt="logo"/> 
        </li>
        {menuPaths.map(elt => (
          <li key={elt.name} className="waves-effect" onClick={() => setSlider(s => !s)}>
            <div className="titre-icon">{elt.icon}</div>
            <Link className="titre" to={elt.path}>
              {elt.name}
            </Link>
          </li>
        ))}
        <li>
          <div className="divider" />
        </li>
        <li>
          <a className="subheader">Sous-Menu</a>
        </li>

        <div>
        <>
      <div className="announcement">
        <div>
            Type de Logs
        </div>
      </div>
      <button
        className={showDropDown ? "active" : undefined}
        onClick={() => {
          toggleDropDown()
          //setSlider(s => !s)
        }}
        onBlur={(e) =>
          dismissHandler(e)
        }
      >
        {/* <div className="toto">{selectLog ? "Select: " + selectLog : "Select ..."} </div> */}
        { selectLog ? <div className="selecte">{selectLog}</div> : <div className="selection">Selectionnez</div>}
        {showDropDown && (
          <DropDown
            logs={logs()}
            showDropDown={false}
            toggleDropDown={() => toggleDropDown()}
            logSelection={logSelection}
          />
        )}
      </button>
    </>
        </div>

        <li>
          <a className="waves-effect" href="https://wanexpert.fr">
            Visite du site WAN EXPERT
          </a>
        </li>
      </ul>
    </>
  );
}
