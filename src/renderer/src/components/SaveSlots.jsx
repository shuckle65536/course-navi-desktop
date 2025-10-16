import { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import SaveModal from './SaveModal';
import LoadModal from './LoadModal';

function SaveSlots({ saveSlots, saveTimetable, loadTimetable, deleteSaveData }) {
  const [showSave, setShowSave] = useState(false);
  const [showLoad, setShowLoad] = useState(false);

  return (
    <>
      <ButtonGroup size='sm'>
        <Button variant='outline-dark' onClick={() => setShowSave(true)}>保存</Button>
        <Button variant='outline-dark' onClick={() => setShowLoad(true)}>読み込み</Button>
      </ButtonGroup>
      <SaveModal show={showSave} onHide={() => setShowSave(false)} onSave={(name, meta) => saveTimetable(name, meta)} />
      <LoadModal show={showLoad} onHide={() => setShowLoad(false)} saveSlots={saveSlots} loadTimetable={loadTimetable} deleteSaveData={deleteSaveData} />
    </>
  );
}

export default SaveSlots;