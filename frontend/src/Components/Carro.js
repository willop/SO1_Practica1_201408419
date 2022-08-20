// comando componente funcional rafc
import React from 'react'

export const Carro = (props) => {
  return (
    <tr>
          <td>{props.placa}</td>
          <td>{props.marca}</td>
          <td>{props.modelo}</td>
          <td>{props.serie}</td>
          <td>{props.color}</td>
    </tr>
  )
}
