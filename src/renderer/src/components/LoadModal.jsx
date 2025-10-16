import { useState, useEffect } from 'react';
import { ListGroup, Button, ButtonGroup, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsXLg } from 'react-icons/bs';
import ConfirmModal from './ConfirmModal';

// 名前の変更機能があってもいいかも

function LoadModal({ show, onHide, saveSlots, loadTimetable, deleteSaveData }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [nameToDelete, setNameToDelete] = useState(null);

  const onLoad = (saveData) => {
    loadTimetable(saveData);
    onHide();
  };

  const onDelete = (name) => {
    setNameToDelete(name);
    setConfirmMessage(`${name} を削除しますか？`);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    deleteSaveData(nameToDelete);
    setShowConfirm(false);
    setNameToDelete(null);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title><h4>保存した時間割を読み込む</h4></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {Object.entries(saveSlots).map(([name, saveData]) => (
              <ListGroup.Item key={name} className='d-flex justify-content-between align-items-center'>
                <div>
                  <strong>{name}</strong>
                  <div className='text-muted small'>{saveData.meta}</div>
                </div>
                <ButtonGroup>
                  <Button variant='outline-primary' size='sm' onClick={() => onLoad(saveData)}>読み込む</Button>
                  <OverlayTrigger placement='top' overlay={<Tooltip>削除</Tooltip>}>
                    <Button variant='outline-danger' size='sm' onClick={() => onDelete(name)}>
                      <BsXLg />
                    </Button>
                  </OverlayTrigger>
                </ButtonGroup>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
      <ConfirmModal
        message={confirmMessage}
        show={showConfirm}
        onHide={() => {
          setShowConfirm(false);
          setNameToDelete(null);
          setConfirmMessage('');
        }}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default LoadModal;