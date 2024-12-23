import { useState, useRef } from "react";
import 'react-quill/dist/quill.snow.css';
import SideBar from "./SideBar";
import background from "../assets/background.svg";
import leftArrow from "../assets/leftArrow.svg";
import imageUpload from "../assets/imageUpload.svg";
import crossIcon from "../assets/cross.svg";
import dot from "../assets/dot.svg"
import edit from "../assets/edit.svg"
import ai from "../assets/aiLogo.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";

const CreatePackage = () => {
    const jwtUserToken = Cookies.get("user_token");
    const userData = JSON.parse(jwtUserToken);
    const [active, setActive] = useState('setup');
    const [reel, setReel] = useState(''); 
    const isActive = (path) => {
        return active === path ? 'btn' : ''
    };
    const [isChecked, setIsChecked] = useState(false);
    const [images, setImages] = useState(null);
    const [date, setDate] = useState('');
    const [packageTitle, setPackageTitle] = useState('');
    const fileInputRef = useRef(null);

    const handleUpload = async () => {
        if (!images) {
            toast.error("Please select a file to upload.");
            return;
        }
    
        const formdata = new FormData();
        formdata.append("userid", userData.ID);
        formdata.append("camtype", "Reel");
        formdata.append("fileToUpload", images); // Use the file directly from the state
    
        try {
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow",
            };
            
            const response = await fetch("https://wellness.neardeal.me/WAPI/uploadMediaFile.php", requestOptions);
        
            const data = await response.json();
            // console.log(data);
            setReel(data.message);
            toast.success("Successfully Uploaded");
    
        } catch (error) {
            console.error("Error:", error);
            toast.error("Upload failed: " + error.message);
        }
    };

    const handleToggle = () => {
        setIsChecked(!isChecked);
        console.log('Toggle state:', !isChecked);
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        console.log(files[0]);
        setImages(files[0]);
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
        console.log(fileInputRef);

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'packageTitle':
                setPackageTitle(value);
                break;
            default:
                break;
        }
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(
                "https://wellness.neardeal.me/WAPI/updateNearReelMW.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "vendorId": userData.ID,
                        "campaignTitle": packageTitle,
                        "reelDate": date,
                        "status": isChecked,
                        "reelFilePath": reel,
                        "reelBase64": reel
                    }),
                }
            );

            const data = await response.json();
            console.log(data);
            toast.success("Successfully Created NearReel");

        } catch (error) {
            console.error("Error:", error);
        }
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
                                <input style={{ width: '35%', padding: '10px 20px', border: '2px solid #E9ECEE', color: '#637381', borderRadius: '10px' }} type="date" value={date} onChange={(e) => { setDate(e.target.value) }} placeholder="Valid Date & time"></input>

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
                                        accept=""
                                        onChange={handleImageUpload}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                                <div style={{ justifyContent: "end" }}>
                                    <button style={{ borderRadius: '5px', padding: '0px 10px', margin: '0px 10px' }}>Remove All</button>
                                    <button onClick={handleUpload} className="button">Upload</button>
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
