import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import SideBar from "./SideBar";
import background from "../assets/background.svg";
import leftArrow from "../assets/leftArrow.svg";
import dot from "../assets/dot.svg"
import edit from "../assets/edit.svg"
import product from "../assets/product.svg";
import time from "../assets/time.svg";
import regular from "../assets/regular.svg";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CreatePackage = () => {
    const [checked, setChecked] = useState(false);
    const [active, setActive] = useState('setup');
    const isActive = (path) => {
        return active === path ? 'btn' : ''
    };
    const [isChecked, setIsChecked] = useState(false);
    const [packageTitle, setPackageTitle] = useState('');
    const [url, setUrl] = useState('');
    const [duration, setDuration] = useState('');

    const handleToggle = () => {
        setIsChecked(!isChecked);
        console.log('Toggle state:', !isChecked);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'packageTitle':
                setPackageTitle(value);
                break;
            case 'url':
                setUrl(value);
                break;
            case 'duration':
                setDuration(value);
                break;
            default:
                break;
        }
    };

    const handleSaveChanges = () => {
        console.log('Package Title:', packageTitle);
        console.log('Category:', selectedCategory);
        console.log('Included Content:', editorStates.included.content);
        console.log('Opening Hours Content:', editorStates.openingHours.content);
        console.log('TNC Content:', editorStates.tnc.content);
        console.log('URL:', url);
        console.log('Add-ons:', addons);
        console.log('Duration:', duration);
        console.log('Images:', images);
        console.log('Is Checked:', isChecked);
        console.log('Editor States:', editorStates);
    };

    const [tab, setTab] = useState('1');


    return (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <img style={{ position: 'absolute', top: 0, zIndex: '-1', width: '100%' }} src={background} alt="background" />
            <div className="create-package" style={{ width: '80%' }}>
                <span className="heading">
                    <Link to="/campaign"><img src={leftArrow} alt="left arrow" /></Link> Create Coupon
                </span>

                <div>
                    <div className="left">
                        <button className={`${isActive('setup')} btn-outline-secondary border-0 active me-2`} onClick={() => setActive('setup')} style={{ textDecoration: 'none' }}>Coupon Setup</button>
                        <button className={`${isActive('availability')} btn-outline-secondary border-0 active me-2`} style={{ textDecoration: 'none' }}>Analytics (Soon)</button>
                    </div>

                    {/* package setUp */}
                    {
                        active === 'setup'
                        &&
                        <motion.div initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }} className="right">
                            <div className="header">
                                <div className="left" style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            id="toggle"
                                            className="toggle-checkbox"
                                            checked={isChecked}
                                            onChange={handleToggle}
                                        />
                                        <label htmlFor="toggle" className="toggle-label"></label>
                                    </div>
                                    <span>Publish</span>
                                </div>

                                <div className="right">
                                    <button className="button" onClick={handleSaveChanges}>Save Changes</button>
                                </div>
                            </div>
                            <div className="body">
                                <input
                                    name="packageTitle"
                                    className="package-title"
                                    type="text"
                                    placeholder="Discount Title"
                                    value={packageTitle}
                                    onChange={handleInputChange}
                                />

                                {/* Discount Buttons */}
                                <div >
                                    <button style={{ backgroundColor: tab === '1' ? '#CAF1D9' : 'transparent', width: '49%', padding: '10px 20px', border: '1px solid black', flexDirection: 'column', display: 'flex', alignItems: 'center' }} onClick={() => setTab('1')} className="btn btn-discount-active">
                                        <img src={time} /> Time-based discount
                                    </button>
                                    <button style={{ backgroundColor: tab === '2' ? '#CAF1D9' : 'transparent', width: '49%', padding: '10px 20px', border: '1px solid black', flexDirection: 'column', display: 'flex', alignItems: 'center' }} onClick={() => setTab('2')} className="btn btn-discount-inactive">
                                        <img src={regular} /> Regular discount
                                    </button>
                                </div>

                                {
                                    tab === '1' &&
                                    <motion.div initia-l={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }} style={{ flexDirection: 'column', margin: '20px 0px' }}>
                                        {/* Time-based Discount Inputs */}
                                        <div className="input-group mb-3">
                                            <input type="number" className="form-control" placeholder="Which hour" />
                                            <input type="number" className="form-control" placeholder="How many discount off" />
                                            <button style={{ background: 'black', color: 'white' }} className="btn btn-outline-secondary">Add time interval</button>
                                        </div>

                                        {/* Filters */}
                                        <div className="row mb-4">
                                            <div className="col">
                                                <select className="form-select">
                                                    <option>In stock</option>
                                                    <option>Out of stock</option>
                                                </select>
                                            </div>
                                            <div className="col">
                                                <select className="form-select">
                                                    <option>Published</option>
                                                    <option>Unpublished</option>
                                                </select>
                                            </div>
                                            <div className="col">
                                                <input type="text" className="form-control" placeholder="Search..." />
                                            </div>
                                            <div className="col-auto">
                                                <button className="btn btn-clear">Clear</button>
                                            </div>
                                        </div>
                                        {/* Product Table */}
                                        <div className="product-table-wrapper">
                                            <table className="table table-hover product-table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col"></th>
                                                        <th scope="col">Product</th>
                                                        {/* <th scope="col">Price</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => setChecked(!checked)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <img src={product} alt="product" style={{ width: '50px', height: '50px' }} />
                                                                <div style={{ flexDirection: 'column' }}>
                                                                    <span>Anti Ageing Facial/Deep Relieve Massage + Healthy Lunch + Swimming Pool + SPA & Fitness Facility</span>
                                                                    <span className="grey">$399</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => setChecked(!checked)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <img src={product} alt="product" style={{ width: '50px', height: '50px' }} />
                                                                <div style={{ flexDirection: 'column' }}>
                                                                    <span>Anti Ageing Facial/Deep Relieve Massage + Healthy Lunch + Swimming Pool + SPA & Fitness Facility</span>
                                                                    <span className="grey">$399</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => setChecked(!checked)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <img src={product} alt="product" style={{ width: '50px', height: '50px' }} />
                                                                <div style={{ flexDirection: 'column' }}>
                                                                    <span>Anti Ageing Facial/Deep Relieve Massage + Healthy Lunch + Swimming Pool + SPA & Fitness Facility</span>
                                                                    <span className="grey">$399</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Footer */}
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="denseCheck" />
                                                <label className="form-check-label" htmlFor="denseCheck">
                                                    Dense
                                                </label>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <label className="me-2">Rows per page:</label>
                                                <select className="form-select form-select-sm" style={{ width: 'auto' }}>
                                                    <option>10</option>
                                                    <option>20</option>
                                                    <option>30</option>
                                                </select>
                                                <span className="ms-2">3 of 7</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                }

                                {
                                    tab === '2' &&
                                    <motion.div initia-l={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }} style={{ flexDirection: 'column', margin: '20px 0px' }}>

                                        <input style={{ width: '35%', padding: '10px 20px', border: '2px solid #E9ECEE', color: '#637381', borderRadius: '10px' }} type="date" placeholder="Valid Date & time"></input>

                                        <div style={{ marginTop: '20px' }} className="grey">Type of coupon</div>
                                        <div style={{ flexDirection: 'column' }}>
                                            <div style={{ justifyContent: 'start' }} className="form-check">
                                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                                <label style={{ margin: '0px 5px' }} className="form-check-label" >
                                                    QR code
                                                </label>
                                            </div>
                                            <div style={{ justifyContent: 'start' }} className="form-check">
                                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                                <label style={{ margin: '0px 5px' }} className="form-check-label" >
                                                    Percent Off
                                                </label>
                                            </div>
                                            <div style={{ justifyContent: 'start' }} className="form-check">
                                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                                <label style={{ margin: '0px 5px' }} className="form-check-label" >
                                                    Money Value
                                                </label>
                                            </div>
                                        </div>

                                        {/* Time-based Discount Inputs */}
                                        <div style={{ marginTop: '20px' }} className="input-group mb-3">
                                            <input type="number" className="form-control" placeholder="Which hour" />
                                            <input type="number" className="form-control" placeholder="How many discount off" />
                                            <button style={{ background: 'black', color: 'white' }} className="btn btn-outline-secondary">Add time interval</button>
                                        </div>

                                        {/* Filters */}
                                        <div className="row mb-4">
                                            <div className="col">
                                                <select className="form-select">
                                                    <option>In stock</option>
                                                    <option>Out of stock</option>
                                                </select>
                                            </div>
                                            <div className="col">
                                                <select className="form-select">
                                                    <option>Published</option>
                                                    <option>Unpublished</option>
                                                </select>
                                            </div>
                                            <div className="col">
                                                <input type="text" className="form-control" placeholder="Search..." />
                                            </div>
                                            <div className="col-auto">
                                                <button className="btn btn-clear">Clear</button>
                                            </div>
                                        </div>
                                        {/* Product Table */}
                                        <div className="product-table-wrapper">
                                            <table className="table table-hover product-table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col"></th>
                                                        <th scope="col">Product</th>
                                                        {/* <th scope="col">Price</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => setChecked(!checked)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <img src={product} alt="product" style={{ width: '50px', height: '50px' }} />
                                                                <div style={{ flexDirection: 'column' }}>
                                                                    <span>Anti Ageing Facial/Deep Relieve Massage + Healthy Lunch + Swimming Pool + SPA & Fitness Facility</span>
                                                                    <span className="grey">$399</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => setChecked(!checked)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <img src={product} alt="product" style={{ width: '50px', height: '50px' }} />
                                                                <div style={{ flexDirection: 'column' }}>
                                                                    <span>Anti Ageing Facial/Deep Relieve Massage + Healthy Lunch + Swimming Pool + SPA & Fitness Facility</span>
                                                                    <span className="grey">$399</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => setChecked(!checked)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <img src={product} alt="product" style={{ width: '50px', height: '50px' }} />
                                                                <div style={{ flexDirection: 'column' }}>
                                                                    <span>Anti Ageing Facial/Deep Relieve Massage + Healthy Lunch + Swimming Pool + SPA & Fitness Facility</span>
                                                                    <span className="grey">$399</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Footer */}
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="denseCheck" />
                                                <label className="form-check-label" htmlFor="denseCheck">
                                                    Dense
                                                </label>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <label className="me-2">Rows per page:</label>
                                                <select className="form-select form-select-sm" style={{ width: 'auto' }}>
                                                    <option>10</option>
                                                    <option>20</option>
                                                    <option>30</option>
                                                </select>
                                                <span className="ms-2">3 of 7</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                }

                                {/* Save Changes Button */}
                                <div style={{ margin: '20px 0px' }}>
                                    <button className="button" onClick={handleSaveChanges}>Save changes</button>
                                </div>
                            </div>
                        </motion.div>
                    }

                    {
                        active === 'availability'
                        &&
                        <motion.div initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }} className="right">
                            <div className="header">
                                <span>Changes will be autosaved</span>
                            </div>
                            <div className="body">
                                <div>
                                    <span>Regular Time</span>
                                    <button className="button">
                                        Create New Present
                                    </button>
                                </div>

                                <div>
                                    <div>
                                        <img src={dot}></img>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>Working hours</span>
                                            <span className="grey">Mon - sat, 9:00 AM - 1:00 PM</span>
                                            <span className="grey">Mon - sat, 3:00 AM - 8:45 PM</span>
                                            <span className="grey">Sun,</span>
                                        </div>
                                    </div>
                                    <img src={edit}></img>
                                </div>
                                <hr />

                                <div>
                                    <span>Date override</span>
                                    <button className="button">
                                        Create New Present
                                    </button>
                                </div>



                                <div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span>Friday, June 21</span>
                                        <span className="grey">12:00 PM - 11:00 PM</span>
                                    </div>
                                    <img src={edit}></img>
                                </div>
                                <hr />

                                <div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span>Friday, June 28</span>
                                        <span className="grey">Unavailable</span>
                                    </div>
                                    <img src={edit}></img>
                                </div>

                                <hr />
                            </div>



                        </motion.div>
                    }


                </div>
            </div>
        </div>
    );
};

CreatePackage.modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        ['link'],
        [{ 'align': [] }],
        ['clean'] // remove formatting button
    ],
};

CreatePackage.formats = [
    'header',
    'font',
    'list',
    'bullet',
    'bold',
    'italic',
    'underline',
    'link',
    'align',
    'clean'
];

export default CreatePackage;
