import React, { useState,useEffect, useRef, useCallback } from 'react';
import SideBar from '../Components/SideBar';
import v1 from '../assets/video1.svg';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Cookies from 'js-cookie';
import imageUpload from "../assets/imageUpload.svg";
import crossIcon from "../assets/cross.svg";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const NearAI = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    // Function to toggle modal visibility
    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };
    const [isLoading, setIsLoading] = useState(false); 
    const jwtUserToken = Cookies.get("user_token");
    const userData = JSON.parse(jwtUserToken);
    const [packageTitle, setPackageTitle] = useState('');
    const [images, setImages] = useState([]);
    const [videoURL, setvideoURL] = useState('');
    const [scriptContent, setScriptContent] = useState('');
    const [selectedSections, setSelectedSections] = useState([]);
    const [language, setLanguage] = useState([]);
    const [font, setFont] = useState([]);
    const [voice, setVoice] = useState([]);
    const fileInputRef = useRef(null);

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

    const getLanguages = async () => {
        const token = "3e61107713dd29dd11db3d9d758d74915f236209"; // Replace with your actual token
        try {
          const response = await fetch("https://ext.videogen.io/v1/get-languages", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
    
          const data = await response.json();
          setLanguage(data.languages);
          console.log("Error fetching data:", language);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };


    const getFonts = async () => {
        const token = "3e61107713dd29dd11db3d9d758d74915f236209"; // Replace with your actual token
    
        try {
          const response = await fetch("https://ext.videogen.io/v1/get-fonts", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
    
          const data = await response.json();
          setFont(data.fonts);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };


      const getVoices = async () => {
        const token = "3e61107713dd29dd11db3d9d758d74915f236209"; // Replace with your actual token
    
        try {
          const response = await fetch("https://ext.videogen.io/v1/get-voices", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
    
          const data = await response.json();
          setVoice(data.voices);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
        getLanguages();
        getFonts();
        getVoices();
      }, []);

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSaveChanges = async() => {
        setIsLoading(true);
        const token = "3e61107713dd29dd11db3d9d758d74915f236209"; // Replace with your actual token
    
        try {
          const response = await fetch("https://ext.videogen.io/v1/script-to-video", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body:JSON.stringify({'script':scriptContent})
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
    
          const data = await response.json();
          console.log(data.apiFileId);
            getVideo(data.apiFileId);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
    };

    const getVideo = async(apiFileId) => {
        console.log(apiFileId);
        const token = "3e61107713dd29dd11db3d9d758d74915f236209"; // Replace with your actual token
        try {
          const response = await fetch(`https://ext.videogen.io/v1/get-file?apiFileId=${apiFileId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
          const data = await response.json();
          if (data.loadingState === "FULFILLED" && data.apiFileSignedUrl) {
            console.log(data);
            setvideoURL(data.apiFileSignedUrl);
            setIsLoading(false);
            toggleModal();
          } else if (data.loadingState === "REJECTED") {
            console.error("Video generation failed:", data.errorDisplayMessage);
          }else{
            setTimeout(() => {
                getVideo(apiFileId);
              }, 500);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <SideBar></SideBar>
            <div className="nearai-main" style={{ width: '100%', padding: '1% 0% 0% 1%' }}>
                {/* Header */}
                <header className="d-flex justify-content-between align-items-center py-3">
                    {/* font-weight: 900;
    font-size: 3rem; */}
                    <h1 className="ms-4 secHead" style={{ color: 'white' }}>Near.AI</h1>
                    <div className="me-4" style={{ background: 'white' }}>
                        <input
                            type="text"
                            className="form-control text-white"
                            placeholder="Search..."
                        />
                    </div>
                </header>

                {/* Media Selection Buttons */}
                <div className="d-flex justify-content-center gap-4 my-4">
                    <div>
                        {/* SVG for Video */}
                        {/* ... */}
                    </div>

                    <div>
                        {/* SVG for another option */}
                        {/* ... */}
                    </div>

                    <div>
                        {/* SVG for third option */}
                        {/* ... */}
                    </div>
                </div>

                {/* Video Grid */}
                <div className="row g-4 justify-content-start px-5">
                    <div className="col-md-3" onClick={toggleModal}>
                        <svg width="267" height="148" viewBox="0 0 267 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="266.75" height="148" rx="8" fill="white" fillOpacity="0.2" />
                            <path d="M27 85V99M20 92H34" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M24.4013 115.818V126H22.5419L18.1122 119.592H18.0376V126H15.8849V115.818H17.7741L22.169 122.222H22.2585V115.818H24.4013ZM29.6202 126.149C28.8347 126.149 28.1586 125.99 27.5918 125.672C27.0283 125.35 26.5942 124.896 26.2892 124.31C25.9843 123.72 25.8319 123.022 25.8319 122.217C25.8319 121.431 25.9843 120.742 26.2892 120.148C26.5942 119.555 27.0234 119.093 27.5769 118.761C28.1337 118.43 28.7866 118.264 29.5357 118.264C30.0395 118.264 30.5085 118.345 30.9426 118.508C31.3801 118.667 31.7613 118.907 32.0861 119.229C32.4142 119.55 32.6694 119.955 32.8517 120.442C33.034 120.926 33.1252 121.492 33.1252 122.142V122.724H26.677V121.411H31.1316C31.1316 121.106 31.0653 120.836 30.9327 120.601C30.8001 120.366 30.6162 120.182 30.3809 120.049C30.1489 119.913 29.8787 119.845 29.5705 119.845C29.249 119.845 28.964 119.92 28.7154 120.069C28.4701 120.215 28.2779 120.412 28.1387 120.661C27.9995 120.906 27.9282 121.179 27.9249 121.481V122.729C27.9249 123.107 27.9945 123.433 28.1337 123.708C28.2762 123.983 28.4767 124.195 28.7353 124.344C28.9938 124.494 29.3004 124.568 29.655 124.568C29.8903 124.568 30.1058 124.535 30.3013 124.469C30.4969 124.402 30.6642 124.303 30.8034 124.17C30.9426 124.038 31.0487 123.875 31.1216 123.683L33.0804 123.812C32.981 124.283 32.7772 124.694 32.4689 125.045C32.164 125.393 31.7696 125.665 31.2857 125.861C30.8051 126.053 30.2499 126.149 29.6202 126.149ZM35.959 126L33.8809 118.364H36.0236L37.2069 123.494H37.2765L38.5094 118.364H40.6124L41.8652 123.464H41.9299L43.0932 118.364H45.231L43.1578 126H40.9157L39.6032 121.197H39.5087L38.1962 126H35.959ZM51.4803 115.818L53.9412 123.554H54.0357L56.5016 115.818H58.888L55.378 126H52.6039L49.089 115.818H51.4803ZM60.0737 126V118.364H62.1916V126H60.0737ZM61.1376 117.379C60.8227 117.379 60.5526 117.275 60.3272 117.066C60.1052 116.854 59.9941 116.6 59.9941 116.305C59.9941 116.014 60.1052 115.763 60.3272 115.555C60.5526 115.343 60.8227 115.237 61.1376 115.237C61.4525 115.237 61.7209 115.343 61.943 115.555C62.1684 115.763 62.2811 116.014 62.2811 116.305C62.2811 116.6 62.1684 116.854 61.943 117.066C61.7209 117.275 61.4525 117.379 61.1376 117.379ZM66.7021 126.124C66.122 126.124 65.5967 125.975 65.1261 125.677C64.6587 125.375 64.2875 124.933 64.0124 124.349C63.7406 123.763 63.6048 123.044 63.6048 122.192C63.6048 121.317 63.7456 120.589 64.0273 120.009C64.3091 119.426 64.6836 118.99 65.1509 118.702C65.6216 118.41 66.137 118.264 66.6971 118.264C67.1246 118.264 67.4809 118.337 67.766 118.483C68.0543 118.625 68.2863 118.804 68.462 119.02C68.641 119.232 68.7769 119.441 68.8697 119.646H68.9343V115.818H71.0472V126H68.9592V124.777H68.8697C68.7702 124.989 68.6294 125.2 68.4471 125.408C68.2681 125.614 68.0344 125.785 67.7461 125.92C67.4611 126.056 67.113 126.124 66.7021 126.124ZM67.3732 124.439C67.7146 124.439 68.003 124.346 68.2383 124.161C68.4769 123.972 68.6592 123.708 68.7852 123.37C68.9144 123.032 68.979 122.636 68.979 122.182C68.979 121.728 68.9161 121.333 68.7901 120.999C68.6642 120.664 68.4819 120.405 68.2433 120.223C68.0046 120.041 67.7146 119.95 67.3732 119.95C67.0252 119.95 66.7319 120.044 66.4933 120.233C66.2546 120.422 66.074 120.684 65.9513 121.018C65.8287 121.353 65.7674 121.741 65.7674 122.182C65.7674 122.626 65.8287 123.019 65.9513 123.36C66.0773 123.698 66.2579 123.963 66.4933 124.156C66.7319 124.344 67.0252 124.439 67.3732 124.439ZM76.2686 126.149C75.4831 126.149 74.807 125.99 74.2402 125.672C73.6768 125.35 73.2426 124.896 72.9377 124.31C72.6328 123.72 72.4803 123.022 72.4803 122.217C72.4803 121.431 72.6328 120.742 72.9377 120.148C73.2426 119.555 73.6718 119.093 74.2253 118.761C74.7821 118.43 75.4351 118.264 76.1841 118.264C76.6879 118.264 77.1569 118.345 77.5911 118.508C78.0286 118.667 78.4097 118.907 78.7346 119.229C79.0627 119.55 79.3179 119.955 79.5002 120.442C79.6825 120.926 79.7736 121.492 79.7736 122.142V122.724H73.3255V121.411H77.78C77.78 121.106 77.7137 120.836 77.5811 120.601C77.4486 120.366 77.2646 120.182 77.0293 120.049C76.7973 119.913 76.5272 119.845 76.2189 119.845C75.8974 119.845 75.6124 119.92 75.3638 120.069C75.1185 120.215 74.9263 120.412 74.7871 120.661C74.6479 120.906 74.5766 121.179 74.5733 121.481V122.729C74.5733 123.107 74.6429 123.433 74.7821 123.708C74.9247 123.983 75.1252 124.195 75.3837 124.344C75.6422 124.494 75.9488 124.568 76.3034 124.568C76.5388 124.568 76.7542 124.535 76.9498 124.469C77.1453 124.402 77.3127 124.303 77.4519 124.17C77.5911 124.038 77.6971 123.875 77.7701 123.683L79.7289 123.812C79.6294 124.283 79.4256 124.694 79.1174 125.045C78.8124 125.393 78.418 125.665 77.9341 125.861C77.4535 126.053 76.8984 126.149 76.2686 126.149ZM84.606 126.149C83.8337 126.149 83.1659 125.985 82.6025 125.657C82.0423 125.326 81.6098 124.865 81.3049 124.275C80.9999 123.682 80.8475 122.994 80.8475 122.212C80.8475 121.423 80.9999 120.733 81.3049 120.143C81.6098 119.55 82.0423 119.089 82.6025 118.761C83.1659 118.43 83.8337 118.264 84.606 118.264C85.3783 118.264 86.0444 118.43 86.6046 118.761C87.168 119.089 87.6022 119.55 87.9071 120.143C88.2121 120.733 88.3645 121.423 88.3645 122.212C88.3645 122.994 88.2121 123.682 87.9071 124.275C87.6022 124.865 87.168 125.326 86.6046 125.657C86.0444 125.985 85.3783 126.149 84.606 126.149ZM84.6159 124.509C84.9673 124.509 85.2606 124.409 85.4959 124.21C85.7312 124.008 85.9086 123.733 86.0279 123.385C86.1505 123.037 86.2118 122.641 86.2118 122.197C86.2118 121.753 86.1505 121.357 86.0279 121.009C85.9086 120.661 85.7312 120.385 85.4959 120.183C85.2606 119.981 84.9673 119.88 84.6159 119.88C84.2613 119.88 83.963 119.981 83.7211 120.183C83.4824 120.385 83.3018 120.661 83.1792 121.009C83.0598 121.357 83.0002 121.753 83.0002 122.197C83.0002 122.641 83.0598 123.037 83.1792 123.385C83.3018 123.733 83.4824 124.008 83.7211 124.21C83.963 124.409 84.2613 124.509 84.6159 124.509Z" fill="white" />
                        </svg>
                    </div>

                    <div className="col-md-3">
                        <img src={v1} alt="Video Thumbnail" />
                    </div>
                </div>
    <div className='d-flex justify-content-center m-2 my-4'>
      {videoURL ? (
        <video controls width="640" height="360">
          <source src={videoURL} type="video/mp4" />
          {/* Your browser does not support the video tag. */}
        </video>
      ) : (
        <p></p>
      )}
    </div>


                {/* Bootstrap Modal */}
                {isModalOpen && (
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                        className="right"
                                    >
                                        <div className="header">
                                            <div className="right" style={{ display: 'flex', justifyContent: 'end' }}>
                                                <button className="button" onClick={handleSaveChanges}>Generate</button>
                                            </div>
                                        </div>

                                        <div className="body">
                                            <div className="image-select">
                                                {images.map((image, index) => (
                                                    <div key={index} style={{ position: 'relative' }}>
                                                        <img src={`data:image/jpeg;base64,${image}`} alt={`uploaded ${index}`} />
                                                        <button
                                                            onClick={() => handleRemoveImage(index)}
                                                            style={{ position: 'absolute', top: '5px', right: '5px' }}
                                                        >
                                                            <img src={crossIcon} alt="remove" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="grey">Script</div>
                                            <ReactQuill
                                                value={scriptContent}
                                                onChange={setScriptContent}
                                                className="text-area"
                                                placeholder="Write your script here"
                                            />
                                            <div style={{ display: 'flex', justifyContent:'space-around', margin:'10px 0px' }}>
                                                <div>
                                                    <div className="grey">Language</div>
                                                    <select
                                                        value={language}
                                                        onChange={(e) => setLanguage(e.target.value)}
                                                        style={{ width: '100%', height: '40px' }}
                                                    >
                                                        {
                                                            language.map((languagess)=>(
                                                                <option value={languagess['languageCode']}>{languagess['languageName']}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div>
                                                    <div className="grey">Font</div>
                                                    <select
                                                        value={font}
                                                        onChange={(e) => setFont(e.target.value)}
                                                        style={{ width: '100%', height: '40px' }}
                                                    >
                                                        {
                                                            font.map((fontts)=>(
                                                                <option value={fontts['fontName']}>{fontts['fontName']}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div>
                                                    <div className="grey">Voice</div>
                                                    <select
                                                        value={voice}
                                                        onChange={(e) => setVoice(e.target.value)}
                                                        style={{ width: '100%', height: '40px' }}
                                                    >
                                                        {/* <option value="Default">Default</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Neutral">Neutral</option> */}


                                                        {
                                                            voice.map((voiceees)=>(
                                                                <option value={voiceees['name']}>{voiceees['name']}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                                {isLoading &&<div className='position-relative'><div className="position-absolute top-50 start-50 translate-middle"><div className='loader'></div></div></div>}
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={toggleModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Styling to keep modal's backdrop */}
            <style jsx>{`
                .modal.show.d-block {
                    display: block;
                    background-color: rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </div>
    );
};

export default NearAI;
