import "../styles.css";
import { theme, Collapse } from 'antd';
import TacheList from './TacheList.js'

const { Panel } = Collapse;

export default function MyCollapse({
  taches, tachesFini, 
  onMoveTache,
  afficherLabels, 
  // ImportanceStar, 
  onImportance, 
  clickEditButton, 
  onEditTache,  
  DeleteButton, 
  SortOption, Sort,

}){

  const { token } = theme.useToken();
  const panelStyle = {
    background: "#f5f1f1fa",
    borderRadius: token.borderRadiusLG,
  }

  return(
    <Collapse defaultActiveKey={['1']}>
      {/*panel pour "Things to do" */}
      <Panel header="Things to do: " key="1" style={panelStyle}>
        <TacheList 
          taches={taches}
          tachesFini={tachesFini}
          onMoveTache={onMoveTache}
          afficherLabels={afficherLabels}
          onImportance={onImportance}
          clickEditButton={clickEditButton}
          onEditTache={onEditTache}
          DeleteButton={DeleteButton}
          SortOption={SortOption}
          Sort={Sort}
        />
      </Panel>

      {/*panel pour "Things have been done" */}
      <Panel header="Things have been done:" key="2" style={panelStyle}>
        <TacheList 
          taches={tachesFini}
          tachesFini={taches}
          Class={'TacheFini'}
          onMoveTache={onMoveTache}
          afficherLabels={afficherLabels}
          onImportance={onImportance}
          clickEditButton={clickEditButton}
          onEditTache={onEditTache}
          DeleteButton={DeleteButton}
          SortOption={SortOption}
          Sort={Sort}
        />
      </Panel>
    </Collapse>
  )
}