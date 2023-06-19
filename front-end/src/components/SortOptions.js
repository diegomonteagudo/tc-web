import "./styles.css";
import { useState } from 'react';
import { Button, Dropdown } from 'antd';

export default function SortOptions({onUpdateSort, onSetSortOption, onSetSortUp}){

  //SortOptions: 'Alphabet' / 'Creation time' / 'Modification time' / 'Labels' / 'Deadline'
  //             'content'  /   'createTime'  /     'modifyTime'    /  'label' / 'deadline'
  const [showSort, setShowSort] = useState('Creation time'); // to show the sort option on the button

  const [sortUp, setSortup] = useState(false); //Sort by increase / decrease
  
  const items = [
    {
      key: '1',
      label: (<div onClick={()=>{
        onSetSortOption('content');
        setShowSort('Alphabet');
        onUpdateSort();
      }}>Alphabet</div>),
    },
    {
      key: '2',
      label: (<div onClick={()=>{
        onSetSortOption('createTime');
        setShowSort('Creation time'); 
        onUpdateSort();
      }}>Creation time</div>),
    },
    {
      key: '3',
      label: (<div onClick={()=>{
        onSetSortOption('modifyTime');
        setShowSort('Modification time'); 
        onUpdateSort();
      }}>Modification time</div>),
    },
    {
      key: '4',
      label: (<div onClick={()=>{
        onSetSortOption('label');
        setShowSort('Label'); 
        onUpdateSort();
      }}>Label</div>),
    },
    {
      key: '5',
      label: (<div onClick={()=>{
        onSetSortOption('deadline');
        setShowSort('Deadline'); 
        onUpdateSort();
      }}>Deadline</div>),
    },
    
  ];

  return(
    <>
      <Dropdown
        menu={{items}}
        trigger={['click']}
      >
        <Button>Sorted by : {showSort}</Button>
      </Dropdown>
      <Button onClick={()=>{
        setSortup(!sortUp);
        onSetSortUp(!sortUp);
        onUpdateSort();
      }}>
        {sortUp?'Up':'Down'}
      </Button>
    </>
  )
}