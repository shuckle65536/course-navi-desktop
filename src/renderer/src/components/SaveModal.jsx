import { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

function SaveModal({ show, onHide, onSave }) {
  const [tableName, setTableName] = useState('');
  const [meta, setMeta] = useState('');

  const handleSave = () => {
    if (tableName !== '') {
      onSave(tableName, meta);
      setTableName('');
      onHide();
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title><h4>現在の時間割を保存</h4></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ol>
              <li>保存した時間割は「読み込み」ボタンから読み込めます</li>
              <li>既に使用されている名前で保存すると、データが上書きされます</li>
            </ol>
            <Form.Group className='mb-3'>
              <Form.Label>保存名を入力:</Form.Label>
              <Form.Control
                type='text'
                placeholder='（必須）'
                value={tableName}
                onChange={e => setTableName(e.target.value)}
                autoFocus
              />
            </Form.Group>

            <Form.Group className=''>
              <Form.Label>メモを追加:</Form.Label>
              <Form.Control
                type='text'
                placeholder=''
                value={meta}
                onChange={e => setMeta(e.target.value)}
              />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' type='submit'>
              保存
            </Button>
            <Button variant='secondary' onClick={onHide}>
              キャンセル
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default SaveModal;