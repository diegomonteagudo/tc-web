import "./styles.css";
import { FormOutlined } from '@ant-design/icons';
import { Button, Checkbox, Space } from 'antd';

export default function TacheList({
  taches, tachesFini, 
  Class, 
  onMoveTache, 
  afficherLabels, 
  clickEditButton, 
  onEditTache, 
  DeleteButton
}){

  return(
    <Space direction="vertical">
      {taches.map(t => (
        <Space>
          <Checkbox
            checked={Class==='TacheFini'?true:false}
            className={Class}
            key={t.id} 
            onClick={()=>{onMoveTache(taches, tachesFini, t)}}
          >
            {!t.editLabel && t.content}
          </Checkbox>

          {/* afficher les labels */}
          {!t.editLabel && afficherLabels({t})}

          {/* button pour éditer */}
          {!t.editLabel && <Button 
            icon = {<FormOutlined />} 
            onClick={()=>{clickEditButton(t, taches)}}/>}

          {/* input pendant l'édition le tache */}
          {t.editLabel && <input
            placeholder="Edit your TACHE here!"
            className = "EditInput"
            value={t.content}
            onChange = {e => {onEditTache( taches, {...t, content:e.target.value} )}}/>}

          {/* input pendant l'édition le label */}
          {t.editLabel && <input
            placeholder="Edit your LABEL here!"
            className = "EditInput"
            value={t.label.join(',')}
            onChange = {e => {onEditTache( taches, {...t, label:e.target.value.split(',')} )}}/>}

          {/* button de la confirmation */}
          {t.editLabel && <Button 
            onClick = {() => {onEditTache( taches, {...t, editLabel:false} )}}>Confirm</Button>}

          <DeleteButton list={taches} a = {t}/>
        </Space>
      ))}
    </Space>
  )
}