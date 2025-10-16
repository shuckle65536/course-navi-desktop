import { Button, Modal } from 'react-bootstrap';

// 「今後表示しない」のチェックボックスがあってもいいかも
// 親に渡すことになる

function ConfirmModal({ message, show, onHide, onConfirm }) {
  return (
    <Modal show={show} onHide={onHide} backdrop='static'>
      <Modal.Body>
        {message}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          キャンセル
        </Button>
        <Button variant='primary' onClick={onConfirm} autoFocus>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;