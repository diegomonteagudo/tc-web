import "./App.css";
import "./styles.css";
import { useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { theme, Input, Button, Checkbox, Space, Collapse, Layout, Menu } from 'antd';


const { Panel } = Collapse;


let tacheId = 0;
// let i = 0;


function PageTache(){

  const { token } = theme.useToken();
  const panelStyle = {
    background: "#f5f1f1fa",
    borderRadius: token.borderRadiusLG,
  }

  const [input, setInput] = useState('');
  const [inLabel, setInLabel] = useState('');
  const [taches, setTaches] = useState([]);
  const [tachesFini, setFini] = useState([]);

  const [inputFunc, setInputFunc] = useState(''); //utilisé pour l'input pendant l'édition des labels

  function EnterButton(){
    if (input !== ''){
      return(
        <Button 
          type="primary" danger
          onClick={()=>{
            setTaches([
              ...taches,
              { 
                id: tacheId++, 
                content: input, 
                label: inLabel.split(','), 
                editLabel: false
              }
            ]);
            setInput('');
            setInLabel('');
        }}>Add</Button>
      )
    }
    return <Button type="primary" disabled>Add</Button>
  }

  function DeleteTache({list, a}){
    const [List, setList] = (list===taches)?[taches, setTaches]:[tachesFini, setFini]
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

  const MoveAToB = (list_a, list_b, element)=>{
    const [listA, setListA] = (list_a===taches)?[taches, setTaches]:[tachesFini, setFini]
    const [listB, setListB] = (list_b===taches)?[taches, setTaches]:[tachesFini, setFini]

    setListB([
      ...listB,
      { id: element.id, content: element.content, label: element.label, editLabel: element.editLabel}
    ])
    setListA(
      listA.filter(e =>
        e.id !== element.id
      )
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
      <Input 
        value={inLabel}
        placeholder="Enter your LABEL here! (use ',' to seperate your labels)"
        prefix={<EditOutlined />}
        onChange={e => setInLabel(e.target.value)}
      />
      <EnterButton />
      <br/>

      <Collapse defaultActiveKey={['1']}>
        {/*panel pour "Things to do" */}
        <Panel header="Things to do: " key="1" style={panelStyle}>
          <Space direction="vertical">
            {taches.map(t => (
              <Space>
                <Checkbox
                  key={t.id} 
                  onClick={()=>MoveAToB(taches, tachesFini, t)}
                >
                  {t.content}
                </Checkbox>

                {/* button pour afficher les labels, clicker pour éditer */}
                {!t.editLabel && 
                  <button 
                    className="Label"
                    onClick={()=>{
                      setInputFunc(t.label.join(","));
                      setTaches(taches.map(e=>(
                        e.id===t.id ? {...e, editLabel:true}:{...e, editLabel:false}
                      )))
                      setFini(tachesFini.map(e=>(
                        {...e, editLabel:false}
                      )))
                    }}>
                    <Space>
                      {t.label.map(l=>(
                        <div>
                          [{l}]
                        </div>
                      ))}
                    </Space>
                  </button>}

                {/* input pendant l'édition des labels */}
                {t.editLabel && 
                  <input
                    placeholder="Edit your LABEL here!"
                    className="inputLabel"
                    value={inputFunc}
                    onChange = {e => {setInputFunc(e.target.value)}}
                  />}

                {/* button de la confirmation */}
                {t.editLabel && 
                  <Button 
                    onClick = {() => {setTaches(
                      taches.map(e => (
                        e.id===t.id ? {
                          ...e, 
                          label:inputFunc.split(","), 
                          editLabel:false}:e
                      )))
                    }}
                  >Confirm</Button>}

                <DeleteTache list={taches} a = {t}/>
              </Space>
            ))}
          </Space>
        </Panel>

        {/*panel pour "Things have been done" */}
        <Panel header="Things have been done:" key="2" style={panelStyle}>
          <Space direction="vertical">
            {tachesFini.map(t => (
              <Space>
                <Checkbox
                  className="TacheFini"
                  key={t.id} 
                  onClick={()=>MoveAToB(tachesFini, taches, t)}>
                  {t.content}
                </Checkbox>

                  {/* button pour afficher les labels, clicker pour éditer */}
                  {!t.editLabel && 
                    <button 
                      className="Label"
                      onClick={()=>{
                        setInputFunc(t.label.join(","));
                        setFini(tachesFini.map(e=>(
                          e.id===t.id ? {...e, editLabel:true}:{...e, editLabel:false}
                        )))
                        setTaches(taches.map(e=>(
                          {...e, editLabel:false}
                        )))
                      }}>
                      <Space>
                        {t.label.map(l=>(
                          <div>
                            [{l}]
                          </div>
                        ))}
                      </Space>
                    </button>}

                  {/* input pendant l'édition des labels */}
                  {t.editLabel && 
                    <input
                      placeholder="Edit your LABEL here!"
                      className="inputLabel"
                      value={inputFunc}
                      onChange = {e => {setInputFunc(e.target.value)}}
                    />}

                  {/* button de la confirmation */}
                  {t.editLabel && 
                    <Button 
                      onClick = {() => {setFini(
                        tachesFini.map(e => (
                          e.id===t.id ? {
                            ...e, 
                            label:inputFunc.split(","), 
                            editLabel:false}:e
                        )))
                      }}
                    >Confirm</Button>}

                  <DeleteTache list={tachesFini} a = {t}/>
              </Space>
            ))}
          </Space>
        </Panel>
      </Collapse>

      {/* <p>rander: {i++}</p> */}
    </>
  )


}

//sidebar pour la sélection du groupe
function GroupSidebar(){
  const [sidebarDisplayed, setSidebarDisplayed] = useState(true);
  
  // WARNING placeholders
  const group2children = [
    {key:"21", label:"Group21"},
    {key:"22", label:"Group22"},
    {key:"23", label:"Group23"}]
  const groups = [
    {key:"1", label:"Group1"},
    {key:"2", label:"Group2", children:group2children},
    {key:"3", label:"Group3"},
    {key:"4", label:"Group4"}]

  return(
    <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} items={groups} />
  )
}

//component principal
export default function TodoGlobal(){
  const { Header, Content, Footer, Sider } = Layout;

  return(
    <Layout style={{ minHeight: "100vh" }}>
      <Header><p style={{color:'red'}}>Header : Connexion et paramètres plus tard</p></Header>
        <Layout>
          <Sider>
            <GroupSidebar/>
          </Sider>
          <Content><PageTache/></Content>
        </Layout>
      <Footer style={{ textAlign: 'center' }}>Projet WEB de Chijin GUI et Diego MONTEAGUDO</Footer>
    </Layout>
  )
}