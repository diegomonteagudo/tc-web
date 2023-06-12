import "./styles.css";
import { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
// import { EditOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Space, Layout, Menu } from 'antd';
// import { theme, Input, Button, Checkbox, Space, Collapse, Layout, Menu, Dropdown } from 'antd';
import InputPart from './components/InputPart.js';
import SortOptions from './components/SortOptions.js';
import MyCollapse from './components/myCollapse.js';


let tacheId = 10;
// let i = 0;


function PageTache(){

  const [taches, setTaches] = useState([]);
  const [tachesFini, setFini] = useState([]);

  const [SortOption, setSortOption] = useState('createTime');
  const [sortUp, setSortup] = useState(false); //Sort by increase / decrease

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

  function updateSort(){
    setTaches(taches.sort(Sort(SortOption, sortUp))); 
    setFini(tachesFini.sort(Sort(SortOption, sortUp)))
  }

  function handleAddTache(input, inLabel){
    setTaches([
      ...taches,
      { 
        id: tacheId++, 
        content: input, 
        label: inLabel.split(','), 
        editLabel: false,
        createTime: new Date(),
        modifyTime: new Date(),
      }
    ])
  }

  function DeleteButton({list, a}){
    const [List, setList] = (list===taches)?[taches, setTaches]:[tachesFini, setFini]
    return(
      <Button 
        className="deleteButton" icon={<DeleteOutlined />}
        key={'DeleteButton: '+String(a.id)}
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
      { id: element.id, 
        content: element.content, 
        label: element.label, 
        editLabel: element.editLabel, 
        createTime: element.createTime,
        modifyTime: new Date(), 
      }
    ])
    setListA(
      listA.filter(e =>
        e.id !== element.id
      )
    )
  }

  function afficherLabels({t}){
    let i=1
    return(
      <Space className = "Label" key={'Labels: '+String(t.id)}>
        {t.label.map(l=>{
          i++;
          return(
            <div key={'Label['+String(i)+']:'+String(t.id)}>
              [{l}]
            </div>
          )
        })}
      </Space>
    )
  }

  function clickEditButton(t, list){
    const [list1, setList1] = (list===taches)?[taches, setTaches]:[tachesFini, setFini]
    const [list2, setList2] = (list===tachesFini)?[taches, setTaches]:[tachesFini, setFini]
    
    setList1(list1.map(e=>(
      e.id===t.id ? {...e, editLabel:true}:{...e, editLabel:false}
    )))
    setList2(list2.map(e=>(
      {...e, editLabel:false}
    )))
  }

  function handleEdit(list, e){
    const setList = (list===taches)?setTaches:setFini
    setList(list.map(l=>(
      l.id===e.id?e:l
    )))
  }



  return(
    <>
      <InputPart onAddTache={handleAddTache} />

      <SortOptions 
        onUpdateSort={updateSort} 
        onSetSortOption={setSortOption} 
        onSetSortUp={setSortup}
      />

      <br/><br/>

      <MyCollapse
        taches={taches}
        tachesFini={tachesFini}
        onMoveTache={MoveAToB}
        afficherLabels={afficherLabels}
        clickEditButton={clickEditButton}
        onEditTache={handleEdit}
        DeleteButton={DeleteButton}
        SortOption={[SortOption, sortUp]}
        Sort={Sort}
      />

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