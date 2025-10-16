import { Table } from 'react-bootstrap';

const days = ['月', '火', '水', '木', '金'];

const isMatch = (day, period, targetCell) => {
  if (Array.isArray(targetCell?.day)) {
    return targetCell.day.includes(day) && targetCell.period.includes(period);
  } else {
    return targetCell?.day === day && targetCell?.period.includes(period);
  }
};

/**
 * Timetable
 * 時間割データをテーブル表示するコンポーネント
 * 
 * @param {number[][]} timetable
 *   - 時間割データを保持する二次元配列
 *   - 各値は courseData(オブジェクト形式の授業情報)
 * @param {{ day: number, period: number[] }} selectedCell
 *   - day: 選択中の曜日 0~4
 *   - period: 選択中の時限配列 (コマ数に応じた要素数) 1~12
 * @param {(cell: { day: number, period: number[] }) => void} onSelect
 *   - 選択(セルクリック)用のコールバック
 *   - 時間割枠を示す { day, period } のオブジェクトを渡す
 *
 * @returns {JSX.Element}
 */
function Timetable({ timetable, selectedCell, highlightedCell, onSelect }) {
  let totalCredits = 0;
  let countedIds = new Set();
  timetable.forEach(row => {
    row.forEach(cell => {
      if (cell.id && !countedIds.has(cell.id)) {
        countedIds.add(cell.id);
        totalCredits += cell.credits;
      }
    })
  });
  return (
    <div className="Timetable container">
      <div className='row'>
        <h5 className='col-2'>時間割</h5>
        <h5 className="col-8"></h5>
        <h5 className="col-2">単位数:{totalCredits}</h5>
      </div>
      <Table bordered responsive="sm" className="text-center align-middle">
        <thead>
          <tr>
            <th></th>
            {days.map((day, idx) => (
              <th key={idx}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timetable.map((row, rowIdx) => {
            const period = rowIdx + 1;
            return (
              <tr key={period}>
                <th>{period}限</th>
                {row.map((cell, day) => {
                  const cellValue = (cell?.abbr + cell?.class) || '';
                  let classList = [];
                  classList.push(isMatch(day, period, selectedCell) ? 'selectedCell' : '');
                  classList.push(isMatch(day, period, highlightedCell) ? 'highlightedCell' : '')

                  // 偶数行(上のセル)の場合
                  if (rowIdx % 2 === 0) {
                    const nextCell = timetable[rowIdx + 1][day];
                    const nextPeriod = period + 1;
                    const isSame = nextCell && cell?.id === nextCell?.id;

                    return (
                      <td
                        key={day}
                        rowSpan={isSame ? 2 : 1}
                        className={classList.join(' ')}
                        style={isSame ? { borderBottom: '2px solid #888' } : {}}
                        onClick={() => onSelect({ day: day, period: isSame ? [period, nextPeriod] : [period] })}
                      >
                        {cellValue}
                      </td>
                    );
                  }

                  // 奇数行(下のセル)の場合
                  const prevCell = timetable[rowIdx - 1][day];
                  const isSame = prevCell && cell?.id === prevCell?.id;
                  if (isSame) return null;

                  return (
                    <td
                      key={day}
                      className={classList.join(' ')}
                      onClick={() => onSelect({ day: day, period: [period] })}
                    >
                      {cellValue}
                    </td>
                  );
                })}
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default Timetable;