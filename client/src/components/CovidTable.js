import React from "react";
import Table from "react-bootstrap/Table";
const CovidTable = props => {
    const {covidData} = props;
  const createRows = covidData => {
    return covidData.map(data => {
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
       {createRows(covidData)}
      </tbody>
    </Table>
  );
};

export default CovidTable;
