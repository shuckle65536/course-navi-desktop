// 表示を1コマずつ、2コマずつどちらにするか要検討

import { useState, useEffect } from 'react';
import { Table, Button, Card } from 'react-bootstrap';

const days = ['月', '火', '水', '木', '金'];

/**
 * CourseList
 * ユーザが選択した曜日・時限の開講授業を一覧表示するコンポーネント
 *
 * @param {{ day: number|null, period: number|null }} currentCell
 *   - 参照先の時間割枠を示すオブジェクト
 *   - day: 0~4 の曜日 (null → 未選択)
 *   - period: 1~12 の時限 (null → 未選択)
 * @param {(courseData: object) => void} register
 *   - 授業登録用のコールバック
 * @returns {JSX.Element|null}
 */
function CourseList({ currentCell, register, highlightCell }) {
  const { day, period } = currentCell;
  // {各教科: [科目1, 科目2, ...]} の形式
  // 配列の各値は courseData(オブジェクト形式の授業情報)
  const [courseList, setCourseList] = useState({});

  // 参照先が変わるたびサーバからデータ取得
  useEffect(() => {
    if (day === null || period === null) return;
    const fetchData = async () => {
      const newList = await window.api.fetchCourseList(day, period);
      setCourseList(newList);
    };
    fetchData();
  }, [day, period]);

  // ガード節
  if (day === null || period === null) {
    return (
      <>
        <h5>開講授業一覧</h5>
        <Card body className='text-center text-muted'>
          時間割のセルをすると、その時間に履修できる授業が表示されます。
        </Card>
      </>
    );
  }

  return (
    <div>
      <h5>{`${days[day]}曜${period}限:`}</h5>
      <div className='CourseList'>
        <Table hover size='sm' className='mt-2 align-middle'>
          <tbody>
            {Object.entries(courseList).map(([subject, courses]) => (
              <tr key={subject}>
                <th scope='row' style={{ width: '120px' }}>{subject}</th>
                <td>
                  <div className='d-flex flex-wrap'>
                    {courses.map((data) => {
                      const courseData = data[0];
                      // abbr(略称) + class(カタカナ記号) を表示
                      const courseName = courseData.abbr + courseData.class;
                      let info = '';

                      if (courseData.credits === 1) {
                        // 2コマごとの表示のため、1単位科目のみ時限を記載
                        // DB上の時限は16進数 → 基数変換して表示
                        info = `(${courseData.period}限)`;
                      } else if (courseData.credits >= 4) {
                        info = `(${data.map(d => days[d.day]).join(', ')})`;
                      }

                      return (
                        <Button
                          key={courseData.id}
                          variant='outline-dark'
                          size='sm'
                          className='me-2 mb-1'
                          onClick={() => { register(currentCell, data) }}
                          onMouseOver={() => highlightCell(data)}
                          onMouseOut={() => highlightCell(null)}
                        >
                          {courseName}
                          <small className='ms-1'>{info}</small>
                        </Button>);
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default CourseList;