import { useState, useRef, useEffect } from "react";
import "react-quill/dist/quill.snow.css"; // Import Quill's styles
import SideBar from "./SideBar";
import background from "../assets/background.svg";
import leftArrow from "../assets/leftArrow.svg";
import imageUpload from "../assets/imageUpload.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import crossIcon from "../assets/cross.svg";
import image1 from "../assets/bannerImage.svg";
import aaaa from "../assets/bannerLogo.svg";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const EditAdd = () => {
  const { id } = useParams();
  const jwtUserToken = Cookies.get("user_token");
  const userData = JSON.parse(jwtUserToken);
  const [invImgFileName, setInvImgFileName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [images, setImages] = useState(null); // Use a single image instead of an array
  const [isChecked, setIsChecked] = useState(false);
  const fileInputRef = useRef(null);
  const [data, setData] = useState(null);

  const handleRemoveImage = () => {
    setImages(null);
  };

  const handleSubmit = async () => {
    console.log(startDate, endDate, isChecked, invImgFileName);
    
    try {
      const response = await fetch(
        "https://wellness.neardeal.me/WAPI/createAdsMW.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorId: userData.ID,
            campaignId: id,
            campaignTitle: "Store ka nam",
            startDate: startDate,
            endDate: endDate,
            status: isChecked ? 1 : 0,
            imgAdFileName: invImgFileName,
            imgAdBase64: images,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      toast.success("Success");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error:", error);
    }
  };

  const fetchAd = async () => {

    try {
      const response = await fetch(
        "https://wellness.neardeal.me/WAPI/AdsDetailsMW.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaignid: id
          }),
        }
      );

      const data = await response.json();
      console.log(data.message[0]);
      setData(data.message[0]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error:", error);
    }
  };

  useEffect(() => {
    // console.log(data);
    
    fetchAd();
  }, [])

  const handleToggle = () => {
    setIsChecked(!isChecked);
    console.log("Toggle state:", !isChecked);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setInvImgFileName(file.name);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result; // Get the Base64 string from the reader
        const parts = base64String.split(","); // Split the string at the comma
        // console.log("--------", parts); // Now you can log it

        // Update the state with the new data
        setImages(parts[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <img
        style={{ position: "absolute", top: 0, zIndex: "-1", width: "100%" }}
        src={background}
        alt="background"
      />
      <div className="create-package" style={{ width: "80%" }}>
        <span className="heading">
          <Link to="/campaign">
            <img src={leftArrow} alt="left arrow" />
          </Link>{" "}
          Activate Ads
        </span>

        <div>
          <div className="left">
            <button
              className="btn-outline-secondary border-0 active me-2"
              //   onClick={() => setActive("content")}
              style={{ textDecoration: "none" }}
            >
              Content
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="right"
          >
            <div className="header">
              <div
                className="left"
                style={{ display: "flex", flexDirection: "row" }}
              >
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
                <span>Activate</span>
              </div>

              <div className="right">
                <button className="button" onClick={handleSubmit}>
                  Save Changes
                </button>
              </div>
            </div>
            <div className="body">
              <div className="grey">Banner Preview</div>
              <div
                style={{
                  flexDirection: "column",
                  position: "relative",
                  width: "60%",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: "6%",
                    left: "4%",
                    color: "white",
                    flexDirection: "column",
                  }}
                >
                <h3>{data?.CampaignName || ''}</h3>
                  <span>NearDeal Certified</span>
                </div>
                <img style={{ width: "100%", height:'30vh', borderRadius:'10px' }} src={`https://wellness.neardeal.me/WAPI/${data?.ContentLocation || ""}`} alt="banner" />
                <span
                  style={{
                    position: "absolute",
                    color: "white",
                    left: "3%",
                    top: "4%",
                  }}
                >
                  Ad
                </span>
                {/* <img
                  style={{
                    position: "absolute",
                    textAlign: "center",
                    left: "35%",
                    top: "10%",
                    borderRadius: "10px",
                    width: "25%",
                  }}
                  src={aaaa}
                  alt="logo"
                /> */}
                <button
                  style={{
                    position: "absolute",
                    right: "4%",
                    bottom: "6%",
                    padding: "5px 20px",
                    color: "brown",
                    background: "white",
                    border: "none",
                    borderRadius: "20px",
                  }}
                >
                  Visit
                </button>
              </div>

              <div style={{ justifyContent: "start", marginTop: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor="startDate" className="grey">
                    Start Date:
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    style={{
                      padding: "10px 20px",
                      border: "1px solid #E9ECEE",
                      borderRadius: "10px",
                      color: "#637381",
                    }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div
                  style={{
                    margin: "0px 10px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label htmlFor="endDate" className="grey">
                    End Date:
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    style={{
                      padding: "10px 20px",
                      border: "1px solid #E9ECEE",
                      borderRadius: "10px",
                      color: "#637381",
                    }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: "20px" }} className="grey">
                Background Image
              </div>
              <div
                className="image-upload"
                style={{ cursor: "pointer", textAlign: "center" }}
                onClick={handleUploadClick}
              >
                <img src={imageUpload} alt="upload" />
                <span
                  style={{
                    marginTop: "20px",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  Select file
                </span>
                <p className="grey">
                  Drop file here or click{" "}
                  <span style={{ color: "#00A76F" }}>browse</span> through your
                  machine
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  style={{ display: "none" }}
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


              {/* {image && (
                                <div style={{ position: 'relative', margin: '10px' }}>
                                    <img src={image} alt="uploaded" style={{ objectFit: 'cover', width: '100%', height: 'auto' }} />
                                    <button
                                        onClick={handleRemoveImage}
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
                            )} */}

              <div style={{ justifyContent: "end", margin: "10px 0px" }}>
                <button className="button">Upload</button>
              </div>
            </div>
          </motion.div>
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
          </form>
          <button type="button" className="btn btn-success mt-4">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAdd;
