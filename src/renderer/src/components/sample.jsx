function sample({ }) {
  return (
    <Card>
      <Card.Body>
        新 宿 山 吹 我らが母校<br />
        心豊かに 情熱若く<br />
        生きるこの日を いまたいせつに<br />
        あしたを支える ゆるがぬ自信<br />
        流れ悠久 歴史のしるべ
      </Card.Body>
      <Card.Img variant="bottom" src={jpg} className="img-fluid" />
      <Card.Footer className="d-flex align-items-center bg-light">
        <HiUserGroup
          size={20}
          color="#1d9bf0"
          className="me-2"
          style={{ verticalAlign: 'middle' }}
        />
        <span className="flex-grow-1 fw-bold">
          提案されたコミュニティノートを評価する
        </span>
        <BsArrowRightShort
          size={20}
          color="#536471"
          className="ms-2"
          style={{ verticalAlign: 'middle' }}
        />
      </Card.Footer>
    </Card>
  );
}

export default sample;