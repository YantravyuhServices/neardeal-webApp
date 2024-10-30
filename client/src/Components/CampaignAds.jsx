import { useState, useEffect } from 'react'
import edit from "../assets/edit.svg";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const CampaignAds = () => {
    const navigate = useNavigate();
    const jwtUserToken = Cookies.get("user_token");
    const userData = JSON.parse(jwtUserToken);
    const [isChecked, setIsChecked] = useState(false);
    const [ads, setAds] = useState([]);
    const handleToggle = () => {
        setIsChecked(!isChecked);
        console.log('Toggle state:', !isChecked);
    };

    useEffect(() => {
        fetchAd();
    }, []); // Empty dependency array to run only on mount

    const fetchAd = async () => {
        try {
            const response = await fetch(
                "https://wellness.neardeal.me/WAPI/merchantAdsListingMW.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        vendorID: userData.ID,
                        camFilter: "ad",
                    }),
                }
            );

            const data = await response.json();
            // setNearreel(data.message);
            console.log("Coupon data:", data);
            setAds(data.message);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };
    return (
        <motion.div initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}>

            {
                ads.map((item, index) => {
                    return (
                        <>
                            <div key={index} style={{ padding: '10px 20px', marginBottom:'10px' }} className="campaign-ads">
                                <div>
                                    <span>{item.CampaignName}</span>
                                    <span style={{ fontSize: '14px' }} className="grey">Total Cost: $100</span>
                                </div>
                                <div className="edit">
                                    <div style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {/* <div className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                id="toggle"
                                                className="toggle-checkbox"
                                                checked={isChecked}
                                                onChange={handleToggle}
                                            />
                                            <label htmlFor="toggle" className="toggle-label"></label>

                                        </div>
                                        <span style={{ margin: '0px 10px' }}>Active</span> */}
                                    </div>
                                    <Link to={`/campaign/ads/${item.CampaignID}`}>
                                        <img src={edit} alt="Edit" />
                                    </Link>
                                </div>
                            </div>
                        </>
                    )
                })
            }

        </motion.div>
    )
}

export default CampaignAds