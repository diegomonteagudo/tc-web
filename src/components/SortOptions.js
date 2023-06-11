import "./styles.css";
import { useState } from 'react';
import { Button, Dropdown } from 'antd';

export default function SortOptions({onUpdateSort}){
  const [sort, setSort] = useState('Alphabet'); //Sort by 'Alphabet' / 'Creation time' / 'Modification time'
  const [sortUp, setSortup] = useState(true); //Sort by increase / decrease
  const items = [
    {
      key: '1',
      label: (<div onClick={()=>{
        setSort('Alphabet');
        onUpdateSort(sort, sortUp);
        console.log('change sort to Alphabet');
      }}>Alphabet</div>),
    },
    {
      key: '2',
      label: (<div onClick={()=>{
        setSort('Creation time'); 
        onUpdateSort(sort, sortUp);
      }}>Creation time</div>),
    },
    {
      key: '3',
      label: (<div onClick={()=>{
        setSort('Modification time'); 
        onUpdateSort(sort, sortUp);
      }}>Modification time</div>),
    },
    {
      key: '4',
      label: (<div onClick={()=>{
        setSort('Label'); 
        onUpdateSort(sort, sortUp);
      }}>Label</div>),
    },
  ];

  return(
    <>
      <Dropdown
        menu={{items}}
        trigger={['click']}
      >
        <Button>Sorted by : {sort}</Button>
      </Dropdown>
      <Button onClick={()=>{
        setSortup(!sortUp);
        onUpdateSort(sort, sortUp);
      }}>
        {sortUp?'Up':'Down'}
      </Button>
    </>
  )
}