// comando componente funcional rafc
import React from 'react'
import {Button} from 'react-bootstrap';
import Swal from 'sweetalert2'
import { useState } from 'react';

export const Carro = (props) => {

  
  const [Eliminado, setEliminado] = useState({
    Placa: props.Placa
  });

  const EliminarCarro = async (event) => {

    Eliminado.Placa = props.Placa
    console.log(JSON.stringify(Eliminado))
    try {
      let configuracion = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Eliminado)
      }
      let respuesta = await fetch('http://localhost:4000/deletecar', configuracion)
      //let respuesta = await fetch('http://18.208.114.136:5000/nuevousuario', configuracion)
      let json = await respuesta.json();
      //console.log('valor de la respuesta json')
      console.log(json)
      if (json.DeletedCount == 0) {
        await Swal.fire({
          position: 'top-center',
          icon: 'error',
          title: 'No se ha encontrado el carro a eliminar',
          button: "Aceptar"
        })
      }
      else {
        await Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: 'Carro eliminado correctamente',
          button: "Aceptar"
        })
        //window.location.href = "/";
      }
    } catch (error) {
    }
  }


  return (
    <tr>
          <td>{props.Placa}</td>
          <td>{props.marca}</td>
          <td>{props.modelo}</td>
          <td>{props.serie}</td>
          <td>{props.color}</td>
          <td><Button >Actualizar</Button></td>
          <td><Button onClick={EliminarCarro}>Eliminar</Button></td>
    </tr>
  )
}
