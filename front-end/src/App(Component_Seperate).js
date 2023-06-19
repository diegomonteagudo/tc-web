import "./styles.css";
import { useState } from 'react';
import { EditOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { theme, Input, Button, Checkbox, Space, Collapse, Layout, Menu, Dropdown } from 'antd';
import InputPart from './components/InputPart.js';
import SortOptions from './components/SortOptions.js';
import MyCollapse from './components/myCollapse.js';


let tacheId = 0;
// let i = 0;


function PageTache(){

  const [taches, setTaches] = useState([]);
  const [tachesFini, setFini] = useState([]);

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
    setFini(tachesFini.sort(Sort(sortBy, sortUp)))
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

      <MyCollapse
        taches={taches}
        tachesFini={tachesFini}
        onMoveTache={MoveAToB}
        afficherLabels={afficherLabels}
        clickEditButton={clickEditButton}
        onEditTache={handleEdit}
        DeleteButton={DeleteButton}
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