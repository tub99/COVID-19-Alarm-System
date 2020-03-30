import React from "react";
import Table from "react-bootstrap/Table";
const DeltaTable = props => {
    const {delta} = props;
  const createRows = delta => {
    return delta.map(data => {
      const { state, confirmed, deaths, recovered } = data;
      return (
        <tr>
          <td>{state}</td>
          <td>{confirmed}</td>
          <td>{deaths}</td>
          <td>{recovered}</td>
        </tr>
      );
    });
  };
  return (
    <Table striped bordered hover responsive variant="dark">
      <thead>
        <tr>
          <th>State</th>
          <th>Confirmed</th>
          <th>Deaths</th>
          <th>Recovered</th>
        </tr>
      </thead>
      <tbody>
       {createRows(delta)}
      </tbody>
    </Table>
  );
};

export default DeltaTable;
