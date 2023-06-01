import React, { useEffect, useState } from 'react';

type DropDownProps = {
  logs: string[];
  showDropDown: boolean;
  toggleDropDown: Function;
  logSelection: Function;
};

const DropDown: React.FC<DropDownProps> = ({
  logs,
  logSelection,
}: DropDownProps): JSX.Element => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  /**
   * Handle passing the city name
   * back to the parent component
   *
   * @param log  The selected city
   */
  const onClickHandler = (log: string): void => {
    logSelection(log);
  };

  useEffect(() => {
    setShowDropDown(showDropDown);
  }, [showDropDown]);

  return (
    <>
      <div className={showDropDown ? 'dropdown' : 'dropdown active'}>
        {logs.map(
          (log: string, index: number): JSX.Element => {
            return (
              <p
                key={index}
                onClick={(): void => {
                  onClickHandler(log);
                }}
              >
                {log}
              </p>
            );
          }
        )}
      </div>
    </>
  );
};

export default DropDown;