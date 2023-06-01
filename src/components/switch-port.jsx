import React from 'react';
import './switch.scss'

const SwitchPort = ({ isOnPort, handleTogglePort, onColorPort }) => {
  return (
    <>
      <input
        checked={isOnPort}
        onChange={handleTogglePort}
        className="react-switch-checkbox"
        id={`react-switch-new-port`}
        type="checkbox"
      />
      <label
        style={{ background: isOnPort && onColorPort }}
        className="react-switch-label"
        htmlFor={`react-switch-new-port`}
      >
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default SwitchPort;