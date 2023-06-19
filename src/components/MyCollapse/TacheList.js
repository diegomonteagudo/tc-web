import "../styles.css";
import { FormOutlined, StarOutlined, StarFilled, CalendarOutlined } from '@ant-design/icons';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import dayjs from 'dayjs'


const dateFormat = 'YYYY/MM/DD';

export default function TacheList({
  taches, tachesFini, 
  Class, 
  onMoveTache, 
  afficherLabels, 
  // ImportanceStar, 
  onImportance, 
  clickEditButton, 
  onEditTache, 
  DeleteButton, 
  SortOption, Sort,
  activeGroup
}){

  let deadline = '';
  
  const visibleTasks = activeGroup.id==="z0"?taches:
  taches.filter(task => activeGroup.attachedLabels.every(
    label => task.label.includes(label)));

  function ImportanceStar({a}){
    return(
      <Button
        icon={a.importance===false?<StarOutlined />:<StarFilled />}
        key={'importanceStar: '+String(a.id)}
        onClick={()=>{
          onImportance({...a, importance:!a.importance});
        }}
      />
    )
  }

  taches.sort(Sort(SortOption[0], SortOption[1]))
  taches.sort(Sort('importance', 'Up'))

  return(
    <Space direction="vertical">
      {visibleTasks.map(t => (
        <Space key={t.id} >
          <Checkbox
            checked={Class==='TacheFini'?true:false}
            key={'TacheContent: '+String(t.id)}
            className={Class}
            onClick={()=>{onMoveTache(taches, tachesFini, t)}}
          >
            {!t.editLabel && t.content}
          </Checkbox>

          {/* Afficher Labels */}
          {!t.editLabel && afficherLabels({t})}

          {/* Input Tache */}
          {t.editLabel && <input
            placeholder="Edit your TACHE here!"
            className = "EditInput"
            value={t.content}
            onChange = {e => {onEditTache( taches, {...t, content:e.target.value} )}}
            key={'EditInput_T: '+String(t.id)}
          />}

          {/* Input Label */}
          {t.editLabel && <input
            placeholder="Edit your LABEL here!"
            className = "EditInput"
            value={t.label.join(',')}
            onChange = {e => {onEditTache( taches, {...t, label:e.target.value.split(',')} )}}
            key={'EditInput_L: '+String(t.id)}
          />}

          {/* Change deadline */}
          {t.editLabel && <DatePicker 
            onChange={(_, dateString) => {
              deadline = dateString
              onEditTache( taches, {...t, deadline:deadline} )
            }} 
            defaultValue={dayjs(t.deadline, dateFormat)} 
            format={dateFormat}
          />}

          {/* Button Confirmation */}
          {t.editLabel && <Button 
            onClick = {() => {onEditTache( taches, {...t, editLabel:false} )}}
            key={'ConfirmButton: '+String(t.id)}
          >Confirm</Button>}

          {/* Importance Star */}
          <ImportanceStar a={t} />

          {/* Button d'éditer */}
          {!t.editLabel && <Button 
            icon = {<FormOutlined />} 
            onClick={()=>{clickEditButton(t, taches)}}
            key={'EditButton: '+String(t.id)}
          />}

          {/* Delete Button */}
          <DeleteButton list={taches} a = {t}/>

          <br/><br/><br/>
          {!t.editLabel && <CalendarOutlined />}
          {!t.editLabel && t.deadline }

        </Space>
      ))}
    </Space>
  )
}
