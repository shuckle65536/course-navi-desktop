import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap/';
import SaveSlots from './components/SaveSlots';
import Timetable from './components/Timetable';
import Tools from './components/Tools';
import CourseList from './components/CourseList';

function App() {
  // 時間割の表示・選択用
  const [timetable, setTimetable] = useState(
    Array.from({ length: 12 }, () => Array.from({ length: 5 }, () => ''))
  );

  const [selectedCell, setSelectedCell] = useState({ day: null, period: null });

  const onSelect = (cell) => {
    if (JSON.stringify(cell) === JSON.stringify(selectedCell)) {
      setSelectedCell({ day: null, period: null });
      return;
    }
    setSelectedCell(cell);
  };

  // 授業登録用
  const register = (currentCell, data) => {
    let newTable = structuredClone(timetable);

    data.forEach((courseData) => {
      const day = courseData.day;
      const period = courseData.period;
      const courseToDelete = timetable[period[0] - 1][day];

      if (courseToDelete?.id === courseData.id) return;
      newTable = deleteCourse(newTable, courseToDelete);

      setSelectedCell({ day: currentCell.day, period: period });

      period.forEach((p) => {
        const colIdx = p - 1;
        newTable[colIdx][day] = courseData;
      });
    });
    setTimetable(newTable);
  };

  // 授業削除用
  const deleteCourse = (table, courseData) => {
    const newTable = structuredClone(table);

    if (!courseData) return newTable;

    courseData.period.forEach((p) => {
      const colIdx = p - 1;
      newTable[colIdx] = newTable[colIdx].map((cell) =>
        cell?.id === courseData.id ? '' : cell
      );
    });

    return newTable;
  };

  const unregister = (currentCell) => {
    const day = currentCell.day;
    if (day === null) return;
    const period = currentCell.period[0];

    const courseToDelete = timetable[period - 1][day];
    const newTable = deleteCourse(timetable, courseToDelete);

    setSelectedCell({ day: day, period: [period] });
    setTimetable(newTable);
  };

  // 時間割の save/load 用
  const [saveSlots, setSaveSlots] = useState(() => {
    const jsonStr = localStorage.getItem('saveSlots');
    return jsonStr ? JSON.parse(jsonStr) : {};
  });

  const saveTimetable = (name, meta) => {
    setSaveSlots(prev => {
      const newSlots = {
        ...prev,
        [name]: {
          timetable: structuredClone(timetable),
          meta: `メモ: ${meta || 'なし'}`
        }
      };
      localStorage.setItem('saveSlots', JSON.stringify(newSlots));
      return newSlots;
    });
  };

  const loadTimetable = (saveData) => {
    const newTable = structuredClone(saveData.timetable);

    setSelectedCell({ day: null, period: null });
    setTimetable(newTable);
  };

  const deleteSaveData = (name) => {
    setSaveSlots(prev => {
      const { [name]: _, ...newSlots } = prev;
      localStorage.setItem('saveSlots', JSON.stringify(newSlots));
      return newSlots;
    });
  };

  // セルの強調表示
  const [highlightedCell, setHighlightedCell] = useState(null);
  const highlightCell = (data) => {
    if (!data) {
      setHighlightedCell(null);
      return;
    }
    const day = data.map(d => d.day);
    setHighlightedCell({ day: day, period: data[0].period });
  };

  //document.body.setAttribute("data-bs-theme", "dark")
  return (
    <Container fluid className='mx-2'>
      <Row className='my-4'>
        <Col>
          <SaveSlots
            saveSlots={saveSlots}
            saveTimetable={saveTimetable}
            loadTimetable={loadTimetable}
            deleteSaveData={deleteSaveData}
          />
        </Col>
      </Row>
      <Row>
        <Col md={7}>
          <Timetable timetable={timetable} selectedCell={selectedCell} highlightedCell={highlightedCell} onSelect={onSelect} />
        </Col>
        <Col md={5}>
          <CourseList currentCell={selectedCell} register={register} highlightCell={highlightCell} />
          <Tools selectedCell={selectedCell} unregister={unregister} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;