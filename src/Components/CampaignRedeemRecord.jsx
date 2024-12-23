import { useState } from "react";
import SideBar from "./SideBar";
import background from "../assets/background.svg";
import leftArrow from "../assets/leftArrow.svg";
import preview from "../assets/preview.svg";
import copy from "../assets/copy.svg";
import imageUpload from "../assets/imageUpload.svg";
import cross from "../assets/cross.svg";
import icon1 from "../assets/icon1.svg";
import icon2 from "../assets/icon2.svg";
import icon3 from "../assets/icon3.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import CampaignSideBar from "./CampaignSideBar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RedeemRecord = () => {

    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
        console.log('Toggle state:', !isChecked);
    };

    return (
        <div style={{ display: 'flex' }}>
            <SideBar></SideBar>
            <img style={{ position: 'absolute', top: 0, zIndex: '-1', width: '100%' }} src={background}></img>
            <motion.div initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }} className="create-package" style={{ width: '80%' }}>
                <span className="heading"> <Link to="/campaign"><img src={leftArrow} /></Link> Coupon redeem record</span>
                <div className="payment-table-container">
                        <table className="payment-table">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" /></th>
                                    <th>Price</th>
                                    <th>Customer</th>
                                    <th>Package Name</th>
                                    <th>Coupon Code<span>&#x25BC;</span></th>
                                    <th>Date & Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input type="checkbox" /></td>
                                    <td>$499</td>
                                    <td>Mac</td>
                                    <td>Anti Ageing Facial</td>
                                    <td>INV-17067</td>
                                    <td>--</td>
                                    <td><span className="status uncaptured">Uncaptured</span></td>
                                </tr>
                                <tr>
                                    <td><input type="checkbox" /></td>
                                    <td>$499</td>
                                    <td>Ada</td>
                                    <td>Anti Ageing Facial</td>
                                    <td>INV-17067</td>
                                    <td>23 June 2024 10:00</td>
                                    <td><span className="status succeeded">Succeeded</span></td>
                                </tr>
                                <tr>
                                    <td><input type="checkbox" /></td>
                                    <td>$499</td>
                                    <td>Cherish</td>
                                    <td>Anti Ageing Facial</td>
                                    <td>INV-17067</td>
                                    <td>23 June 2024 9:00</td>
                                    <td><span className="status succeeded">Succeeded</span></td>
                                </tr>
                                <tr>
                                    <td><input type="checkbox" /></td>
                                    <td>$499</td>
                                    <td>Jimmy</td>
                                    <td>Anti Ageing Facial</td>
                                    <td>INV-17067</td>
                                    <td>23 June 2024 8:30</td>
                                    <td><span className="status succeeded">Succeeded</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
            </motion.div>

        </div>
    )
}

export default RedeemRecord