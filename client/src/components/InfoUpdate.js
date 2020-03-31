import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const InfoUpdate = props => {
  const { info } = props;
  const getCurrentDT = () => {
    var currentdate = new Date();
    var datetime =
      "Last Sync: " +
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

    return datetime;
  };

  const createList = info => {
    return info.map(data => {
      const { state, isConfirmed, isDead, isRecovered } = data;
      let infoMessage = `${state} : `;
      if (isDead > 0) infoMessage += `${isDead} new dead. `;
      if (isConfirmed > 0) infoMessage += `${isConfirmed} new confirmed. `;
      if (isRecovered > 0) infoMessage += `${isRecovered} new recovered.`;
      return <ListGroup.Item variant="dark">{infoMessage}</ListGroup.Item>;
    });
  };

  return (
    <Container className="info-updtaes" fluid>
      <ListGroup variant="dark">
       { (info && info.length>0) && <ListGroup.Item className="info-updtaes dark-theme" variant="dark">
          {getCurrentDT()}
        </ListGroup.Item>
        }
        {createList(info)}
      </ListGroup>
    </Container>
  );
};

export default InfoUpdate;
