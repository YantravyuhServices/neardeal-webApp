import { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import SideBar from "./SideBar";
import background from "../assets/background.svg";
import leftArrow from "../assets/leftArrow.svg";
import product from "../assets/product.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";

const CreatePackage = () => {
    const jwtUserToken = Cookies.get("user_token");
    const userData = JSON.parse(jwtUserToken);
    const [active, setActive] = useState('setup');
    const isActive = (path) => (active === path ? 'btn' : '');
    const [isChecked, setIsChecked] = useState(false);
    const [packageTitle, setPackageTitle] = useState('');
    const [inventory, setInventory] = useState([]);
    const [selectedIds, setSelectedIds] = useState(''); // State for selected product IDs

    const handleToggle = () => {
        setIsChecked(!isChecked);
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

    const handleCheckboxChange = (id) => {
        setSelectedIds((prev) => {
            const currentIds = prev.split(',').filter(Boolean); // Split and filter empty values
            if (currentIds.includes(id)) {
                // If already selected, remove it
                return currentIds.filter(item => item !== id).join(',');
            } else {
                // If not selected, add it
                return [...currentIds, id].join(',');
            }
        });
    };

    const fetchInventory = async () => {
        try {
            const response = await fetch(
                "https://wellness.neardeal.me/WAPI/invListingMW.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "vendorId": userData.ID,
                        "invCat": "All",
                        "fetchType": "List"
                    }),
                }
            );

            const data = await response.json();
            setInventory(data.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

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
                        "vendorId": userData.ID,
                        "title": packageTitle,
                        "startDate": "",
                        "endDate": "",
                        "discount": 37,
                        "unit": "%",
                        "whatsIncluded": "",
                        "tnc": "",
                        "status": isChecked,
                        "inventoryIds":  selectedIds,
                        "couponCode": "",
                        "couponType": "Discount",
                        "currency": ""
                    }),
                }
            );

            const data = await response.json();
            console.log(data);
            toast.success("Successfully Created Discount");

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
                    <Link to="/campaign"><img src={leftArrow} alt="left arrow" /></Link> Create Discount
                </span>

                <div>
                    <div className="left">
                        <button className={`${isActive('setup')} btn-outline-secondary border-0 active me-2`} onClick={() => setActive('setup')} style={{ textDecoration: 'none' }}>Coupon Setup</button>
                        <button className={`${isActive('availability')} btn-outline-secondary border-0 active me-2`} style={{ textDecoration: 'none' }}>Analytics (Soon)</button>
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
                                    placeholder="Discount Title"
                                    value={packageTitle}
                                    onChange={handleInputChange}
                                />

                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} style={{ flexDirection: 'column', margin: '20px 0px' }}>

                                    <div style={{ marginTop: '20px' }} className="grey">Type of coupon</div>
                                    <div style={{ flexDirection: 'column' }}>
                                        <div style={{ justifyContent: 'start' }} className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                            <label style={{ margin: '0px 5px' }} className="form-check-label">Percent Off</label>
                                        </div>
                                        <div style={{ justifyContent: 'start' }} className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <label style={{ margin: '0px 5px' }} className="form-check-label">Money Value</label>
                                        </div>
                                    </div>

                                    {/* Product Table */}
                                    <div className="product-table-wrapper">
                                        <table className="table table-hover product-table">
                                            <thead>
                                                <tr>
                                                    <th scope="col"></th>
                                                    <th scope="col">Product</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inventory.map((data) => (
                                                    <tr key={data.ID}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedIds.split(',').includes(data.InventoryID)}
                                                                onChange={() => handleCheckboxChange(data.InventoryID)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div style={{ justifyContent: 'start' }}>
                                                                <img src={product} alt="product" style={{ width: '50px', height: '50px' }} />
                                                                <div style={{ flexDirection: 'column', padding: '0px 20px' }}>
                                                                    <span>{data.InventoryName}</span>
                                                                    <span className="grey">$ {data.Price}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Footer */}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="denseCheck" />
                                            <label className="form-check-label" htmlFor="denseCheck">Dense</label>
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
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatePackage;
