import React, { useState, useRef, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SideBar from "./SideBar";
import background from "../assets/background.svg";
import leftArrow from "../assets/leftArrow.svg";
import imageUpload from "../assets/imageUpload.svg";
import crossIcon from "../assets/cross.svg";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CreatePackage = () => {
  const jwtUserToken = Cookies.get("user_token");
  const userData = JSON.parse(jwtUserToken);
  const [active, setActive] = useState("setup");
  const [isChecked, setIsChecked] = useState(false);
  const [invImgFileName, setInvImgFileName] = useState("");
  const [images, setImages] = useState([]);
  const [editorStates, setEditorStates] = useState({
    included: { content: "", operations: [] },
    openingHours: { content: "", operations: [] },
    tnc: { content: "", operations: [] },
    status: { content: false, operations: [] },
    discount: { content: "", operations: [] }, // Initialize discount
    unit: { content: "", operations: [] }, // Initialize unit with a default value
  });

  const [packageTitle, setPackageTitle] = useState("");
  const fileInputRef = useRef(null);
  const quillRefs = useRef({ included: null, openingHours: null, tnc: null });

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);

    // Update editorStates for status
    setEditorStates((prevStates) => ({
      ...prevStates,
      status: {
        content: newValue, // Set status content
        operations: [...prevStates.status.operations], // Keep previous operations
      },
    }));
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

  const handleRemoveImage = (index) => {
    setImages(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "packageTitle":
        setPackageTitle(value);
        break;
      default:
        break;
    }
  };

  const updateEditorState = useCallback(
    (editorKey, delta, oldDelta, source) => {
      setEditorStates((prevStates) => {
        const updatedOperations = [
          ...prevStates[editorKey].operations,
          { delta, oldDelta, source },
        ];
        return {
          ...prevStates,
          [editorKey]: {
            ...prevStates[editorKey],
            operations: updatedOperations,
          },
        };
      });
    },
    []
  );

  const handleSaveChanges = async () => {

    try {
      const response = await fetch(
        "https://wellness.neardeal.me/WAPI/updateCouponsMW.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorId: userData.ID,
            title: packageTitle,
            startDate: "2024-10-01",
            endDate: "2024-10-15",
            discount: editorStates.discount.content,
            unit: editorStates.unit.content || "%",
            whatsIncluded: editorStates.included.content,
            tnc: editorStates.tnc.content,
            status: editorStates.status.content,
            inventoryIds: "V107_I01,V107_I02",
            couponCode: "",
            couponType: "Coupon",
            currency: "HKD",
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      toast.success("Successfully Created Coupon");
    } catch (error) {
      console.error("Error:", error);
    }
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
          Create Coupon
        </span>

        <div>
          <div className="left">
            <button
              onClick={() => setActive("setup")}
              className={`${active === "setup" ? "btn active" : "btn"}`}
            >
              Coupon Setup
            </button>
            <button
              className={`${active === "availability" ? "btn active" : "btn"}`}
            >
              Analytics (Soon)
            </button>
          </div>

          {active === "setup" && (
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
                  <span>Publish</span>
                </div>
                <div className="right">
                  <button className="button" onClick={handleSaveChanges}>
                    Save Changes
                  </button>
                </div>
              </div>
              <div className="body">
                <input
                  name="packageTitle"
                  className="package-title"
                  type="text"
                  placeholder="Campaign Title"
                  value={packageTitle}
                  onChange={handleInputChange}
                />

                <div className="image-upload" onClick={handleUploadClick}>
                  <img src={imageUpload} alt="upload" />
                  <span>Select files</span>
                  <input
                    type="file"
                    multiple
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


                <div className="grey mt-2">Discount Amount</div>
                <input
                  type="number"
                  value={editorStates.discount.content}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Only allow positive integers
                    if (/^\d*$/.test(value)) {
                      setEditorStates((prevStates) => ({
                        ...prevStates,
                        discount: {
                          content: value,
                          operations: prevStates.discount.operations,
                        },
                      }));
                      updateEditorState("discount", value, null, "user");
                    }
                  }}
                  style={{ width: "5rem" }}
                  className="text-area px-2  text-center number-arrow-hidden"
                  placeholder="type"
                  ref={(el) => {
                    if (el) {
                      quillRefs.current.discount = el; // No need for getEditor, just referencing the input element
                    }
                  }}
                />

                <div className="grey mt-2">Discount Unit</div>
                <div className="discount-unit-options">
                  <div className="flex flex-column mb-1">
                    <label>
                      <input
                        type="radio"
                        name="unit"
                        value="$"
                        checked={editorStates.unit.content === "$"}
                        onChange={(e) => {
                          setEditorStates((prevStates) => ({
                            ...prevStates,
                            unit: {
                              content: e.target.value,
                              operations: prevStates.unit.operations,
                            },
                          }));
                          updateEditorState(
                            "unit",
                            e.target.value,
                            null,
                            "user"
                          );
                        }}
                      />{" "}
                      $
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="unit"
                        value="%"
                        checked={editorStates.unit.content === "%"}
                        onChange={(e) => {
                          setEditorStates((prevStates) => ({
                            ...prevStates,
                            unit: {
                              content: e.target.value,
                              operations: prevStates.unit.operations,
                            },
                          }));
                          updateEditorState(
                            "unit",
                            e.target.value,
                            null,
                            "user"
                          );
                        }}
                      />{" "}
                      %
                    </label>
                  </div>
                </div>

                <div className="grey">What's included</div>
                <ReactQuill
                  value={editorStates.included.content}
                  onChange={(content, delta, source) => {
                    setEditorStates((prevStates) => ({
                      ...prevStates,
                      included: {
                        content,
                        operations: prevStates.included.operations,
                      },
                    }));
                    updateEditorState("included", delta, null, source);
                  }}
                  className="text-area"
                  placeholder="Type here"
                  ref={(el) => {
                    if (el) {
                      quillRefs.current.included = el.getEditor();
                      quillRefs.current.included.on(
                        "text-change",
                        (delta, oldDelta, source) =>
                          updateEditorState("included", delta, oldDelta, source)
                      );
                    }
                  }}
                />

                <div className="grey">TNC</div>
                <ReactQuill
                  value={editorStates.tnc.content}
                  onChange={(content, delta, source) => {
                    setEditorStates((prevStates) => ({
                      ...prevStates,
                      tnc: { content, operations: prevStates.tnc.operations },
                    }));
                    updateEditorState("tnc", delta, null, source);
                  }}
                  className="text-area"
                  placeholder="Type here"
                  ref={(el) => {
                    if (el) {
                      quillRefs.current.tnc = el.getEditor();
                      quillRefs.current.tnc.on(
                        "text-change",
                        (delta, oldDelta, source) =>
                          updateEditorState("tnc", delta, oldDelta, source)
                      );
                    }
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

CreatePackage.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    ["link"],
    [{ align: [] }],
    ["clean"],
  ],
};

CreatePackage.formats = [
  "header",
  "font",
  "list",
  "bullet",
  "bold",
  "italic",
  "underline",
  "link",
  "align",
  "clean",
];

export default CreatePackage;
