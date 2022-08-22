import './App.css';
import './Components/Carro'
import { useState, UseEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, Button, NavDropdown, Table, Form } from 'react-bootstrap';
import { Carro } from './Components/Carro';
import Swal from 'sweetalert2'

function App() {
  //Variables
  const [filtro, setfiltro] = useState({
    Tipofiltro: "color",
    Filtro: "Blue"
  });
  const [showForm, setShowForm] = useState(false);
  const [newCar, setNewCarr] = useState({
    Placa: '',
    Marca: '',
    Modelo: '',
    Serie: '',
    Color: ''
  })
  

  const [data, setData] = useState(
    [
      {
        "_id": "dafsdfasd",
        "placa": "P513asd",
        "marca": "Nissan",
        "modelo": "2",
        "serie": "f05450210",
        "color": "Negro"
      },
      {
        "_id": "dafsdfahhggsd",
        "placa": "P3215dds",
        "marca": "Mit",
        "modelo": "Lancer",
        "serie": "f51612158",
        "color": "Azul"
      },
      {
        "_id": "dafsdfasasdd",
        "placa": "P151sdf",
        "marca": "Mercedez",
        "modelo": "amg",
        "serie": "M2151351",
        "color": "Verde"
      }
    ]
  );


  //metodos

  //-------------------------------------   API READ --------------------------------------------
  const Reader = require = async (event) => {
    console.log("entorno: backend/read")
    try {
      let configuracion = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
      
      let respuesta = await fetch('http://backend/read', configuracion)
      //let respuesta = await fetch('http://18.208.114.136:5000/editaralbum', configuracion)
      let json = await respuesta.json();
      console.log('valor de la respuesta json READ')
      console.log(json)
      //console.log("mostrando el vector de respuesta:\n", json.respuesta)
      setData(json)

      console.log("Imprimiendo la var data")
      console.log(data)
      //console.log("Mostrando los albumes almacenados",albumes)
    } catch (error) {
    }
  };

  //-------------------------------------   API NUEVO CARRO --------------------------------------------
  const CrearCarro = async (event) => {
    console.log('Se envia la siguiente informacion de nuevo carro')
    console.log(newCar)
    try {
      let configuracion = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCar)
      }
      let respuesta = await fetch('http://backend/setauto', configuracion)
      //let respuesta = await fetch('http://18.208.114.136:5000/nuevousuario', configuracion)
      let json = await respuesta.json();
      //console.log('valor de la respuesta json')
      //console.log(json)
      if (json.Estado == false) {
        await Swal.fire({
          position: 'top-center',
          icon: 'error',
          title: 'No se ha podido agregar el nuevo carro',
          button: "Aceptar"
        })
      }
      else {
        await Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: 'Carro insertado correctamente',
          button: "Aceptar"
        })
        //window.location.href = "/";
      }
    } catch (error) {
    }
  }

  //-------------------------------------   API FILTRO CARRO --------------------------------------------
  const FiltrarCarro = async (event) => {
    console.log('Se envia la info para filtrar')
    console.log(filtro)
    try {
      let configuracion = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filtro)
      }
      //process.env.REACT_APP_BACK
      let respuesta = await fetch('backend/filter', configuracion)
      //let respuesta = await fetch('http://18.208.114.136:5000/nuevousuario', configuracion)
      let json = await respuesta.json();
      //console.log('valor de la respuesta json')
      //console.log(json)
      setData(json)

      console.log("Imprimiendo la var data")
      console.log(data)
    } catch (error) {
    }
  }





  //actualizar los valores de las variables
  const handleuserchange = (evt) => {
    const value = evt.target.value;
    setNewCarr({
      ...newCar,
      [evt.target.name]: value
    });
    //console.log(newCar)
    ////.log(datos.password)
  }

  //actualizar valor filtro
  const handlenamesearch = (event) =>{
    filtro.Filtro = event.target.value
  }

  //actualizar los valores de las variables
  const handlenamechange = (evt) => {
    filtro.Tipofiltro = evt.target.name;
  };

  const GetInfoRow = (evt) => {
    console.log("Se hizo click en:" + evt.target.name)
  }

  return (
    <div className="App">
      <div id="BarraNavegacion">
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">
              Virtualizacion
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link onClick={() => setShowForm(!showForm)}>Create</Nav.Link>
              <Nav.Link onClick={Reader}>Read</Nav.Link>
            </Nav>
            <Nav >
              <NavDropdown title={filtro.Tipofiltro} text={filtro.Tipofiltro} id="collasible-nav-dropdown">
                <NavDropdown.Item name="marca" onClick={handlenamechange}>Marca</NavDropdown.Item>
                <NavDropdown.Item name="modelo" onClick={handlenamechange}>Modelo</NavDropdown.Item>
                <NavDropdown.Item name="color" onClick={handlenamechange}>Color</NavDropdown.Item>
              </NavDropdown>

            </Nav>
            <Form className="d-flex">
              <Form.Control
                name="Filtro"
                placeholder="Filtro"
                className="me-2"
                onChange={handlenamesearch}
              />
              <Button variant="outline-primary" onClick={FiltrarCarro}>Filtrar</Button>
            </Form>
          </Container>
        </Navbar>
      </div>
      <div id="Cuerpo">

        {showForm && (
          <div id="Formulario">
            <br />
            <Form >
              <Form.Group className="mb-3">
                <Form.Label>Ingrese placa</Form.Label>
                <Form.Control type="text" name="Placa" onChange={handleuserchange} placeholder="Ingrese la placa" />

                <Form.Label>Ingrese marca</Form.Label>
                <Form.Control type="text" name="Marca" onChange={handleuserchange} placeholder="Ingrese marca" />

                <Form.Label>Ingrese modelo</Form.Label>
                <Form.Control type="text" name="Modelo" onChange={handleuserchange} placeholder="Ingrese modelo" />

                <Form.Label>Ingrese serie</Form.Label>
                <Form.Control type="text" name="Serie" onChange={handleuserchange} placeholder="Ingrese serie" />

                <Form.Label>Ingrese color</Form.Label>
                <Form.Control type="text" name="Color" onChange={handleuserchange} placeholder="Ingrese color" />
              </Form.Group>
              <center>
                <Button variant="success" onClick={CrearCarro}>
                  Crear
                </Button>
              </center>
            </Form>
          </div>
        )
        }
        <div id="Mostrar">
          <br />
          <br />
          <center><h2>Base de Datos</h2></center>
          <br />
          <Table striped bordered hover size="sm" onClick={GetInfoRow}>
            <thead id="cabeza_datos">
              <tr>
                <th>Placa</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Serie</th>
                <th>Color</th>
                <th>Actualizar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {data.map((carro) => {
                return (
                  <Carro Placa={carro.placa} Marca={carro.marca} Modelo={carro.modelo} Serie={carro.serie} Color={carro.color} key={carro._id} />
                )
              })
              }
            </tbody>
          </Table>
        </div>
      </div>

    </div>
  );
}

export default App;
