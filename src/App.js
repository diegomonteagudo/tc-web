import "./App.css";
import "./styles.css";
import { useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { theme, Input, Button, Checkbox, Space, Collapse } from 'antd';


const { Panel } = Collapse;


let tacheId = 0;




export default function TicTocToe(){

  const { token } = theme.useToken();
  const panelStyle = {
    background: "#f5f1f1fa",
    borderRadius: token.borderRadiusLG,
  }

  const [input, setInput] = useState('');
  const [taches, setTache] = useState([]);
  const [tachesFini, setFini] = useState([]);
  

  function EnterButton(){
    if (input !== ''){
      return(
        <Button 
          type="primary" danger
          onClick={()=>{
            setTache([
              ...taches,
              { id: tacheId++, content: input}
            ]);
            setInput('');
        }}>Add</Button>
      )
    }
    return <Button type="primary" disabled>Add</Button>
  }

  function DeleteTache({list, a}){
    const [List, setList] = (list===taches)?[taches, setTache]:[tachesFini, setFini]

    return(
      <Button 
        className="deleteTache" icon={<DeleteOutlined />}
        onClick = {()=>{
          setList(
            List.filter(e=>
              e.id !== a.id)
          )
        }}
      />
    )

  }

  function MoveAToB({list_a, list_b, Class=""}){
    const [listA, setListA] = (list_a===taches)?[taches, setTache]:[tachesFini, setFini]
    const [listB, setListB] = (list_b===taches)?[taches, setTache]:[tachesFini, setFini]
  
    return(
      <Space direction="vertical">
        {listA.map(a => (
          <Checkbox
            className = {Class}
            key={a.id} 
            onClick={()=>{
              setListB([
                ...listB,
                { id: a.id, content: a.content}
              ]);
              setListA(
                listA.filter(e =>
                  e.id !== a.id
                )
              );
            }}>
              {a.content}
              <DeleteTache list={list_a} a = {a}/>
              </Checkbox>
        ))}
      </Space>
    )
  }

  return(
    <>
      <Input 
        value={input}
        placeholder="Enter your TODO here!"
        prefix={<EditOutlined />}
        onChange={e => setInput(e.target.value)}
      />
      
      <EnterButton />
      <br/>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="Things to do: " key="1" style={panelStyle}>
          <MoveAToB list_a={taches} list_b={tachesFini} />
        </Panel>

        <Panel header="Things have been done:" key="2" style={panelStyle}>
          <MoveAToB list_a={tachesFini} list_b={taches} Class="TacheFini"/>
        </Panel>
      </Collapse>
    </>
  )


}