import React, { useState, useRef, useCallback } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's styles
import SideBar from "./SideBar";
import background from "../assets/background.svg";
import leftArrow from "../assets/leftArrow.svg";
import preview from "../assets/preview.svg";
import copy from "../assets/copy.svg";
import imageUpload from "../assets/imageUpload.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import crossIcon from "../assets/cross.svg";
import PackageSideBar from "./PackageSideBar";
import dot from "../assets/dot.svg"
import edit from "../assets/edit.svg"
import ai from "../assets/aiLogo.svg";
import product from "../assets/product.svg";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CreatePackage = () => {
    const [checked, setChecked] = useState(false);
    const [active, setActive] = useState('setup');
    const isActive = (path) => {
        return active === path ? 'btn' : ''
    };
    const [isChecked, setIsChecked] = useState(false);
    const [images, setImages] = useState([]);
    const [editorStates, setEditorStates] = useState({
        included: { content: '', operations: [] },
        openingHours: { content: '', operations: [] },
        tnc: { content: '', operations: [] }
    });
    const [packageTitle, setPackageTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Spa');
    const [url, setUrl] = useState('');
    const [addons, setAddons] = useState(['', '']);
    const [duration, setDuration] = useState('');
    const fileInputRef = useRef(null);
    const quillRefs = useRef({ included: null, openingHours: null, tnc: null });

    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const [isChecked3, setIsChecked3] = useState(false);

    const handleToggle1 = () => {
        setIsChecked1(!isChecked1);
        console.log('Toggle state:', !isChecked1);
    };

    const handleToggle2 = () => {
        setIsChecked2(!isChecked2);
        console.log('Toggle state:', !isChecked2);
    };

    const handleToggle3 = () => {
        setIsChecked3(!isChecked3);
        console.log('Toggle state:', !isChecked3);
    };

    const handleToggle = () => {
        setIsChecked(!isChecked);
        console.log('Toggle state:', !isChecked);
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setImages(prevImages => [...prevImages, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
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

    const handleAddonsChange = (index, value) => {
        const newAddons = [...addons];
        newAddons[index] = value;
        setAddons(newAddons);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const updateEditorState = useCallback((editorKey, delta, oldDelta, source) => {
        setEditorStates(prevStates => {
            const updatedOperations = [...prevStates[editorKey].operations, { delta, oldDelta, source }];
            return {
                ...prevStates,
                [editorKey]: {
                    ...prevStates[editorKey],
                    operations: updatedOperations
                }
            };
        });
    }, []);

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

    return (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <img style={{ position: 'absolute', top: 0, zIndex: '-1', width: '100%' }} src={background} alt="background" />
            <div className="create-package" style={{ width: '80%' }}>
                <span className="heading">
                    <Link to="/campaign"><img src={leftArrow} alt="left arrow" /></Link> Create NearReel
                </span>

                <div>
                    <div className="left">
                        <button className={`${isActive('setup')} btn-outline-secondary border-0 active me-2`} onClick={() => setActive('setup')} style={{ textDecoration: 'none' }}>Content</button>
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
                                    placeholder="Ads Title"
                                    value={packageTitle}
                                    onChange={handleInputChange}
                                />
                                <input style={{ width: '35%', padding: '10px 20px', border: '2px solid #E9ECEE', color: '#637381', borderRadius: '10px' }} type="date" placeholder="Valid Date & time"></input>

                                <Link style={{ marginTop: '20px', textDecoration: 'none', border: '2px solid #E9ECEE', width: 'fit-content', padding: '5px', borderRadius: '20px' }}><img src={ai} /> Generate Video with Near.AI</Link>

                                <div
                                    className="image-upload"
                                    style={{ cursor: 'pointer', textAlign: 'center', marginTop: '20px' }}
                                    onClick={handleUploadClick}
                                >
                                    <img src={imageUpload} alt="upload" />
                                    <span style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '20px' }}>Select files</span>
                                    <p className="grey">Drop files here or click <span style={{ color: '#00A76F' }}>browse</span> through your machine</p>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                                <div className="image-select" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {images.map((image, index) => (
                                        <div key={index} style={{ position: 'relative', margin: '10px' }}>
                                            <img src={image} alt={`uploaded ${index}`} style={{ objectFit: 'cover' }} />
                                            <button
                                                onClick={() => handleRemoveImage(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '5px',
                                                    right: '5px',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <img src={crossIcon} alt="remove" style={{ width: '20px', height: '20px' }} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ justifyContent: "end" }}>
                                    <button style={{ borderRadius: '5px', padding: '0px 10px', margin: '0px 10px' }}>Remove All</button>
                                    <button className="button">Upload</button>
                                </div>

                                {/* <div className="url">
                                    <span className="grey">URL</span>
                                    <div>
                                        <input
                                            type="url"
                                            name="url"
                                            value={url}
                                            onChange={handleInputChange}
                                        />
                                        <img src={copy} alt="copy" />
                                    </div>
                                </div> */}

                                {/* <div style={{ margin: '20px 0px' }} className="grey">Mention Package</div>
                                <div style={{ flexDirection: 'column', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)', padding: '10px', borderRadius: '20px' }}>

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

                                    <div className="product-table-wrapper">
                                        <table className="table table-hover product-table">
                                            <thead>
                                                <tr>
                                                    <th scope="col"></th>
                                                    <th scope="col">Product</th>
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
                                </div> */}

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
