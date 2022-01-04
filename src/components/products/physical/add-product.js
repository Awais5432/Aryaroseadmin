import React, { Component, Fragment } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import CKEditors from "react-ckeditor-component";
import { AvField, AvForm } from 'availity-reactstrap-validation';
import one from '../../../assets/images/pro3/1.jpg'
import user from '../../../assets/images/user.png';
import axios from 'axios';
import Swal from 'sweetalert2'
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";



export class Add_product extends Component {
    constructor(props) {
        super(props)
        this.updateContent = this.updateContent.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            quantity: 1,
            pro_img: [],
            image_show: one,
            image: '',
            name: '',
            price: '',
            product_code: '',
            content: '',
            categories: [],
            subcategories: [],
            brands: [],
            dummyimgs: [
                { img: user },
                // { img: user },
                // { img: user },
                // { img: user },
                // { img: user },
                // { img: user },
            ],
            cat_id: '',
            subcat_id: '',
            brand_id: '',
            tags: [],
            name_arabic: '',
            is_featured: false,
            is_bestseller: false,
            arabicdescription: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeCat = this.handleChangeCat.bind(this);
    }


    updateContent(newContent) {
        this.setState({
            content: newContent
        })
    }

    onChange(evt) {
        console.log("onChange fired with event info: ", evt);
        var newContent = evt.editor.getData();
        this.setState({
            content: newContent
        })
    }

    onBlur(evt) {
        console.log("onBlur event called with event info: ", evt);
    }

    afterPaste(evt) {
        console.log("afterPaste event called with event info: ", evt);
    }




    IncrementItem = () => {
        this.setState(prevState => {
            if (prevState.quantity < 9) {
                return {
                    quantity: prevState.quantity + 1
                }
            } else {
                return null;
            }
        });
    }
    DecreaseItem = () => {
        this.setState(prevState => {
            if (prevState.quantity > 0) {
                return {
                    quantity: prevState.quantity - 1
                }
            } else {
                return null;
            }
        });
    }
    handleChangeTag = (newTags) => {
        this.setState({
            tags: newTags
        });
    }
    handleChange = (event) => {
        // this.setState({ name: event.target.value });
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    //image upload
    _handleSubmit(e) {
        e.preventDefault();
    }

    _handleSingleImgChange(e) {
        e.preventDefault();
        this.setState({
            image: e.target.files[0]
        })
        console.log(this.state.image)
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onload = (e) => {
            this.setState({
                image_show: reader.result
            });
        }
        reader.readAsDataURL(file)
    }

    _handleImgChange(e, i) {

        e.preventDefault();
        const tempArr = [];
        let images = [];
        [...e.target.files].forEach(file => {
            // console.log("file >>> ", file['name']);
            tempArr.push({
                data: file['name'],
                // url: URL.createObjectURL(file)
            });
        });

        // setPictures(tempArr);

        console.log(tempArr);
        for (let i = 0; i < e.target.files.length; i++) {
            images.push(URL.createObjectURL(e.target.files[i]))
        }
        let reader = new FileReader();
        let filess = e.target.files[0];
        let files = e.target.files[0].name;
        const { dummyimgs } = this.state;
        // this.setState(
        //     {
        //         pro_img: [...this.state.pro_img, ...e.target.files]
        //     }
        // )
        reader.onloadend = () => {
            // tempArr.forEach((file, i) => {
            //     const { pro_img } = this.state;
            //     pro_img[i].data = file.data;
            //     // console.log(pro_img);
            // })
            dummyimgs[i].img = reader.result;
            this.setState({
                dummyimgs,
                pro_img: images
                // pro_img: tempArr[0].data
            });
            console.log();
        }
        reader.readAsDataURL(filess)
    }
    async handleSubmit(e) {

        e.preventDefault();
        const files = this.state.pro_img;
        let productimages = [];
        console.log(this.state.is_featured);
        let gallery_url = 'https://store.squarepakistan.com/public/product/' + this.state.pro_img;
        let url = 'https://store.squarepakistan.com/public/product/' + this.state.image;
        let date = new Date().toJSON();
        let data = new FormData();
        data.append('name', this.state.name);
        data.append('name_arabic', this.state.name_arabic);
        data.append('price', this.state.price);
        data.append('new', this.state.is_featured);
        data.append('sale', this.state.is_bestseller);
        data.append('stock', this.state.quantity);
        data.append('sku', this.state.product_code);
        data.append('desription', this.state.content);
        data.append('file', this.state.image);
        // data.append('pro_image[]', this.state.pro_img);
        data.append('tags[]', this.state.tags);
        // data.append('pro_image', files);
        data.append('cat_id', this.state.cat_id);
        data.append('subcat_id', this.state.subcat_id);
        data.append('brand_id', this.state.brand_id);
        data.append('timestamps', date);
        // for (let i = 0; i < files.length; i++) {
        //     data.append("pro_image", files[i]);
        // productimages.push(files[i]);
        // }

        // files.forEach((image_file) => {
        //     data.append('pro_img[]', image_file);
        // });
        // console.log(this.state.pro_img);
        for (let i = 0; i < this.state.pro_img.length; i++) {
            // data.append("pro_image[]", this.state.pro_img[i]);
            productimages.push(this.state.pro_img[i]);
        }
        data.append('pro_image[]', productimages);
        // for (const key of Object.keys(this.state.pro_img)) {
        //     data.append('pro_image[]', this.state.pro_img[key])
        // }
        // data.append("pro_image", files);
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }
        await axios.post('https://store.squarepakistan.com/public/api/addProduct', data, config,
            { crossdomain: true }
        )
            .then(function (response) {
                console.log(response)
                console.log(url)
                Swal.fire({
                    title: 'Success',
                    text: 'Product Added',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(function () {
                    this.setState({
                        quantity: 1,
                        pro_img: [],
                        image_show: one,
                        image: '',
                        name: '',
                        price: '',
                        product_code: '',
                        content: '',
                        categories: [],
                        subcategories: [],
                        brands: [],
                        cat_id: '',
                        subcat_id: '',
                        brand_id: ''
                    })
                    window.location.reload()
                }.bind(this)
                );
            }.bind(this))
            .catch(function (error) {
                console.log(error)

            })
        // Swal.fire(
        //   'Good job!',
        //   'Expense Added Successfully',
        //   'success'
        // )
    }

    getSubcat(id) {
        axios.get(`https://store.squarepakistan.com/public/api/${id}/getSubCategoryById`, { crossdomain: true })
            .then(function (response) {
                const data = response.data.data;
                this.setState({ subcategories: data });
                console.log(data);
            }.bind(this));
    }

    handleChangeCat(e) {
        let ev = e.target.value;
        this.setState({
            cat_id: ev
        })
        this.getSubcat(ev);
    }

    componentDidMount() {
        axios.get('https://store.squarepakistan.com/public/api/Categories', { crossdomain: true })
            .then(function (response) {
                const data = response.data.data;
                this.setState({ categories: data });
                // console.log(data);
            }.bind(this));

        // axios.get('https://store.squarepakistan.com/public/api/SubCategories', { crossdomain: true })
        //     .then(function (response) {
        //         const data = response.data.data;
        //         this.setState({ subcategories: data });
        //         console.log(data);
        //     }.bind(this));

        axios.get('https://store.squarepakistan.com/public/api/Brands', { crossdomain: true })
            .then(function (response) {
                const data = response.data.data;
                this.setState({ brands: data });
                // console.log(data);
            }.bind(this));
    }
    render() {
        const { pro_img } = this.state;
        return (
            <Fragment>
                <Breadcrumb title="Add Product" parent="Products" />
                <AvForm className="needs-validation add-product-form" onSubmit={this.handleSubmit} onInvalidSubmit={this.handleInvalidSubmit} encType='multipart/form-data'>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5>Add Product</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row product-adding">
                                            <div className="col-xl-5">
                                                <div className="add-product">
                                                    <div className="row">
                                                        <div className="col-xl-3 xl-15 col-sm-3 col-4">
                                                            <label className="mb-0 font-weight-bold" style={{ fontSize: 16 }}>Product Image: </label>
                                                        </div>
                                                        <div className="xl-45 col-sm-5 col-4">
                                                            <ul>
                                                                <li>
                                                                    <div className="box-input-file" style={{ width: '100%', height: 375 }}>
                                                                        <input className="upload" accept='image/*' style={{ cursor: 'pointer', width: '100%', height: 375 }} type="file" onChange={(e) => this._handleSingleImgChange(e)} name="file" />
                                                                        <img src={this.state.image_show} style={{ width: '100%', height: 375 }} alt="" className="img-fluid image_zoom_1 blur-up lazyloaded" />
                                                                        <a id="result2" onClick={(e) => this._handleSubmit(e.target.id)}></a>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="col-xl-3 xl-40 col-sm-3 col-4">
                                                            <ul className="file-upload-product">
                                                                {
                                                                    this.state.dummyimgs.map((res, i) => {
                                                                        return (
                                                                            <li key={i}>
                                                                                <div className="box-input-file" style={{ width: 'unset', height: 'unset', backgroundColor: '#fff' }}>
                                                                                    <input accept='image/*' className="upload" multiple style={{ cursor: 'pointer', width: '100%', height: 40, cursor: 'pointer' }} type="file" onChange={(e) => this._handleImgChange(e, i)} name="pro_image[]" />
                                                                                    <button type="button" className="btn btn-primary">Image Gallery</button>
                                                                                    <a id="result1" onClick={(e) => this._handleSubmit(e.target.id)}></a>
                                                                                </div>
                                                                            </li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>
                                                            {/* <img src={user} style={{ width: 50, height: 50 }} /> */}
                                                            {pro_img && (
                                                                <div>
                                                                    {pro_img.map((img, i) => {
                                                                        return <>
                                                                            <img className="preview" style={{ width: '100%', height: 'auto', maxWidth: '100px' }} src={img} alt={"image-" + i} key={i} />
                                                                            <br></br>
                                                                            <br></br>
                                                                        </>;
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-7">
                                                <div className="form form-label-center">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group mb-3 row">
                                                                <label className="col-xl-3 col-sm-4 mb-0" style={{ fontSize: '14px' }}>Product Name <br></br> (in English): </label>
                                                                <div className="col-xl-8 col-sm-7">
                                                                    <AvField className="form-control" name="name" value={this.state.name} onChange={this.handleChange} id="validationCustom01" type="text" required />
                                                                </div>
                                                                <div className="valid-feedback">Looks good!</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group mb-3 row">
                                                                <label className="col-xl-3 col-sm-4 mb-0" style={{ fontSize: '14px' }}>Product Name <br></br> (in Arabic): </label>
                                                                <div className="col-xl-8 col-sm-7">
                                                                    <AvField className="form-control" name="name_arabic" value={this.state.name_arabic} onChange={this.handleChange} id="validationCustom01" type="text" required />
                                                                </div>
                                                                <div className="valid-feedback">Looks good!</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group mb-3 row">
                                                                <label className="col-xl-3 col-sm-4 mb-0" style={{ fontSize: '14px' }}>Product Tags</label>
                                                                <div className="col-xl-8 col-sm-7">
                                                                    <ReactTagInput tags={this.state.tags} onChange={(newTags) => this.handleChangeTag(newTags)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4 mb-0" style={{ fontSize: '14px' }} >Select Category: </label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <select className="form-control digits" id="exampleFormControlSelect1" name="cat_id" onChange={this.handleChangeCat}>
                                                                <option value="0">Select Category</option>
                                                                {
                                                                    this.state.categories.map((myData, i) => {
                                                                        return (
                                                                            <option key={i} value={myData.id} onClick={() => this.getSubcat(myData.id)}>
                                                                                {myData.name}
                                                                            </option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4 mb-0" style={{ fontSize: '14px' }} >Select Sub Category: </label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <select className="form-control digits" id="exampleFormControlSelect1" name="subcat_id" onChange={this.handleChange}>
                                                                <option value="0">Select Sub Category</option>
                                                                {
                                                                    this.state.subcategories.map((myData, i) => {
                                                                        return (
                                                                            <option key={i} value={myData.id}>
                                                                                {myData.name}
                                                                            </option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4 mb-0" style={{ fontSize: '14px' }} >Select Brand: </label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <select className="form-control digits" id="exampleFormControlSelect1" name="brand_id" onChange={this.handleChange}>
                                                                <option value="0">Select Brand</option>
                                                                {
                                                                    this.state.brands.map((myData, i) => {
                                                                        return (
                                                                            <option key={i} value={myData.id}>
                                                                                {myData.name}
                                                                            </option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0" style={{ fontSize: '14px' }}>Product Specifications: </label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <label style={{ fontSize: '14px', fontWeight: '500' }}>is Featured?</label>
                                                            <input type="checkbox" className="mx-3" name="is_featured" value={this.state.is_featured} onChange={() => this.setState({ is_featured: true })} />
                                                            <label style={{ fontSize: '14px', fontWeight: '500' }} >is BestSelling?</label>
                                                            <input type="checkbox" className="mx-3" name="is_bestseller" value={this.state.is_bestseller} onChange={() => this.setState({ is_bestseller: true })} />
                                                        </div>
                                                        <div className="valid-feedback">Looks good!</div>
                                                    </div>
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0" style={{ fontSize: '14px' }}>Price: </label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <AvField className="form-control mb-0" style={{ fontSize: '14px' }} name="price" value={this.state.price} onChange={this.handleChange} id="validationCustom02" type="number" required />
                                                        </div>
                                                        <div className="valid-feedback">Looks good!</div>
                                                    </div>
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0" style={{ fontSize: '14px' }}>Product SKU: </label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <AvField className="form-control " name="product_code" value={this.state.product_code} onChange={this.handleChange} id="validationCustomUsername" type="text" required />
                                                        </div>
                                                        <div className="invalid-feedback offset-sm-4 offset-xl-3">Please choose Valid Code.</div>
                                                    </div>
                                                </div>
                                                <div className="form">
                                                    {/* <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4 mb-0" style={{ fontSize: '14px' }} >Select Size: </label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <select className="form-control digits" id="exampleFormControlSelect1">
                                                                <option value="0">Select Size</option>
                                                                <option>Small</option>
                                                                <option>Medium</option>
                                                                <option>Large</option>
                                                                <option>Extra Large</option>
                                                            </select>
                                                        </div>
                                                    </div> */}
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4 mb-0" style={{ fontSize: '14px' }}>Product Quantity: </label>
                                                        <fieldset className="qty-box ml-0">
                                                            <div className="input-group bootstrap-touchspin">
                                                                <div className="input-group-prepend">
                                                                    <button className="btn btn-primary btn-square bootstrap-touchspin-down" type="button" onClick={this.DecreaseItem} >
                                                                        <i className="fa fa-minus"></i>
                                                                    </button>
                                                                </div>
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text bootstrap-touchspin-prefix" ></span>
                                                                </div>
                                                                <input className="touchspin form-control" type="text" value={this.state.quantity} onChange={this.handleChange} />
                                                                <div className="input-group-append">
                                                                    <span className="input-group-text bootstrap-touchspin-postfix"></span>
                                                                </div>
                                                                <div className="input-group-append ml-0">
                                                                    <button className="btn btn-primary btn-square bootstrap-touchspin-up" type="button" onClick={this.IncrementItem}>
                                                                        <i className="fa fa-plus"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4">Add Description: </label>
                                                        <div className="col-xl-8 col-sm-7 description-sm">
                                                            <CKEditors
                                                                name="description"
                                                                activeclassName="p10"
                                                                content={this.state.content}
                                                                events={{
                                                                    "blur": this.onBlur,
                                                                    "afterPaste": this.afterPaste,
                                                                    "change": this.onChange
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="offset-xl-3 offset-sm-4">
                                                    <button type="submit" className="btn btn-primary">Add</button>
                                                    <button type="button" className="btn btn-light">Discard</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </AvForm>
            </Fragment >
        )
    }
}

export default Add_product