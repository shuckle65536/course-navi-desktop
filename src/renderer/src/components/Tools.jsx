import { Button } from 'react-bootstrap';

function Tools({ selectedCell, unregister }) {
  if (selectedCell.day === null || selectedCell.period === null) {
    return (
      <></>
    );
  }

  return (
    <>
      <Button
        variant='danger'
        onClick={() => unregister(selectedCell)}
      >
        授業削除
      </Button>
    </>
  )

}

export default Tools;