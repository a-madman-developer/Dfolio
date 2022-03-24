import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import moment from "moment";
// import * as Api from "../../api";
import * as Api from "../../api";

function CommentCard({ comment, isEditable, setIsEditing, setComments }) {
  const handleDelete = async (e) => {
    //  페이지가 리프레쉬 되는 고유의 브라우저 동작을 preventDefault()로 막아줌
    e.preventDefault();
    // 부모 엘리먼트에게 이벤트 전달을 중단해야 할 때 쓰이는 함수
    e.stopPropagation();

    const userId = comment.userId;

    // Comment.id로 조회하여 데이터 삭제
    await Api.delete(`Comments/${comment.id}`);

    // "Commentlist/:userId" 엔드포인트로 GET 요청함.
    const res = await Api.get("commentlist", userId);
    //comments를 response의 data로 세팅함.
    setComments(res.data);
    // 편집 과정이 끝났으므로, isEditing을 false로 세팅함.
    setIsEditing(false);
  };

  return (
    <Card.Body>
      <Row className="align-items-center">
        <Col>
          <span>{comment.title}</span>
          <br />
          <span className="text-muted">{comment.description}</span>
          <br />
          <span>{moment(comment.whenDate).format("YYYY-MM-DD")}</span>
        </Col>
        {isEditable && (
          <Col xs lg="1">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleDelete}
              className="mr-3"
            >
              Delete
            </Button>
          </Col>
        )}
      </Row>
    </Card.Body>
  );
}

export default CommentCard;
