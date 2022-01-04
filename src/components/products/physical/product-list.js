import React, { Component, Fragment } from 'react'
import Breadcrumb from '../../common/breadcrumb';
import data from '../../../assets/data/physical_list';
import { Edit, Trash2 } from 'react-feather'
import axios from 'axios';
import Swal from 'sweetalert2'



export class Product_list extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        axios.get('https://store.squarepakistan.com/public/api/Product', { crossdomain: true })
            .then(function (response) {
                const data = response.data.data;
                this.setState({ data: data });
                console.log(data);
            }.bind(this))
    }
    async removeProduct(id) {
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
                axios.post('https://store.squarepakistan.com/public/api/' + id + '/deleteProduct', data)
                    .then(function (response) {
                        console.log(response);
                        axios.get('https://store.squarepakistan.com/public/api/Products', { crossdomain: true })
                            .then(function (response) {
                                const data = response.data.data;
                                this.setState({
                                    data: data,
                                });
                                console.log(data[0].id);

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



        // await axios.post('https://store.squarepakistan.com/public/api/' + id + '/deleteProduct', data)
        //     .then(function (response) {
        //         console.log(response);
        //         Swal.fire({
        //             title: 'Error',
        //             text: 'Do You Really want to delete this?',
        //             icon: 'error',
        //             confirmButtonText: 'Delete'
        //         }).then(function () {
        //             window.location.reload();
        //         }
        //         )
        //     })
        //     .catch(function (error) {
        //         console.log(error)

        //     })
    }
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Product List" parent="Physical" />
                <div className="container-fluid">
                    <div className="row products-admin ratio_asos">
                        {
                            this.state.data.map((myData, i) => {
                                return (
                                    <div className="col-xl-3 col-sm-6" key={i}>
                                        <div className="card">
                                            <div className="products-admin">
                                                <div className="card-body product-box" style={{ minHeight: '350px' }}>
                                                    <div className="img-wrapper" style={{
                                                        background: '#eee'
                                                    }}>
                                                        <div className="lable-block">
                                                            {(myData.tag === 'new') ? <span className="lable3">{myData.tag}</span> : ''}
                                                            {(myData.discount === 'on sale') ? <span className="lable4">{myData.discount}</span> : ''}
                                                        </div>
                                                        <div className="front" style={{
                                                            minHeight: '200px',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}>
                                                            <a className="bg-size"><img className="img-fluid blur-up bg-img lazyloaded" alt="proimg" src={myData.images} /></a>
                                                            <div className="product-hover">
                                                                <ul>
                                                                    <li>
                                                                        <button className="btn" type="button">
                                                                            <Edit className="editBtn" />
                                                                        </button>
                                                                    </li>
                                                                    <li>
                                                                        <button className="btn" type="button">
                                                                            <Trash2 className="deleteBtn" onClick={() => { this.removeProduct(myData.id) }} />
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="product-detail">
                                                        <div className="rating">
                                                            <i className="fa fa-star"></i>
                                                            <i className="fa fa-star"></i>
                                                            <i className="fa fa-star"></i>
                                                            <i className="fa fa-star"></i>
                                                            <i className="fa fa-star"></i>
                                                        </div>
                                                        <a> <h6 >{myData.name}</h6></a>
                                                        <h4 >AED {myData.price} <del >{myData.discount_price}</del></h4>
                                                        {/* <ul className="color-variant">
                                                            <li className="bg-light0"></li>
                                                            <li className="bg-light1"></li>
                                                            <li className="bg-light2"></li>
                                                        </ul> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Product_list
