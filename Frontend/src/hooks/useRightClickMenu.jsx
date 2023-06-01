import { useState, useEffect } from "react";


export default function useRightClickMenu(){

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [networkId, setNetworkId] = useState();

    const handleContextMenu = (e) => {
        e.preventDefault();
        setX(e.pageX);
        setY(e.pageY);
        setShowMenu(true);
    }

    const handleClick = () => {
        showMenu && setShowMenu(false);
    }
   
    useEffect(() => {
        document.getElementById('MyCard').addEventListener('click', handleClick)
        document.getElementById('MyCard').addEventListener('contextmenu', handleContextMenu)
        return () => {
            document.getElementById('MyCard').removeEventListener('click', handleClick)
            document.getElementById('MyCard').removeEventListener('contextmenu', handleContextMenu);      
        }
    })

    return { x, y, showMenu };

}