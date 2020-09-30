import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const url = "http://localhost:3000/";

class App extends Component {
  state = {
    data: [],
    modalInsert: false,
    modalDelete: false,
    form:{
      id: '',
      name: ''
    },
    typeModal: ''
  };

  requestGet = () => {
    axios.get(url + "types").then((response) => {
      this.setState({ data: response.data.Types });
    }).catch(error => {
      console.log(error.message);
    });
  }

  requestPost = async () => {
    delete this.state.form.id;
    await axios.post(url + 'type/' + this.state.form.name).then(response => {
      this.modalInsert();
      this.requestGet();
    }).catch(error => {
      console.log(error.message);
    });
  }

  requestPut = async () => {
    axios.put(url + 'update_type/' + this.state.form.id, this.state.form).then(response => {
      this.modalInsert();
      this.requestGet();
    }).catch(error => {
      console.log(error.message);
    });
  }

  requestDelete = async () => {
    axios.delete(url + 'type/' + this.state.form.name).then(response => {
      this.setState({modalDelete: false});
      this.requestGet();
    })
  }

  selectType = type => {
    this.setState({
      typeModal: 'Update',
      form: {
        id: type.id,
        name: type.name
      }
    })
  }

  componentDidMount() {
    this.requestGet();
  }

  modalInsert = () => {
    this.setState({ modalInsert: !this.state.modalInsert });
  };

  handleChange = async e => {
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <br />
        <button className="btn btn-primary" onClick={() => {this.setState({form: null, typeModal: 'Insert'}); this.modalInsert()}}>
          Agregar tipo
        </button>
        <br />
        <br />
        <table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((type) => {
              return (
                <tr>
                  <td>{type.id}</td>
                  <td>{type.name}</td>
                  <td>
                    <button className="btn btn-primary"
                      onClick={() => {this.selectType(type); this.modalInsert()}}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    {"  "}
                    <button className="btn btn-danger"
                    onClick={() => {this.selectType(type); this.setState({modalDelete: true})}}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalInsert}>
          <ModalHeader style={{ display: "block" }}>
            <span style={{ float: "right" }}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">Id</label>
              <input
                className="form-control"
                type="text"
                name="id"
                id="id"
                readOnly
                onChange={this.handleChange}
                value={form ? form.id : this.state.data.length + 2}
              />
              <br />
              <label htmlFor="name">Nombre</label>
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                onChange={this.handleChange}
                value={form ? form.name : ''}
              />
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            {this.state.typeModal === 'Insert' ?
            <button className="btn btn-primary" onClick={() => this.requestPost()}>Insertar</button>
            :<button className="btn btn-primary" onClick={() => this.requestPut()}>Actualizar</button>}
            <button
              className="btn btn-danger"
              onClick={() => this.modalInsert()}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalDelete}>
        <ModalBody>
          ¿Estás seguro que deseas eliminar {form && form.name}?
        </ModalBody>
        <ModalFooter>
        <button className="btn btn-danger" onClick={() => this.requestDelete()}>Si</button>
        <button className="btn btn-secundary" onClick={() => this.setState({modalDelete: false})}>No</button>

        </ModalFooter>
      </Modal>
      </div>
    );
  }
}

export default App;
