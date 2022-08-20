import './App.css';
import './Components/Carro'
import { useState, UseEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, Button, NavDropdown, Form, Table } from 'react-bootstrap';
import { Carro } from './Components/Carro';

function App() {
  //Variables
  const [filtro, setfiltro] = useState("Seleccionar filtro");
  const [showForm, setShowForm] = useState(false);
  const [newCar, setNewCarr] = useState({
    placa: '',
    marca: '',
    modelo: '',
    serie: '',
    color: ''
  })
  const [data, setData]= useState(
    [
      {
        "placa" : "P513asd",
        "marca" : "Nissan",
        "modelo": "2",
        "serie" : "f05450210",
        "color" : "Negro"
      },
      {
        "placa" : "P3215dds",
        "marca" : "Mit",
        "modelo": "Lancer",
        "serie" : "f51612158",
        "color" : "Azul"
      },
      {
        "placa" : "P151sdf",
        "marca" : "Mercedez",
        "modelo": "amg",
        "serie" : "M2151351",
        "color" : "Verde"
      }
    ]
    );


  //metodos

  //actualizar los valores de las variables
  const handleuserchange = (evt) =>{
    const value = evt.target.value;
  setNewCarr({
    ...newCar,
    [evt.target.name]: value
  });
    //console.log(newCar)
    ////.log(datos.password)
  }

  //Actualizar valor del filtro
  const filtrar = (event) =>{
    console.log(filtro)
    setfiltro(filtro)
  }

  
  //actualizar los valores de las variables
  const handlenamechange = (evt) =>{
    setfiltro(evt.target.name);
    //console.log(evt.target.name)
  };

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
              <Nav.Link >Read</Nav.Link>
            </Nav>
            <Nav >
              <NavDropdown title={filtro} text ={filtro} id="collasible-nav-dropdown">
                <NavDropdown.Item name = "marca" onClick={handlenamechange}>Marca</NavDropdown.Item>
                <NavDropdown.Item name = "modelo" onClick={handlenamechange}>Modelo</NavDropdown.Item>
                <NavDropdown.Item name = "color" onClick={handlenamechange}>Color</NavDropdown.Item>
              </NavDropdown>
              <Button variant="outline-primary" onClick={filtrar}>Filtrar</Button>
            </Nav>
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
                <Form.Control type="text" name="placa" onChange={handleuserchange} placeholder="Ingrese la placa" />

                <Form.Label>Ingrese marca</Form.Label>
                <Form.Control type="text" name="marca" onChange={handleuserchange} placeholder="Ingrese marca" />

                <Form.Label>Ingrese modelo</Form.Label>
                <Form.Control type="text" name="modelo" onChange={handleuserchange} placeholder="Ingrese modelo" />

                <Form.Label>Ingrese serie</Form.Label>
                <Form.Control type="text" name="serie" onChange={handleuserchange} placeholder="Ingrese serie" />

                <Form.Label>Ingrese color</Form.Label>
                <Form.Control type="text" name="color" onChange={handleuserchange} placeholder="Ingrese color" />
              </Form.Group>
              <center>
                <Button variant="success" type="submit">
                  Crear
                </Button>
              </center>
            </Form>
          </div>
        )
        }
        <div id="Mostrar">
          <br/>
          <br/>
          <center><h2>Base de Datos</h2></center>
          <br/>
          <Table striped bordered hover size="sm">
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
              {data.map((carro)=>{
                return(
                  <Carro placa={carro.placa} marca={carro.marca} modelo={carro.modelo} serie={carro.serie} color={carro.color} key={carro.serie}/>
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
