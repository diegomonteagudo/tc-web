import "./styles.css";
import { useState } from 'react';
import { EditOutlined, DeleteOutlined, DownOutlined } from '@ant-design/icons';
import { Input, Button, Space, Collapse, Layout, Menu, Breadcrumb, Typography, Dropdown } from 'antd';
import InputPart from './components/InputPart.js';
import SortOptions from './components/SortOptions.js';
import MyCollapse from './components/MyCollapse/myCollapse.js';

const { Panel } = Collapse;


let tacheId = 10;
let groupId = "100";

// let i = 0;

/**
 * Convert groups from their data form as a flat list to something the antd Menu and Dropdown understands
 * @param flatGroups the list of groups in a flat form, as data
 * @returns the list of groups in their menu nested form
 */
const jsonFlatToMenuStructure = (flatGroups, clickHandler, handlerKeyName) => {
  const convertedData = [];

  //RECURSIVE FUNCTION !!!
  const findChildren = (group) => {
    const children = group.childrenGroups.length>0
      ? group.childrenGroups.map((childId) => {
          const child = flatGroups.find((item) => item.id === childId);
          return {
            key: child.id,
            label: child.name,
            attachedLabels: child.attachedLabels,
            children: findChildren(child),
            [handlerKeyName]: (()=>clickHandler(child.id))  //obligatoire puisque onClick de Menu ne regarde pas les parents
          };
        })
      : null;

    return children;
  };

  //Make the final list with "root" parents 
  flatGroups.forEach((group) => {
    if (!group.parentGroup) {
      const convertedGroup = {
        key: group.id,
        label: group.name,
        children: findChildren(group),
        attachedLabels: group.attachedLabels,
        [handlerKeyName]: (()=>clickHandler(group.id)) //obligatoire puisque onClick de Menu ne regarde pas les parents
      };
      convertedData.push(convertedGroup);
    }
  });

  return convertedData;
};


function GroupSettings({groups, activeGroup, changeActiveGroup, deleteGroup, addGroup, moveGroup}){
  if(activeGroup.id==="z0"){
    return(<></>);
  }

  /**
   * List the IDs of all the descendants from a group, including itself
   * @param ancestorID ID of the root group whose descendants shall be listed
   * @returns The list of descendants ID
   */

  const groupDescendants = (ancestorID) => {
    const children = groups.find(group => group.id === ancestorID).childrenGroups;
    if(children.length===0){
      return [ancestorID]
    } else {
      return [ancestorID,...children.flatMap(child => groupDescendants(child))]
    }
  }

  //liste d'ID des descendants du group actif
  const activeGroupDescendants = groupDescendants(activeGroup.id);
  //filtrage pour enlever les descendants
  const groupsFiltered = groups.filter(group => !activeGroupDescendants.includes(group.id));
  //enlever les références aux descendants chez les parents
  const groupsCleaned = groupsFiltered.map(group => ({
    ...group, childrenGroups:group.childrenGroups.filter(childID => !activeGroupDescendants.includes(childID))
  }))

  //adapted moveGroup to pass as click handler for jsonFlatToMenuStructure
  //mais aussi empêcher le déplacement vers son propre parent
  const moveGroupFunctionPartial = (groupToMove) => {
    return (
      function moveGroupKnowParent(destinationId){
        if(destinationId!==activeGroup.parentGroup){
          moveGroup(groupToMove, destinationId)
        }
      }
    )
  }

  const items = [
    {
      key:'s1',
      label:"Move group to",
      children: [ {key:'s2', label:"(root folder)"},
      ...jsonFlatToMenuStructure(groupsCleaned, moveGroupFunctionPartial(activeGroup.id), "onTitleClick")
      ]
    },{
      key:'s3',
      label:"Delete group"
    },{
      key:'s4',
      label:'Delete group and sub-groups'
    }
  ]

  //Pour les boutons sans enfants seulement. Pour les déplacements vers groupes avec sous-groupes, attribut spécial (comme Menu)
  const onClick = ({ key }) => {
    if (key==='s3') { //supprimer groupe
      if(activeGroup.parentGroup!==null){
        changeActiveGroup(activeGroup.parentGroup);
      } else {
        changeActiveGroup("z0");
      }
      deleteGroup([activeGroup.id]);
    } else if(key==='s4'){ //suprimer groupe et ses descendants
      if(activeGroup.parentGroup!==null){
        changeActiveGroup(activeGroup.parentGroup);
      } else {
        changeActiveGroup("z0");
      }
      deleteGroup(activeGroupDescendants.slice().reverse())
    } else if(key === 's2'){ //move (si la destination est root)
      moveGroup(activeGroup.id, null)
    } else if(key !== activeGroup.parentGroup) { //move
      moveGroup(activeGroup.id, key)
    }
  };

  return(
    <Space>
      <Typography.Title level={2}>{activeGroup.name}</Typography.Title>
      <Dropdown menu={{ items, onClick }}>
          <Space>
            Settings
            <DownOutlined />
          </Space>
      </Dropdown>
    </Space>
  )
}

function ActiveGroupPath({groups, activeGroup, changeActiveGroup}){
  if(activeGroup.id==="z0"){
    return(<Typography.Title level={2}>ALL TASKS</Typography.Title>)
  }

  const constructPath = (currentGroup, list) => {
    if(!currentGroup){
      return [{title: 'All', onClick:(() => changeActiveGroup("z0"))},...list]; //le groupe all considéré comme root
    } else {
      const parentID = currentGroup.parentGroup;
      const newList = list===[]?
      [{title: currentGroup.name, onClick:(() => changeActiveGroup(currentGroup.id))},...list] //les groupes parents sur le chemin
      :[{title: currentGroup.name},...list]; //lorsque le groupe sélectionné est le currentGroup de cette fonction
      return constructPath(groups.find(grp => grp.id===parentID), newList);
    }
  }

  return(
    <>
      <Breadcrumb separator=">" items={constructPath(activeGroup,[])}/>
    </>
  )
}

function PageTache({taches, tachesFini, setTaches, setFini, addTask, deleteTask, changeTask, editStatusSelect, 
  activeGroup, groups, changeActiveGroup, deleteGroup, addGroup, moveGroup}){

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
  
    function handleAddTache(input, inLabel, deadline){
      let newTaskLabels = inLabel.split(',');
      if(activeGroup.id!=="z0" && newTaskLabels[0].length>0){
        newTaskLabels = [...activeGroup.attachedLabels,...newTaskLabels];
      } else if(activeGroup.id!=="z0"){
        newTaskLabels = activeGroup.attachedLabels;
      }
      setTaches([
        ...taches,
        { 
          id: tacheId++, 
          content: input, 
          label: newTaskLabels, 
          editLabel: false,
          importance: false,
          deadline: deadline,
          createTime: new Date(),
          modifyTime: new Date(),
        }
      ])
    }
  
    function DeleteButton({list, a}){
      const [List, setList] = (list===taches)?[taches, setTaches]:[tachesFini, setFini]
      return(
        <Button 
          // className="deleteButton" 
          icon={<DeleteOutlined />}
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
          importance:element.importance, 
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
  
    function onImportance(a){
      setTaches(taches.map(t=>(
        t.id===a.id ? a:t
      )))
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
        <ActiveGroupPath groups={groups} activeGroup={activeGroup} changeActiveGroup={changeActiveGroup}/>
        <GroupSettings
          groups={groups}
          activeGroup={activeGroup}
          changeActiveGroup={changeActiveGroup}
          deleteGroup={deleteGroup}
          addGroup={addGroup}
          moveGroup={moveGroup}/>
        <LabelListing activeGroup={activeGroup}/>

        <br/><br/><br/>

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
          onImportance={onImportance}
          clickEditButton={clickEditButton}
          onEditTache={handleEdit}
          DeleteButton={DeleteButton}
          SortOption={[SortOption, sortUp]}
          Sort={Sort}
          activeGroup={activeGroup}
        />
  
        {/* <p>rander: {i++}</p> */}
      </>
    )
  
}

function LabelListing({activeGroup}){
  if(activeGroup.id==="z0"){
    return <></>
  } else {
    return <Typography.Title level={5}>Labels for this group : {activeGroup.attachedLabels.join(', ')}</Typography.Title>
  }
}

function NewGroupArea({addGroup}){
  const [groupNameInput, setGroupNameInput] = useState('');
  const [groupLabelInput, setGroupLabelInput] = useState('');

  function NewGroupButton(){
    if (groupNameInput !== '' && groupLabelInput !== ''){
      return(
        <Button 
          type="primary" danger
          onClick={()=>{
            addGroup(groupNameInput, groupLabelInput.split(','), null, []);
            setGroupNameInput('');
            setGroupLabelInput('');
        }}>Create</Button>
      )
    }
    return <Button type="primary" disabled>Create</Button>
  }

  return(
    <>
      <Collapse>
         <Panel header="New group" key="0">
           <Input 
             value={groupNameInput}
             placeholder="New group name"
             prefix={<EditOutlined />}
             onChange={e => setGroupNameInput(e.target.value)}
           />
           <Input 
             value={groupLabelInput}
             placeholder="New group's labels (separated by ,)"
             prefix={<EditOutlined />}
             onChange={e => setGroupLabelInput(e.target.value)}
           />
           <NewGroupButton/>
        </Panel>
      </Collapse>
    </>
  )
}


//sidebar pour la sélection du groupe
function GroupSidebar({groups, activeGroup, changeActiveGroup, addGroup}){
  const groupBlock = [
    {key:"z0", label:"ALL TASKS"},
    {key:"z1", label:"Custom groups", children:jsonFlatToMenuStructure(groups, changeActiveGroup, "onTitleClick"), type:"group"}
  ]
  

  return(
    <>
    <Menu 
      onClick={({key}) => changeActiveGroup(key)} //ATTENTION : ne concerne que les feuilles. Les parents gèrent ça avec un attribut spécial
      theme="light" mode="inline" 
      selectedKeys={activeGroup.id} 
      items={groupBlock}
      selectable={true}
    />
    <Menu
      style={{
       position: 'relative',
       bottom: 0,
       zIndex: 1,
      }}><NewGroupArea addGroup={addGroup}/></Menu>
    </>
  )
}



//component principal
export default function TodoGlobal(){
  const { Header, Content, Footer, Sider } = Layout;
  const [activeGroup, setActiveGroup] = useState({id:"z0", name:"ALL TASKS"});
  const [taches, setTaches] = useState([]);
  const [tachesFini, setFini] = useState([]);

  //PLACEHOLDER
  const [groups, setGroups] = useState([
    {
      id:"1", 
      name:"School", 
      attachedLabels:["homework","school"],
      parentGroup:null,
      childrenGroups:["2"]
    },{
      id:"2", 
      name:"Math", 
      attachedLabels:["math"],
      parentGroup:"1",
      childrenGroups:["3"]
    },{
      id:"3", 
      name:"Algebra project", 
      attachedLabels:["algebra","AAP"],
      parentGroup:"2",
      childrenGroups:[]
    },{
      id:"4", 
      name:"Miscellaneous", 
      attachedLabels:["cat"],
      parentGroup:null,
      childrenGroups:[]
    }]
  );

  const changeActiveGroup = (groupId) => {
    console.log(groupId);
    if(groupId==="z0"){
      setActiveGroup({id:"z0", name:"ALL TASKS"});
    } else {
      setActiveGroup(getGroupFromID(groupId));
    }
  }
  
  /**
   * Get the whole group object from its ID alone
   * @param id ID of the group to get
   * @returns The object
   */
  function getGroupFromID(id){
    return groups.find(group => group.id === id)
  }

  /**
   * Create a group from its parameters
   * @param name Name of the new group
   * @param attachedLabels The list of labels the tasks in the group must have
   * @param parentGroup The ID of the parent group in the sidebar hierarchy (null if top level)
   * @param childrenGroups The list of ID of children groups in the sidebar hierarchy (null if no children)
   */
  function addGroup(name, attachedLabels, parentGroup, childrenGroups){
    groupId = (parseInt(groupId, 10)+1).toString();
    setGroups([...groups,{id:groupId, name, attachedLabels, parentGroup, childrenGroups}]);;
  }

  /**
   * Modify existing groups DO NOT CALL CONSECUTIVELY
   * @param groupIDs LIST of the IDs of the groups to change
   * @param newGroups LIST of the new groups IN THE SAME ORDER
   */
  function changeGroup(groupIDs, newGroups){
    let tempGroups = groups.slice();
    groupIDs.forEach((ID,index) => {
      const newGroup = newGroups[index];
      tempGroups = tempGroups.map(group => (group.id===ID ? newGroup:group))
    })
    setGroups(tempGroups);
  }

  /**
   * Badly written function... everything is very badly organized but i'm realizing
   * it too late to redo anything now...
   * Delete a list of groups. The parent will see this child removed from them,
   * and its own children will be reattached to their grandparent
   * List form because multiple groups can be deleted with 1 call because of
   * synchronization problems of setGroups. If only 1 group, 
   * make a list with only this group in it.
   * WARNING : if there are multiple groups, they must be sorted in the
   * child -> parent order, as returned by the descendant function in
   * the GroupSettings component in its reverse order !!!
   * @param id LIST of IDs of the group(s) to delete
   */
  function deleteGroup(idList){
    let tempGroup = groups.slice();
    console.log("et voici la liste entrée :",idList)
    idList.forEach(id => {
      const groupToDelete = tempGroup.find(groupFinding => groupFinding.id===id);
      const parentGroupID = groupToDelete.parentGroup;
      const childrenGroupsID = groupToDelete.childrenGroups;
      tempGroup = tempGroup.filter(group => group.id!==id);
      //if no parents and no children : just delete from groups
      if(parentGroupID === null && childrenGroupsID.length===0){
        //nothing, already removed
      //if no children : remove ID from parent's children list
      } else if(childrenGroupsID.length===0){
        tempGroup = tempGroup.map(group => {
          if(group.id===parentGroupID){
            return {...group,childrenGroups:group.childrenGroups.filter(grp => grp !== id)};
          } else {
            return group;
          }
        })
      //if no parents : set children's parent to null (root)
      } else if(parentGroupID === null){
        tempGroup = tempGroup.map(group => {
          if(childrenGroupsID.includes(group.id)){
            return {...group,parentGroup:null};
          } else {
            return group;
          }
        })
      //if parents and children : attach children to their grandparent
      } else {
        console.log("en tous cas il a pris le bon chemin")
        tempGroup = tempGroup.map(group => {
          if(childrenGroupsID.includes(group.id)){
            return {...group,parentGroup:parentGroupID};
          } else if(group.id===parentGroupID){
            const newChildrenGroups = [...group.childrenGroups.filter(child => child!==id),...childrenGroupsID];
            return {...group,childrenGroups:newChildrenGroups};
          } else {
            return group;
          }
        })
      }
    })
    console.log(tempGroup);

    setGroups(tempGroup);
  }


  /**
   * Move a group AND its children into another group (or make it top level)
   * @param id ID of the group to move along its children
   * @param newParent Id of the parent to move the group into ("null" if top level)
   */
  function moveGroup(groupToMoveID, newParentID){
    const groupToMove = getGroupFromID(groupToMoveID);
    if(newParentID!==null && groupToMove.parentGroup !== null){
      const oldParent = getGroupFromID(groupToMove.parentGroup);
      const newParent = getGroupFromID(newParentID);
      changeGroup([oldParent.id,newParentID,groupToMoveID], [{
        id:oldParent.id,
        name:oldParent.name,
        attachedLabels:oldParent.attachedLabels,
        parentGroup:oldParent.parentGroup,
        childrenGroups:oldParent.childrenGroups.filter(childID => childID !== groupToMoveID)
      },{
        id:newParent.id,
        name:newParent.name,
        attachedLabels:newParent.attachedLabels,
        parentGroup:newParent.parentGroup,
        childrenGroups:[...newParent.childrenGroups,groupToMoveID]
      },{
        id:groupToMoveID,
        name:groupToMove.name,
        attachedLabels:groupToMove.attachedLabels,
        parentGroup:newParentID,
        childrenGroups:groupToMove.childrenGroups
      }])
    } else if (newParentID!==null){
      const newParent = getGroupFromID(newParentID);
      changeGroup([newParentID,groupToMoveID], [{
        id:newParent.id,
        name:newParent.name,
        attachedLabels:newParent.attachedLabels,
        parentGroup:newParent.parentGroup,
        childrenGroups:[...newParent.childrenGroups,groupToMoveID]
      },{
        id:groupToMoveID,
        name:groupToMove.name,
        attachedLabels:groupToMove.attachedLabels,
        parentGroup:newParentID,
        childrenGroups:groupToMove.childrenGroups
      }])
    } else if(groupToMove.parentGroup !== null){
      const oldParent = getGroupFromID(groupToMove.parentGroup);
      changeGroup([oldParent.id,groupToMoveID], [{
        id:oldParent.id,
        name:oldParent.name,
        attachedLabels:oldParent.attachedLabels,
        parentGroup:oldParent.parentGroup,
        childrenGroups:oldParent.childrenGroups.filter(childID => childID !== groupToMoveID)
      },{
        id:groupToMoveID,
        name:groupToMove.name,
        attachedLabels:groupToMove.attachedLabels,
        parentGroup:newParentID,
        childrenGroups:groupToMove.childrenGroups
      }])
    }
  }

  /**
   * Obtenir facilement les states des listes
   * @param isOngoing true si cela concerne les tâches non-finies
   * @returns [la liste concernée, son setter]
   */
  function getNeededStates(isOngoing){
    if(isOngoing){
      return [taches, setTaches];
    } else {
      return [tachesFini, setFini];
    }
  }

  /**
   * Ajouter une tâche à l'une des listes de tâches
   * @param isOngoing true si cela concerne les tâches non-finies
   * @param newTask nouvelle tâche à ajouter
   */
  function addTask(isOngoing, newTask){
    const [liste, setListe] = getNeededStates(isOngoing);
    newTask.label = newTask.label.filter(label => label !== '');
    newTask.label = [...new Set(newTask.label)];
    setListe([...liste, newTask]);
  }

  /**
   * Supprimer une tâche de l'une des listes de tâches
   * @param isOngoing true si cela concerne les tâches non-finies
   * @param task ID de la tâche à supprimer
   */
  function deleteTask(isOngoing, taskId){
    const [liste, setListe] = getNeededStates(isOngoing);
    setListe(liste.filter(e=> e.id !== taskId));
  }

  /**
   * Changer une tâche de l'une des listes de tâches
   * @param isOngoing true si cela concerne les tâches non-finies
   * @param taskId ID de la tâche à modifier
   */
  function changeTask(isOngoing, taskId, newTask){
    const [liste, setListe] = getNeededStates(isOngoing);
    setListe(liste.map(e => (e.id===taskId ? newTask:e)));
  }

  /**
   * Mettre à true l'édition d'une tâche et mettre toutes les autres tâches à false
   * @param isOngoing true si cela concerne les tâches non-finies
   * @param taskId ID de la tâche dont le status va être mis à true
   */
  function editStatusSelect(isOngoing, taskId){
    const [listeConcernee, setListeConcernee] = getNeededStates(isOngoing);
    const [autreListe, setAutreListe] = getNeededStates(!isOngoing);
    setListeConcernee(listeConcernee.map(e=>(
      e.id===taskId ? {...e, editLabel:true}:{...e, editLabel:false}
    )));
    setAutreListe(autreListe.map(e=>({...e, editLabel:false})));
  }

  return(
    <Layout style={{ minHeight: "100vh" }}>
      <Header><p style={{color:'red'}}>Header : Connexion et paramètres plus tard</p></Header>
        <Layout>
          <Sider>
            <GroupSidebar 
              groups={groups} 
              changeActiveGroup={changeActiveGroup}
              activeGroup={activeGroup}
              addGroup={addGroup}/>
          </Sider>
          <Content><PageTache 
            taches={taches} 
            tachesFini={tachesFini}
            setTaches={setTaches}
            setFini={setFini}
            addTask={addTask}
            deleteTask={deleteTask}
            changeTask={changeTask}
            editStatusSelect={editStatusSelect}
            activeGroup={activeGroup}
            changeActiveGroup={changeActiveGroup}
            groups={groups}
            deleteGroup={deleteGroup}
            addGroup={addGroup}
            moveGroup={moveGroup}/></Content>
        </Layout>
      <Footer style={{ textAlign: 'center' }}>Projet WEB de Chijin GUI et Diego MONTEAGUDO</Footer>
    </Layout>
  )
}


