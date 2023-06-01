import React from 'react';
import './switch.scss'

const SwitchMail = ({ isOnMail, handleToggleMail, onColorMail }) => {
  return (
    <>
      <input
        checked={isOnMail}
        onChange={handleToggleMail}
        className="react-switch-checkbox"
        id={`react-switch-new-mail`}
        type="checkbox"
      />
      <label
        style={{ background: isOnMail && onColorMail }}
        className="react-switch-label"
        htmlFor={`react-switch-new-mail`}
      >
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default SwitchMail;