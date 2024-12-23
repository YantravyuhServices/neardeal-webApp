import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SideBar from "./SideBar";
import background from "../assets/background.svg";
import leftArrow from "../assets/leftArrow.svg";
import imageUpload from "../assets/imageUpload.svg";
import crossIcon from "../assets/cross.svg";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

const CreatePackage = () => {
  const { id } = useParams();
  const jwtUserToken = Cookies.get("user_token");
  const userData = JSON.parse(jwtUserToken);
  const [active, setActive] = useState("setup");
  const [isChecked, setIsChecked] = useState(false);
  const [images, setImages] = useState([]);
  const [editorStates, setEditorStates] = useState({
    included: { content: "", operations: [] },
    discount: { content: "", operations: [] },
    unit: { content: "", operations: [] },
    tnc: { content: "", operations: [] },
  });
  const [packageTitle, setPackageTitle] = useState("");
  const [inventoryData, setInventoryData] = useState(null);
  const fileInputRef = useRef(null);
  const quillRefs = useRef({ included: null, openingHours: null, tnc: null });

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = () => {
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userDataa = JSON.parse(jwtUserToken);
    try {
      const payload = {
        couponCode: id,
        couponType: "Coupon",
      };
      console.log(payload);
      const response = await fetch(
        "https://wellness.neardeal.me/WAPI/fetchCouponDetails.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const userData = await response.json();
      setInventoryData(userData.message[0]); // Assuming the data is an array
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    if (inventoryData) {
      setPackageTitle(inventoryData.CouponTitle);
      setIsChecked(inventoryData.Status === 1);
      setEditorStates((prev) => ({
        ...prev,
        included: {
          content: inventoryData.WhatsIncluded || "",
          operations: [],
        },
        tnc: { content: inventoryData.TnC || "", operations: [] },
        discount: { content: inventoryData.Discount || "", operations: [] },
        unit: { content: inventoryData.Unit || "", operations: [] },
      }));
    }
  }, [inventoryData]);

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
    console.log('isChecked: ', isChecked);

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
            status: isChecked ? 1 : 0,
            inventoryIds: "V107_I01,V107_I02",
            couponCode: inventoryData.CouponCode,
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
          Edit Coupon
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
                  placeholder="type"
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
                  placeholder="type"
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
