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
import dot from "../assets/dot.svg"
import edit from "../assets/edit.svg"
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CreatePackage = () => {
    const jwtUserToken = Cookies.get("user_token");
    const userData = JSON.parse(jwtUserToken);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleProfileClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        onLogout();
        setIsDropdownOpen(false); // Close dropdown after logout
    };

    const [availabilityGroups, setAvailabilityGroups] = useState([
        {
            timeSlots: [
                { startTime: "09:00", endTime: "13:00" },
                { startTime: "15:00", endTime: "20:00" },
            ],
            selectedDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        },
        {
            timeSlots: [{ startTime: "09:00", endTime: "13:00" }],
            selectedDays: ["Sun"],
        },
    ]);

    const addTimeSlot = (groupIndex) => {
        const updatedGroups = [...availabilityGroups];
        updatedGroups[groupIndex].timeSlots.push({ startTime: "09:00", endTime: "18:00" });
        setAvailabilityGroups(updatedGroups);
    };

    const addAvailabilityGroup = () => {
        setAvailabilityGroups([
            ...availabilityGroups,
            {
                timeSlots: [{ startTime: "09:00", endTime: "13:00" }],
                selectedDays: [],
            },
        ]);
    };

    const removeAvailabilityGroup = (groupIndex) => {
        const updatedGroups = availabilityGroups.filter((_, i) => i !== groupIndex);
        setAvailabilityGroups(updatedGroups);
    };

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
    const [availabilitySets, setAvailabilitySets] = useState([
        { fromTime: "09:00", toTime: "18:00", days: [] },
    ]);

    const addAvailabilitySet = () => {
        setAvailabilitySets([
            ...availabilitySets,
            { fromTime: "09:00", toTime: "18:00", days: [] },
        ]);
    };

    const handleTimeChange = (index, field, value) => {
        const updatedSets = [...availabilitySets];
        updatedSets[index][field] = value;
        setAvailabilitySets(updatedSets);
    };

    const handleDayToggle = (index, day) => {
        const updatedSets = [...availabilitySets];
        const daysSet = updatedSets[index].days;
        if (daysSet.includes(day)) {
            updatedSets[index].days = daysSet.filter((d) => d !== day);
        } else {
            updatedSets[index].days.push(day);
        }
        setAvailabilitySets(updatedSets);
    };

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

    const handleSaveChanges = async () => {
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
        try {
            const response = await fetch('https://wellness.neardeal.me/WAPI/createPackageMW.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "vendorId": userData.ID,
                    "invName": packageTitle,
                    "invCat": selectedCategory,
                    "whatIncluded": editorStates.included.content,
                    "TnC": editorStates.tnc.content,
                    "duration": duration,
                    "status": isChecked,
                    "price": 999,
                    "currency": "HKD",
                    "invImgFileName": "PizzaBOGO.jpg",
                    "invImage":""
                })
            });

            const data = await response.json();
            console.log(data);
            // You may want to refresh the booking data after editing
            // handleSubmit(active);
            toast.success("Package created successfully");
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred');
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <img style={{ position: 'absolute', top: 0, zIndex: '-1', width: '100%' }} src={background} alt="background" />
            <div className="create-package" style={{ width: '80%' }}>
                <span className="heading">
                    <Link to="/package"><img src={leftArrow} alt="left arrow" /></Link> Create Package
                </span>

                <div>
                    <div className="left">
                        <button className={`${isActive('setup')} btn-outline-secondary border-0 active me-2`} onClick={() => setActive('setup')} style={{ textDecoration: 'none' }}>Package Setup</button>
                        {/* <button className={`${isActive('availability')} btn-outline-secondary border-0 active me-2`} onClick={() => setActive('availability')} style={{ textDecoration: 'none' }}>Availability</button>
                        <button className={`${isActive('limits')} btn-outline-secondary border-0 active me-2`} onClick={() => setActive('limits')} style={{ textDecoration: 'none' }}>Limits</button> */}
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

                                <div className="mid">
                                    {/* <span><img src={copy} alt="copy link" /> Copy Link</span>
                                    <span><img src={preview} alt="preview" /> Preview</span> */}
                                </div>

                                <div className="right">
                                    <button className="button" onClick={handleSaveChanges}>Save Changes</button>
                                </div>
                            </div>
                            <div className="body">
                                <div>
                                    <span className="grey">Add this package to
                                        <select className="select" value={selectedCategory} onChange={handleCategoryChange}>
                                            <option>Spa</option>
                                        </select>
                                    </span>
                                </div>
                                <input
                                    name="packageTitle"
                                    className="package-title"
                                    type="text"
                                    placeholder="Package Title"
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
                                <div className="grey">What's included</div>
                                <div className="text-section">
                                    <ReactQuill
                                        value={editorStates.included.content}
                                        onChange={(content, delta, source) => {
                                            setEditorStates(prevStates => ({
                                                ...prevStates,
                                                included: { content, operations: prevStates.included.operations }
                                            }));
                                            updateEditorState('included', delta, null, source);
                                        }}
                                        className="text-area"
                                        modules={CreatePackage.modules}
                                        formats={CreatePackage.formats}
                                        placeholder="Type here"
                                        ref={(el) => {
                                            if (el) {
                                                quillRefs.current.included = el.getEditor();
                                                quillRefs.current.included.on('text-change', (delta, oldDelta, source) => updateEditorState('included', delta, oldDelta, source));
                                            }
                                        }}
                                    />
                                </div>
                                {/* <div className="grey">Opening hours</div>
                                <div className="text-section">
                                    <ReactQuill
                                        value={editorStates.openingHours.content}
                                        onChange={(content, delta, source) => {
                                            setEditorStates(prevStates => ({
                                                ...prevStates,
                                                openingHours: { content, operations: prevStates.openingHours.operations }
                                            }));
                                            updateEditorState('openingHours', delta, null, source);
                                        }}
                                        className="text-area"
                                        modules={CreatePackage.modules}
                                        formats={CreatePackage.formats}
                                        placeholder="Type here"
                                        ref={(el) => {
                                            if (el) {
                                                quillRefs.current.openingHours = el.getEditor();
                                                quillRefs.current.openingHours.on('text-change', (delta, oldDelta, source) => updateEditorState('openingHours', delta, oldDelta, source));
                                            }
                                        }}
                                    />
                                </div> */}
                                <div className="grey">TNC</div>
                                <div className="text-section">
                                    <ReactQuill
                                        value={editorStates.tnc.content}
                                        onChange={(content, delta, source) => {
                                            setEditorStates(prevStates => ({
                                                ...prevStates,
                                                tnc: { content, operations: prevStates.tnc.operations }
                                            }));
                                            updateEditorState('tnc', delta, null, source);
                                        }}
                                        className="text-area"
                                        modules={CreatePackage.modules}
                                        formats={CreatePackage.formats}
                                        placeholder="Type here"
                                        ref={(el) => {
                                            if (el) {
                                                quillRefs.current.tnc = el.getEditor();
                                                quillRefs.current.tnc.on('text-change', (delta, oldDelta, source) => updateEditorState('tnc', delta, oldDelta, source));
                                            }
                                        }}
                                    />
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
                                </div>
                                <div className="grey">Add-on</div>
                                <div className="add-on" style={{ justifyContent: 'start' }}>
                                    {addons.map((addon, index) => (
                                        <input
                                            key={index}
                                            style={{ margin: '0px 4px' }}
                                            type="text"
                                            value={addon}
                                            onChange={(e) => handleAddonsChange(index, e.target.value)}
                                        />
                                    ))}
                                    <img src={deleteIcon} alt="delete" />
                                </div> */}

                                <div className="grey">Duration</div>
                                <div className="add-on" style={{ justifyContent: 'start' }}>
                                    <input
                                        style={{ margin: '0px 4px' }}
                                        type="text"
                                        name="duration"
                                        value={duration}
                                        onChange={handleInputChange}
                                    />
                                    <select className="select" value="minutes">
                                        <option>minutes</option>
                                        <option>hours</option>
                                    </select>
                                </div>
                                <div>
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
                                    <button className="button" data-bs-toggle="offcanvas" data-bs-target="#demo">
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
                                    <button className="button" data-bs-toggle="offcanvas" data-bs-target="#demo1">
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

                    {
                        active === 'limits'
                        &&
                        <motion.div initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }} className="right">
                            <div className="header">
                                <span>Changes will be autosaved</span>
                            </div>
                            <div style={{ width: '100%' }} className="body">
                                <div style={{ width: '100%' }}>
                                    <div style={{ width: '49%' }} className="left">
                                        <span className="grey">Before Event</span>
                                        <select className="select">
                                            <option>No Buffer</option>
                                        </select>

                                        <span className="grey">Minimum Notice</span>
                                        <select className="select">
                                            <option>3 hour</option>
                                        </select>
                                    </div>
                                    <div style={{ width: '49%' }} className="right">
                                        <span className="grey">After Event</span>
                                        <select className="select">
                                            <option>3 hour</option>
                                        </select>

                                        <div className="grey" style={{ fontSize: '13px' }}>
                                            For example, if the potential attendee wants to book the meeting with you tomorrow at 5:00 PM and you have set a minimum notice of 2 hours, they need to submit the booking by 3:00 PM at the latest on the same day.
                                        </div>
                                    </div>
                                </div>

                                <div style={{ justifyContent: 'start', alignItems: 'center' }}>
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            id="toggle1"
                                            className="toggle-checkbox"
                                            checked={isChecked1}
                                            onChange={handleToggle1}
                                        />
                                        <label htmlFor="toggle1" className="toggle-label"></label>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 10px' }}>
                                        <span>Booking frequency</span>
                                        <div style={{ justifyContent: 'start' }}>
                                            <input style={{ width: '10%', textAlign: 'center', borderRadius: '5px', border: '1px solid #919EAB' }} type="text" value={1}></input>
                                            <select style={{ margin: '0px 10px' }} className="select">
                                                <option>per day</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <hr />

                                <div style={{ justifyContent: 'start', alignItems: 'center' }}>
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            id="toggle2"
                                            className="toggle-checkbox"
                                            checked={isChecked2}
                                            onChange={handleToggle2}
                                        />
                                        <label htmlFor="toggle2" className="toggle-label"></label>

                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', margin: 'auto 10px' }}>
                                        Limit book only first slot
                                    </div>
                                </div>

                                <hr />

                                <div style={{ justifyContent: 'start', alignItems: 'center' }}>
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            id="toggle3"
                                            className="toggle-checkbox"
                                            checked={isChecked3}
                                            onChange={handleToggle3}
                                        />
                                        <label htmlFor="toggle3" className="toggle-label"></label>

                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 10px' }}>
                                        <span>Booking frequency</span>
                                        <div style={{ justifyContent: 'start' }}>
                                            <input style={{ width: '10%', textAlign: 'center', borderRadius: '5px', border: '1px solid #919EAB' }} type="text" value={1}></input>
                                            <select style={{ margin: '0px 10px' }} className="select">
                                                <option>per day</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <hr />

                            </div>
                        </motion.div>
                    }
                    {/* Availability */}


                    {/* Limits */}
                </div>
            </div>

            <div className="offcanvas offcanvas-end" id="demo1">
                <div className="offcanvas-header">
                    <h3 className="offcanvas-title">Create Availability</h3>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        data-bs-dismiss="offcanvas"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="setName" className="form-label">
                                Name of Set
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="setName"
                                placeholder="Enter set name"
                            />
                        </div>

                        {availabilitySets.map((set, index) => (
                            <div key={index} className="mb-3">
                                <div className="row">
                                    <div className="col-5">
                                        <input
                                            type="time"
                                            className="form-control"
                                            value={set.fromTime}
                                            onChange={(e) =>
                                                handleTimeChange(index, "fromTime", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="col-2 text-center">-</div>
                                    <div className="col-5">
                                        <input
                                            type="time"
                                            className="form-control"
                                            value={set.toTime}
                                            onChange={(e) =>
                                                handleTimeChange(index, "toTime", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <p>Time Apply on:</p>
                                    <div className="d-flex justify-content-between">
                                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                                            (day) => (
                                                <button
                                                    type="button"
                                                    key={day}
                                                    className={`btn ${set.days.includes(day)
                                                        ? "btn-primary"
                                                        : "btn-outline-dark"
                                                        }`}
                                                    onClick={() => handleDayToggle(index, day)}
                                                >
                                                    {day}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-outline-primary mt-3"
                            onClick={addAvailabilitySet}
                        >
                            Add Availability Set
                        </button>
                    </form>
                    <button type="button" className="btn btn-success mt-4">
                        Save
                    </button>
                </div>
            </div>

            <div className="offcanvas offcanvas-end" id="demo">
                <div className="offcanvas-header">
                    <h3 className="offcanvas-title">Edit Availability</h3>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        data-bs-dismiss="offcanvas"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="setName" className="form-label">
                                Name of Set
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="setName"
                                defaultValue="Working Hours"
                            />
                        </div>

                        {availabilityGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="mb-4 p-3" style={{ border: "1px solid #ccc", borderRadius: "8px" }}>
                                {group.timeSlots.map((slot, slotIndex) => (
                                    <div key={slotIndex} className="row mb-3">
                                        <div className="col-5">
                                            <input
                                                type="time"
                                                className="form-control"
                                                value={slot.startTime}
                                                onChange={(e) =>
                                                    handleTimeChange(groupIndex, slotIndex, "startTime", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-2 text-center">-</div>
                                        <div className="col-5">
                                            <input
                                                type="time"
                                                className="form-control"
                                                value={slot.endTime}
                                                onChange={(e) =>
                                                    handleTimeChange(groupIndex, slotIndex, "endTime", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="btn btn-outline-primary mb-2"
                                    onClick={() => addTimeSlot(groupIndex)}
                                >
                                    +
                                </button>

                                <div className="mt-3">
                                    <p>Time Apply on:</p>
                                    <div className="d-flex justify-content-between">
                                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                                            (day) => (
                                                <button
                                                    type="button"
                                                    key={day}
                                                    className={`btn ${group.selectedDays.includes(day)
                                                        ? "btn-success"
                                                        : "btn-outline-dark"
                                                        }`}
                                                    onClick={() => handleDayToggle(groupIndex, day)}
                                                >
                                                    {day}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="text-end mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeAvailabilityGroup(groupIndex)}
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-outline-primary mt-3"
                            onClick={addAvailabilityGroup}
                        >
                            Add Availability Set
                        </button>
                    </form>

                    <div className="d-flex justify-content-between mt-4">
                        <button type="button" className="btn btn-outline-danger">
                            Delete
                        </button>
                        <button type="button" className="btn btn-success">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePackage;
