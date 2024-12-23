import React, { useState, useEffect, useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SideBar from "./SideBar";
import background from "../assets/background.svg";
import leftArrow from "../assets/leftArrow.svg";
import crossIcon from "../assets/cross.svg";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import imageUpload from "../assets/imageUpload.svg";

const CreatePackage = () => {
    const { id } = useParams();
    const jwtUserToken = Cookies.get("user_token");
    const userData = JSON.parse(jwtUserToken);
    console.log("User Data:", userData);

    const [invImgFileName, setInvImgFileName] = useState("");
    const [unit, setUnit] = useState("minutes");
    const [inventoryData, setInventoryData] = useState(null);
    const [active, setActive] = useState('setup');
    const [isChecked, setIsChecked] = useState(false);
    const [images, setImages] = useState([]);
    const [editorStates, setEditorStates] = useState({
        included: { content: '', operations: [] },
        tnc: { content: '', operations: [] }
    });
    const [packageTitle, setPackageTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Spa');
    const [duration, setDuration] = useState('');
    const quillRefs = useRef({ included: null, tnc: null });

    const fetchData = async () => {
        const userDataa = JSON.parse(jwtUserToken);
        try {
            const payload = {
                vendorId: userDataa.ID,
                invId: id
            };
            const response = await fetch('https://wellness.neardeal.me/WAPI/fetchInvDetailsMW.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const userData = await response.json();
            setInventoryData(userData.data[0]); // Assuming the data is an array
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        console.log("Inventory Data:", inventoryData);
    }, []);

    const handleUnitChange = (e) => {
        setUnit(e.target.value);
    };

    const handleRemoveImage = () => {
        setImages(null);
    };

    useEffect(() => {
        
        if (inventoryData) {
            setInvImgFileName(inventoryData.ImageLocation);
            console.log("kjweb", inventoryData.ImageLocation);
            setPackageTitle(inventoryData.InventoryName);
            setIsChecked(inventoryData.Status === '1' ? true : false);
            setDuration(inventoryData.Duration || '');
            setEditorStates(prev => ({
                ...prev,
                included: { content: inventoryData.WhatIncluded || '', operations: [] },
                tnc: { content: inventoryData.Tnc || '', operations: [] }
            }));
        }
    }, [inventoryData]);

    const handleToggle = () => {
        setIsChecked(prev => !prev);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setInvImgFileName(file.name);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result; // Get the Base64 string from the reader
                const parts = base64String.split(","); // Split the string at the comma
                console.log("--------", parts); // Now you can log it

                // Update the state with the new data
                setImages(parts[1]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'packageTitle':
                setPackageTitle(value);
                break;
            case 'duration':
                setDuration(value);
                break;
            default:
                break;
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch('https://wellness.neardeal.me/WAPI/createPackageMW.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vendorId: userData.ID,
                    invId: id,
                    invName: packageTitle,
                    invCat: selectedCategory,
                    whatIncluded: editorStates.included.content,
                    TnC: editorStates.tnc.content,
                    duration: duration,
                    unit: unit,
                    status: isChecked ? 1 : 0,
                    price: 999,
                    currency: "HKD",
                    invImgFileName: invImgFileName,
                    invImage: images
                })
            });

            const data = await response.json();
            // console.log(data);
            toast.success("Package updated successfully");
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred');
        }
    };

    const fileInputRef = useRef(null);
    
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    if (!inventoryData) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <img style={{ position: 'absolute', top: 0, zIndex: '-1', width: '100%' }} src={background} alt="background" />
            <div className="create-package" style={{ width: '80%' }}>
                <span className="heading">
                    <Link to="/package"><img src={leftArrow} alt="left arrow" /></Link> Edit Package
                </span>
                <div>
                    <div className="left">
                        <button className={`btn-outline-secondary border-0 active me-2 ${active === 'setup' ? 'active' : ''}`} onClick={() => setActive('setup')}>Package Setup</button>
                    </div>
                    {active === 'setup' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="right">
                            <div className="header">
                                <div className="left" style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            id="toggle"
                                            className="toggle-checkbox"
                                            onChange={handleToggle}
                                            checked={isChecked}
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
                                <div>
                                    <span className="grey">Add this package to
                                        <select disabled className="select" value={selectedCategory} onChange={handleCategoryChange}>
                                            <option>{inventoryData && inventoryData.InventoryCat}</option>
                                        </select>
                                    </span>
                                </div>
                                <input
                                    name="packageTitle"
                                    className="package-title"
                                    type="text"
                                    value={packageTitle}
                                    onChange={handleInputChange}
                                />      

                                <div
                                    className="image-upload"
                                    style={{ cursor: 'pointer', textAlign: 'center' }}
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

                                {images && (
                                    <div style={{ position: 'relative', margin: '10px' }}>
                                        <img
                                            src={`data:image/jpeg;base64,${images}`}
                                            alt="uploaded"
                                            style={{ objectFit: 'cover', width: '10%', height: 'auto' }}
                                        />
                                        <button
                                            onClick={handleRemoveImage}
                                            style={{
                                                position: 'absolute',
                                                top: '5px',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                left: '55px',
                                            }}
                                        >
                                            <img src={crossIcon} alt="remove" style={{ width: '20px', height: '20px', position: 'absolute', left: '0px' }} />
                                        </button>
                                    </div>
                                )}

                                <div className="grey">What's included</div>
                                <div className="text-section">
                                    <ReactQuill
                                        value={editorStates.included.content}
                                        onChange={(content) => setEditorStates(prevStates => ({
                                            ...prevStates,
                                            included: { content, operations: prevStates.included.operations }
                                        }))}
                                        className="text-area"
                                        placeholder="Type here"
                                        ref={(el) => {
                                            if (el) {
                                                quillRefs.current.included = el.getEditor();
                                            }
                                        }}
                                    />
                                </div>
                                <div className="grey">TNC</div>
                                <div className="text-section">
                                    <ReactQuill
                                        value={editorStates.tnc.content}
                                        onChange={(content) => setEditorStates(prevStates => ({
                                            ...prevStates,
                                            tnc: { content, operations: prevStates.tnc.operations }
                                        }))}
                                        className="text-area"
                                        placeholder="Type here"
                                        ref={(el) => {
                                            if (el) {
                                                quillRefs.current.tnc = el.getEditor();
                                            }
                                        }}
                                    />
                                </div>
                                <div className="grey">Duration</div>
                                <div className="add-on" style={{ display: "flex", justifyContent: "start" }}>
                                    <input
                                        style={{ margin: "0px 4px" }}
                                        type="text"
                                        name="duration"
                                        value={duration}
                                        onChange={handleInputChange}
                                        placeholder="Enter duration"
                                    />
                                    <select className="select" value={unit} onChange={handleUnitChange}>
                                        <option value="minutes">minutes</option>
                                        <option value="hours">hours</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatePackage;
