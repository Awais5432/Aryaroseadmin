import React, { Component, Fragment } from 'react'
import Breadcrumb from '../../common/breadcrumb';
import Modal from 'react-responsive-modal';
import 'react-toastify/dist/ReactToastify.css';
import data from '../../../assets/data/category';
import Datatable from '../../common/datatable';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import ReactTable from "react-table";
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2'





export class Brand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      name: '',
      name_arabic: '',
      image: '',
      brand_data: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);

  }
  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    // this.setState({ name: event.target.value });
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  handleImageChange(e) {
    e.preventDefault();
    this.setState({
      image: e.target.files[0]
    })
  }

  async handleSubmit(e) {
    e.preventDefault();
    let data = new FormData();
    data.append('name', this.state.name);
    data.append('name_arabic', this.state.name_arabic);
    data.append('file', this.state.image);
    await axios.post('https://store.squarepakistan.com/public/api/addBrand', data,
      { crossdomain: true }
    )
      .then(function (response) {
        console.log(response)
        Swal.fire({
          title: 'Success',
          text: 'Brand Added',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(function () {
          axios.get('https://store.squarepakistan.com/public/api/Brands', { crossdomain: true })
            .then(function (response) {
              const brand_data = response.data.data;
              this.setState({ brand_data: brand_data });
              console.log(brand_data);
            }.bind(this))
        }.bind(this)
        );
      }.bind(this))
      .catch(function (error) {
        console.log(error)

      })
  }
  componentDidMount() {
    axios.get('https://store.squarepakistan.com/public/api/Brands', { crossdomain: true })
      .then(function (response) {
        const brand_data = response.data.data;
        this.setState({ brand_data: brand_data });
        console.log(brand_data);
      }.bind(this))
  }

  async removeBrand(id) {
    console.log(id);
    let data = new FormData();
    data.append('id', id);
    await Swal.fire({
      title: 'Error',
      text: 'Do You Really want to delete this?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonClass: "btn-danger",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false
    }
    ).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        axios.post('https://store.squarepakistan.com/public/api/' + id + '/deleteBrand', data)
          .then(function (response) {
            console.log(response);
            axios.get('https://store.squarepakistan.com/public/api/Brands', { crossdomain: true })
              .then(function (response) {
                const brand_data = response.data.data;
                this.setState({
                  brand_data: brand_data,
                });
                console.log(brand_data[0].id);

              }.bind(this))
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
        Swal.fire('Deleted!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Not Deleted', '', 'info')
      }
    })
  }

  render() {
    const columns = [{
      Header: <b>Image</b>,
      accessor: 'image',
      style: {
        textAlign: 'center'
      },
      Cell: props => (
        <img src={props.value} width={'50px'} />
      )
    }
      , {
      Header: <b>Name</b>,
      accessor: 'name',
      style: {
        textAlign: 'center'
      },
    }
      , {
      Header: <b>Name(Arabic)</b>,
      accessor: 'name_arabic',
      style: {
        textAlign: 'center'
      }
    }
      ,
    {
      Header: <b>Status</b>,
      accessor: 'status',
      style: {
        textAlign: 'center'
      },
      Cell: ({ cell }) => (
        <i className="fa fa-circle font-warning f-12" />
      )
    }
      , {
      Header: <b>Action</b>,
      id: 'delete',
      accessor: str => "delete",
      Cell: (row) => (
        <div>
          <span onClick={() => { this.removeBrand(row.original.id) }
            // onClick={() => {
            //   if (window.confirm('Are you sure you wish to delete this item?')) {
            //     let data = data;
            //     data.splice(row.index, 1);
            //     this.setState({ data: data });
            //   }
            //   toast.success("Successfully Deleted !")

            // }
          }>
            <i className="fa fa-trash" style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
            ></i>
          </span>

          <span><i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11, color: 'rgb(40, 167, 69)' }}></i></span>
        </div>
      ),
      style: {
        textAlign: 'center'
      },
      sortable: false
    },
    ]
    const { open } = this.state;
    return (
      <Fragment>
        <Breadcrumb title="Brand" parent="Physical" />
        {/* <!-- Container-fluid starts--> */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h5>Products Brand</h5>
                </div>
                <div className="card-body">
                  <div className="btn-popup pull-right">

                    <button type="button" className="btn btn-primary" onClick={this.onOpenModal} data-toggle="modal" data-original-title="test" data-target="#exampleModal">Add Brand</button>
                    <Modal open={open} onClose={this.onCloseModal} >
                      <form onSubmit={this.handleSubmit} enctype='multipart/form-data'>
                        <div className="modal-header">
                          <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add Brand</h5>
                        </div>
                        <div className="modal-body">

                          <div className="form-group">
                            <label htmlFor="recipient-name" className="col-form-label" >Brand Name :</label>
                            <input type="text" className="form-control" name="name" onChange={this.handleChange} />
                          </div>
                          <div className="form-group">
                            <label htmlFor="recipient-name" className="col-form-label" >Brand Name(Arabic) :</label>
                            <input type="text" className="form-control" name="name_arabic" onChange={this.handleChange} />
                          </div>
                          <div className="form-group">
                            <label htmlFor="message-text" className="col-form-label">Brand Image :</label>
                            <input className="form-control" id="validationCustom02" type="file" accept='image/*' onChange={this.handleImageChange} name="image" />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="submit" className="btn btn-primary" onClick={() => this.onCloseModal('VaryingMdo')}>Save</button>
                          <button type="button" className="btn btn-secondary" onClick={() => this.onCloseModal('VaryingMdo')}>Close</button>
                        </div>
                      </form>
                    </Modal>
                  </div>
                  <div className="clearfix"></div>
                  <div id="basicScenario" className="product-physical">
                    {/* <Datatable
                      multiSelectOption={false}
                      myData={data}
                      pageSize={10}
                      pagination={true}
                      class="-striped -highlight"
                    /> */}
                    <ReactTable
                      multiSelectOption={false}
                      data={this.state.brand_data}
                      columns={columns}
                      pageSize={10}
                      pagination={true}
                      class="-striped -highlight"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Container-fluid Ends--> */}
      </Fragment>
    )
  }
}

export default Brand

