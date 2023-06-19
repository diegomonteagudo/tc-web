import "./App.css";
import "./styles.css";
import { useState } from 'react';
import { EditOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { theme, Input, Button, Checkbox, Space, Collapse, Layout, Menu, Dropdown } from 'antd';
import InputPart from './components/InputPart.js';
import SortOptions from './components/SortOptions.js';


const { Panel } = Collapse;


let tacheId = 0;
// let i = 0;


function PageTache(){

  const { token } = theme.useToken();
  const panelStyle = {
    background: "#f5f1f1fa",
    borderRadius: token.borderRadiusLG,
  }

  const [taches, setTaches] = useState([]);
  // const [tachesFini, setFini] = useState([]);

  const [inputLabel, setInputLabel] = useState(''); //utilisé pour l'input pendant l'édition des labels
  const [inputTache, setInputTache] = useState(''); //utilisé pour l'input pendant l'édition des taches

  function Sort(key, sortUp){
    var int = (sortUp === true)?'1':'-1';
    var sortFunc = function(a, b){
      if (key === 'label'){
        return a.label[0]>b.label[0]?int:-int
      }
      return a[key]>b[key]?int:-int
    }
    return sortFunc;
  }
  function updateSort(sortOption, sortUp){
    var sortBy = '';
    switch (sortOption){
      case 'Alphabet':
        sortBy = 'content';
        break;
      case 'Creation time':
        sortBy = 'createTime';
        break;
      case 'Modification time':
        sortBy = 'modifyTime';
        break;
      case 'Label':
        sortBy = 'label';
        break;
      default:
        break;
    }
    setTaches(taches.sort(Sort(sortBy, sortUp))); 
    // setFini(tachesFini.sort(Sort(sortBy, sortUp)))
  }

  // const [sort, setSort] = useState('Alphabet'); //Sort by 'Alphabet' / 'Creation time' / 'Modification time'
  // const [sortUp, setSortup] = useState(true); //Sort by increase / decrease
  // const items = [
  //   {
  //     key: '1',
  //     label: (<div onClick={()=>{
  //       setSort('Alphabet');
  //       updateSort(sort);
  //     }}>Alphabet</div>),
  //   },
  //   {
  //     key: '2',
  //     label: (<div onClick={()=>{
  //       setSort('Creation time'); 
  //       updateSort(sort);
  //     }}>Creation time</div>),
  //   },
  //   {
  //     key: '3',
  //     label: (<div onClick={()=>{
  //       setSort('Modification time'); 
  //       updateSort(sort);
  //     }}>Modification time</div>),
  //   },
  //   {
  //     key: '4',
  //     label: (<div onClick={()=>{
  //       setSort('Label'); 
  //       updateSort(sort);
  //     }}>Label</div>),
  //   },
  // ];

  function handleAddTache(input, inLabel){
    setTaches([
      ...taches,
      { 
        id: tacheId++, 
        content: input, 
        label: inLabel.split(','), 
        edit: false,
        finish: false,
        createTime: new Date(),
        modifyTime: new Date(),
      }
    ])
  }

  function AfficherTache({t, finish}){
    if (t.finish===finish){
      return(
        <Space>
          <Checkbox
            checked={t.finish}
            className={finish===true?"TacheFini":""}
            key={t.id} 
            onClick={()=>SetFinish(t)}
          >
            {!t.edit && t.content}
          </Checkbox>
          {/* afficher les labels */}
          {!t.edit && afficherLabels({t})}

          {/* button pour editer */}
          {!t.edit && <Button icon = {<FormOutlined />} onClick={()=>{clickEditButton(t)}}/>}

          {/* input pendant l'édition le tache */}
          {t.edit && <input
            placeholder="Edit your TACHE here!"
            className = "EditInput"
            value={t.content}
            onChange = {e => {setTaches(taches.map(tt=>(
              tt.id===t.id?{...tt, content:e.target.value}:tt
            )))}}
          />}

          {/* input pendant l'édition des labels */}
          {t.edit && 
            <input
              placeholder="Edit your LABEL here!"
              className = "EditInput"
              value={inputLabel}
              onChange = {e => {setInputLabel(e.target.value)}}
            />}

          {/* button de la confirmation */}
          {t.edit && 
            <Button 
              onClick = {() => {setTaches(
                taches.map(e => (
                  e.id===t.id ? {
                    ...e, 
                    content:inputTache,
                    label:inputLabel.split(","), 
                    edit:false, 
                    modifyTime:new Date(), 
                  }:e
                )))
              }}
            >Confirm</Button>}

          <DeleteButton a = {t}/>
        </Space>
      )
    }
  }

  function DeleteButton({a}){
    return(
      <Button 
        className="deleteTache" icon={<DeleteOutlined />}
        onClick = {()=>{
          setTaches(
            taches.filter(e=>
              e.id !== a.id)
          )
        }}
      />
    )
  }

  function SetFinish(tache){
    setTaches(taches.map(e=>(
      e.id===tache.id?{
        ...e, finish:!e.finish,
      }:e
    )))
  }

  // const MoveAToB = (list_a, list_b, element)=>{
  //   const [listA, setListA] = (list_a===taches)?[taches, setTaches]:[tachesFini, setFini]
  //   const [listB, setListB] = (list_b===taches)?[taches, setTaches]:[tachesFini, setFini]

  //   setListB([
  //     ...listB,
  //     { id: element.id, 
  //       content: element.content, 
  //       label: element.label, 
  //       edit: element.editLabel, 
  //       createTime: element.createTime,
  //       modifyTime: new Date(), 
  //     }
  //   ])
  //   setListA(
  //     listA.filter(e =>
  //       e.id !== element.id
  //     )
  //   )
  // }

  function afficherLabels({t}){
    return(
      <div className = "Label">
      <Space>
        {t.label.map(l=>(
          <div>
            [{l}]
          </div>
        ))}
      </Space>
    </div>)
  }

  function clickEditButton(t){
    setInputTache(t.content);
    setInputLabel(t.label.join(","));
    setTaches(taches.map(e=>(
      e.id===t.id ? {...e, edit:true}:{...e, edit:false}
    )))
  }


  return(
    <>
      <InputPart onAddTache={handleAddTache} />

      {/* <Dropdown
        menu={{items}}
        trigger={['click']}
      >
        <Button>Sorted by : {sort}</Button>
      </Dropdown>
      <Button onClick={()=>{
        setSortup(!sortUp);
        updateSort(sort);
      }}>
        {sortUp?'Up':'Down'}
      </Button> */}

      <SortOptions onUpdateSort={updateSort} />

      <br/><br/>

      <Collapse defaultActiveKey={['1']}>
        {/*panel pour "Things to do" */}
        <Panel header="Things to do: " key="1" style={panelStyle}>
          <Space direction="vertical">
            {taches.map(t => (
              <AfficherTache t = {t} finish = {false} />
            ))}
          </Space>
        </Panel>

        {/*panel pour "Things have been done" */}
        <Panel header="Things have been done:" key="2" style={panelStyle}>
          <Space direction="vertical">
            {taches.map(t => (
              <AfficherTache t = {t} finish = {true} />
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