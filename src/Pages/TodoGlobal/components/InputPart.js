import "./styles.css";
import { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Input, Button, DatePicker } from 'antd';

export default function InputPart({onAddTache}){
  const [input, setInput] = useState('');
  const [inLabel, setInLabel] = useState('');
  const [deadline, setDeadline] = useState('');

  function EnterButton(){
    if (input !== ''){
      return(
        <Button 
          type="primary" danger
          onClick={()=>{
            onAddTache(input, inLabel, deadline);
            setInput('');
            setInLabel('');
        }}>Add</Button>
      )
    }
    return <Button type="primary" disabled>Add</Button>
  }

  return(
    <>
      <Input 
        value={input}
        placeholder="Enter your TODO here!"
        prefix={<EditOutlined />}
        onChange={e => setInput(e.target.value)}
      />
      <Input 
        value={inLabel}
        placeholder="Enter your LABEL here! (use ',' to seperate your labels)"
        prefix={<EditOutlined />}
        onChange={e => setInLabel(e.target.value)}
      />

      <DatePicker onChange={(_, dateString) => setDeadline(dateString)} />

      <EnterButton />
    </>
  )
}