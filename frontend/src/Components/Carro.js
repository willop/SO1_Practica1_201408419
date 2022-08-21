// comando componente funcional rafc
import React from 'react'
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2'
import { useState } from 'react';

export const Carro = (props) => {

  const [EditCar, setEditCar] = useState({
    Placa: props.Placa,
    Marca: props.Marca,
    Modelo: props.Modelo,
    Serie: props.Serie,
    Color: props.Color
  })

  const [Eliminado, setEliminado] = useState({
    Placa: props.Placa
  });

  const [TipoRetorno, setTipoRetorno] = useState(false)

  const handlenewCar = (evt) => {
    const value = evt.target.value;
    setEditCar({
      ...EditCar,
      [evt.target.name]: value
    });
    //console.log(EditCar)
    ////.log(datos.password)
  }


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


  const EditarCarro = async (event) => {
    EliminarCarro();
    console.log('Se envia la siguiente informacion de nuevo carro')
    console.log(EditCar)
    try {
      let configuracion = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(EditCar)
      }
      let respuesta = await fetch('http://localhost:4000/setauto', configuracion)
      //let respuesta = await fetch('http://18.208.114.136:5000/nuevousuario', configuracion)
      let json = await respuesta.json();
      //console.log('valor de la respuesta json')
      //console.log(json)
      if (json.Estado == false) {
        await Swal.fire({
          position: 'top-center',
          icon: 'error',
          title: 'No se ha podido editar carro',
          button: "Aceptar"
        })
      }
      else {
        await Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: 'Carro Editado correctamente',
          button: "Aceptar"
        })
        //window.location.href = "/";
      }
    } catch (error) {
    }

    setEditCar(!EditCar)
  }


  if(TipoRetorno){
    return (
      <tr>
        <td><Form><Form.Control name="Placa"  onChange={handlenewCar}/></Form></td>
        <td><Form><Form.Control name="Marca"  onChange={handlenewCar}/></Form></td>
        <td><Form><Form.Control name="Modelo"  onChange={handlenewCar}/></Form></td>
        <td><Form><Form.Control name="Serie"  onChange={handlenewCar}/></Form></td>
        <td><Form><Form.Control name="Color" onChange={handlenewCar}/></Form></td>
        <td><Button variant="warning" onClick={EditarCarro} >Confirmar</Button></td>
      </tr>
    )
  }else{
    return (
      <tr>
        <td>{props.Placa}</td>
        <td>{props.Marca}</td>
        <td>{props.Modelo}</td>
        <td>{props.Serie}</td>
        <td>{props.Color}</td>
        <td><Button onClick={() => setTipoRetorno(!TipoRetorno)} >Actualizar</Button></td>
        <td><Button variant="danger" onClick={EliminarCarro}>Eliminar</Button></td>
      </tr>
    )
  }
}
