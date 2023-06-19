import React, { useState } from 'react';

function MyComponent() {
  const [list, setList] = useState([
    { id: 1, text: 'Item 1', showInput: false, inputValue: '' },
    { id: 2, text: 'Item 2', showInput: false, inputValue: '' },
    { id: 3, text: 'Item 3', showInput: false, inputValue: '' }
  ]);
  const [showAll, setShowAll] = useState(false);

  const handleInputChange = (event, itemId) => {
    const updatedList = list.map(item => {
      if (item.id === itemId) {
        return { ...item, inputValue: event.target.value };
      }
      return item;
    });
    setList(updatedList);
  };

  const handleButtonClick = (itemId) => {
    const updatedList = list.map(item => {
      if (item.id === itemId) {
        return { ...item, showInput: !item.showInput };
      }
      return item;
    });
    setList(updatedList);
  };

  const handleToggleAll = () => {
    const updatedList = list.map(item => ({ ...item, showInput: !showAll }));
    setList(updatedList);
    setShowAll(!showAll);
  };

  return (
    <div>
      <button onClick={handleToggleAll}>
        {showAll ? '隐藏全部' : '显示全部'}
      </button>
      {list.map(item => (
        <div key={item.id}>
          <span>{item.text}</span>
          {showAll || item.showInput ? (
            <div>
              <input
                type="text"
                value={item.inputValue || ''}
                onChange={(event) => handleInputChange(event, item.id)}
              />
            </div>
          ) : null}
          <button onClick={() => handleButtonClick(item.id)}>
            {item.showInput ? '隐藏输入框' : '显示输入框'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default MyComponent;
