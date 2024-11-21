import { useState, useRef, useEffect } from "react";
import SideBar from "../Components/SideBar";
import 'react-quill/dist/quill.snow.css'; // Import Quill's styles
import background from "../assets/background.svg";
import imageUpload from "../assets/imageUpload.svg";
import edit from "../assets/edit.svg";
import star from "../assets/star.svg";
import clock1 from "../assets/clock1.svg";
import banner from "../assets/bannerImage.svg";
import location from "../assets/location.svg";
import email from "../assets/email.svg";
import phone from "../assets/phone.svg";
import { motion } from "framer-motion";
import storeLogo from "../assets/storeSettingsLogo.svg";
import { toast } from "react-toastify";
import crossIcon from "../assets/cross.svg";
import Cookies from 'js-cookie';

const StoreSetting = () => {
    const jwtUserToken = Cookies.get("user_token");
    const [description, setDescription] = useState('');
    const [storeName, setStoreName] = useState('');
    const [address, setAddress] = useState('');
    const [workingHours, setWorkingHours] = useState('');
    const userData = JSON.parse(jwtUserToken);
    const [images, setImages] = useState([]);
    const [invImgFileName, setInvImgFileName] = useState('');
    const [packageTitle, setPackageTitle] = useState('');
    const fileInputRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState('');  // Change from an array to a string
    const [storeData, setStoreData] = useState({
        description: '',
        emailAddress: '',
        contactNo: '',
        address: '',
        storeName: '',
        workingHours: '',
        store_logo: '',
        store_image: '',
        rating: '',
        packageTitle: ''
    });

    const handleRemoveImage = () => {
        setImages(null);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [];
        files.forEach(file => {
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {

                    const base64String = reader.result.split(",")[1];
                    newImages.push(base64String);
                    if (newImages.length === files.length) {
                        setImages(prevImages => [...prevImages, ...newImages]);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];  // Only expect one file for the logo
        if (file) {
            setLogoName(file.name); // Set the logo file name
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1];  // Get base64 string (without the header)
                setLogo(base64String);  // Set the base64 string directly to logo state
            };
            reader.readAsDataURL(file);  // Read the image file as a data URL (base64)
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStoreData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSaveChanges = async () => {
        console.log(userData.ID);
        console.log(storeData.contactNo);
        console.log(storeData.address);
        console.log(storeData.description);
        console.log(storeData.workingHours);
        console.log(logo);
        // console.log(images[0]);


        try {
            const response = await fetch(
                "https://wellness.neardeal.me/WAPI/merchantProfileUpdatesMW.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "userid": userData.ID,
                        "userName": userData.vendorName,
                        "contactno": storeData.contactNo,
                        "storeaddress": storeData.address,
                        "category": "[Spa, Sauna, Gym]",
                        "description": storeData.description,
                        "city": "Hong Kong",
                        "country": "Hong Kong",
                        "zip": "XYZ 456",
                        "storeimage_name": invImgFileName,
                        "storelogo_name": logoName,
                        "workingHours": storeData.workingHours,
                        "storelogo": images[0],
                        "storeimage": images[0]
                    }),
                }
            );

            const data = await response.json();
            toast.success("Changes saved successfully");
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to save changes");
        }
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
            setStoreData(data.message[0] || {});
            setAddress(data.message[0].address);
            // console.log('====================================');
            console.log(data.message[0]);
            // console.log('====================================');
            setDescription(data.message[0].description);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchStore();
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <img style={{ position: 'absolute', top: 0, zIndex: '-1', width: '100%' }} src={background} alt="background" />
            <motion.div initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }} className="store mainSec" style={{ width: '80%' }}>
                <span className="secHead">Store Setting</span>
                <div>
                    <div className="left">
                        <div style={{ flexDirection: 'column', position: 'relative' }}>
                            <img style={{ width: '100%' }} src={banner} alt="store logo" />
                            <img style={{ position: 'absolute', bottom: '-15%', left: '5%', borderRadius: '10px', width: '20%' }} src={`https://wellness.neardeal.me/WAPI/${storeData.store_image}`} alt="upload" />
                        </div>
                        <h1 style={{ fontWeight: 'bold', marginTop: '30px' }}>{storeData.storeName || 'Store Name'}</h1>
                        <div className="rating">
                            <span>{storeData.rating || 'N/A'}</span>
                            <span>
                                {[...Array(5)].map((_, index) => (
                                    <img key={index} src={star} alt="star" />
                                ))}
                            </span>
                        </div>
                        <p>{description || 'No description available'}</p>
                        <div className="location">
                            <img src={location} alt="location" />
                            <span style={{ margin: '0px 10px' }}>{address || 'No address available'}</span>
                        </div>
                        <div className="time">
                            <img src={clock1} alt="clock" />
                            <span style={{ margin: '10px 10px' }}>{storeData.workingHours || 'N/A'}</span>
                        </div>
                        <div className="social-media">
                            <img style={{ width: '80px' }} src={email} alt="email" />
                            <img style={{ margin: '10px 10px', width: '80px' }} src={phone} alt="phone" />
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
                            transition={{ duration: 1 }} className="body">
                            <div className="body">
                                <input
                                    name="packageTitle"
                                    className="package-title"
                                    type="text"
                                    placeholder="Store Name"
                                    value={packageTitle}  
                                    onChange={(e) => setPackageTitle(e.target.value)}  
                                />

                                <div className="grey" style={{ marginTop: '20px' }}>Store Icon</div>
                                <div style={{ cursor: 'pointer', textAlign: 'center' }} onClick={handleUploadClick}>
                                    <img src={storeLogo} alt="upload" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                <div className="image-upload" style={{ cursor: 'pointer', textAlign: 'center', marginTop: '20px' }} onClick={handleUploadClick}>
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
                                            src={`data:image/jpeg;base64,${images[0]}`}
                                            style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
                                            alt="Store"
                                        />
                                        <img
                                            src={crossIcon}
                                            alt="remove"
                                            style={{
                                                position: 'absolute',
                                                top: '5px',
                                                right: '5px',
                                                width: '20px',
                                                cursor: 'pointer',
                                            }}
                                            onClick={handleRemoveImage}
                                        />
                                    </div>
                                )}
                                <div className="grey" style={{ marginTop: '20px' }}>Description</div>
                                <input
                                    name="description"
                                    className="text-section"
                                    type="text"
                                    value={storeData.description || 'No description available'}
                                    onChange={handleInputChange}
                                />

                                <div className="grey" style={{ marginTop: '20px' }}>Contact Email</div>
                                <input
                                    name="emailAddress"
                                    className="text-section"
                                    type="email"
                                    value={storeData.emailAddress || 'No email available'}
                                    onChange={handleInputChange}
                                />

                                <div className="grey" style={{ marginTop: '20px' }}>Phone</div>
                                <input
                                    name="contactNo"
                                    className="text-section"
                                    type="tel"
                                    value={storeData.contactNo || 'No phone number available'}
                                    onChange={handleInputChange}
                                />

                                <div className="grey" style={{ marginTop: '20px' }}>Address</div>
                                <input
                                    name="address"
                                    className="text-section"
                                    type="text"
                                    value={storeData.address || 'No address available'}
                                    onChange={handleInputChange}
                                />

                                <div className="grey" style={{ marginTop: '20px' }}>Availability</div>
                                <input
                                    name="workingHours"
                                    className="text-section"
                                    type="text"
                                    value={storeData.workingHours || 'No hours available'}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default StoreSetting;
