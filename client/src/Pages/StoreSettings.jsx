import { useState, useRef, useEffect } from "react";
import SideBar from "../Components/SideBar";
import 'react-quill/dist/quill.snow.css'; // Import Quill's styles
import background from "../assets/background.svg";
import imageUpload from "../assets/imageUpload.svg";
import edit from "../assets/edit.svg";
import star from "../assets/star.svg";
import { Link } from "react-router-dom";
import clock1 from "../assets/clock1.svg";
import location from "../assets/location.svg";
import email from "../assets/email.svg";
import phone from "../assets/phone.svg";
import { motion } from "framer-motion";
import storeLogo from "../assets/storeSettingsLogo.svg";
import ai from "../assets/aiLogo.svg";
import image1 from '../assets/image1.svg';
import image2 from '../assets/image2.svg';
import aaaa from "../assets/WhatsApp Image 2024-09-12 at 16.48.58_7c2d63d5.jpg";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";

const StoreSetting = () => {
    const jwtUserToken = Cookies.get("user_token");
    const userData = JSON.parse(jwtUserToken);
    const [images, setImages] = useState([]);
    const [packageTitle, setPackageTitle] = useState('');
    const [url, setUrl] = useState('');
    const [duration, setDuration] = useState('');
    const fileInputRef = useRef(null);
    const [storeData, setStoreData] = useState([]);

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

    const handleSaveChanges = () => {
        console.log('Package Title:', packageTitle);
        console.log('URL:', url);
        console.log('Duration:', duration);
        console.log('Images:', images);
    };

    const fetchStore = async () => {
        try {
            const response = await fetch(
                "https://wellness.neardeal.me/WAPI/fetchStoreDetailsMW.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        vendorId: userData.ID,
                    }),
                }
            );

            const data = await response.json();
            console.log('data', data.message);
            setStoreData(data.message[0]);

        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchStore();
    }, [])


    return (
        <div style={{ display: 'flex' }}>
            <SideBar></SideBar>
            <img style={{ position: 'absolute', top: 0, zIndex: '-1', width: '100%' }} src={background}></img>
            <motion.div initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }} className="store" style={{ width: '80%' }}>
                <span className="heading">Store Settings</span>
                <div>
                    <div className="left">
                        <div style={{ flexDirection: 'column', position: 'relative' }}>
                            <img style={{ width: '100%' }} src={image1}></img>
                            <img style={{ position: 'absolute', bottom: '-15%', left: '5%', borderRadius: '10px', width: '20%' }} src={aaaa}></img>
                        </div>
                        <h1 style={{ fontWeight: 'bold', marginTop: '30px' }}>Senmu Farm</h1>
                        <div className="rating">
                            <span>4.3</span>
                            <span><img src={star}></img> <img src={star}></img> <img src={star}></img> <img src={star}></img> <img src={star}></img></span>
                        </div>
                        <p>
                            {storeData.description}
                        </p>
                        <div className="location">
                            <img src={location}></img>
                            <span style={{ margin: '0px 10px' }}>10 Nathan Road, Mong Kok</span>
                        </div>
                        <div className="time">
                            <img src={clock1}></img>
                            <span style={{ margin: '10px 10px' }}>10:00 am - 8:00 pm</span>
                        </div>
                        <div className="social-media">
                            <img style={{ width: '80px' }} src={email}></img>
                            <img style={{ margin: '10px 10px', width: '80px' }} src={phone}></img>
                        </div>
                    </div>

                    <div className="right">
                        <div className="header">
                            <div className="right" style={{ width: '25%' }}>
                                <button className="button" onClick={handleSaveChanges}>Save Changes</button>
                            </div>
                        </div>
                        <motion.div initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }} className=" body">
                            <div className="body">
                                <input
                                    name="packageTitle"
                                    className="package-title"
                                    type="text"
                                    placeholder="Senmu Farm"
                                    value={packageTitle}
                                    onChange={handleInputChange}
                                />

                                <div className="grey" style={{ marginTop: '20px' }}>Stroe Icon</div>
                                <div
                                    style={{ cursor: 'pointer', textAlign: 'center' }}
                                    onClick={handleUploadClick}
                                >
                                    <img src={storeLogo} alt="upload" />
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                {/* <div className="grey" style={{ marginTop: '20px' }}>Banner image</div>
                                <Link style={{ textDecoration:'none', border:'1px solid black', width:'fit-content', padding:'5px', borderRadius:'20px' }}><img src={ai} /> Generate Image with Near.AI</Link> */}

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
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ justifyContent: "end" }}>
                                    <button style={{ borderRadius: '5px', padding: '0px 10px', margin: '0px 10px' }}>Remove All</button>
                                    <button className="button">Upload</button>
                                </div>
                                <div className="grey" style={{ marginTop: '20px' }}>Description</div>
                                <div className="text-section" style={{ padding: '10px 10px' }} contentEditable>
                                    {storeData.description}
                                </div>

                                <div className="grey" style={{ marginTop: '20px' }}>Contact Email</div>
                                <div className="text-section" style={{ padding: '10px 10px' }} contentEditable>
                                    {storeData.emailAddress}
                                </div>

                                <div className="grey" style={{ marginTop: '20px' }}>Phone</div>
                                <div className="text-section" style={{ padding: '10px 10px' }} contentEditable>
                                    {storeData.contactNo}
                                </div>

                                <div className="grey" style={{ marginTop: '20px' }}>Address</div>
                                <div className="text-section" style={{ padding: '10px 10px' }} contentEditable>
                                    10 Nathan Road, Mong Kok
                                </div>

                                <div className="grey" style={{ marginTop: '20px' }}>Availability</div>
                                <div className="text-section" style={{ padding: '10px 10px' }} contentEditable>
                                    <div>
                                        <div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>Working hours</span>
                                                <span className="grey">Mon - sat, 9:00 AM - 1:00 PM</span>
                                                <span className="grey">Mon - sat, 3:00 AM - 8:45 PM</span>
                                                <span className="grey">Sun,</span>
                                            </div>
                                        </div>
                                        <img src={edit}></img>
                                    </div>
                                </div>

                                {/* <div>
                                    <button className="button" onClick={handleSaveChanges}>Save changes</button>
                                </div> */}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

        </div>
    )
}

export default StoreSetting