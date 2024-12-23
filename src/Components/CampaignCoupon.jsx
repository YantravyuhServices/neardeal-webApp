import { useState, useEffect } from "react";
import eye1 from "../assets/eye1.svg";
import likes from "../assets/likes.svg";
import edit1 from "../assets/edit1.svg";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CampaignCoupon = () => {
  const navigate = useNavigate();
  const jwtUserToken = Cookies.get("user_token");
  const userData = JSON.parse(jwtUserToken);
  const [isChecked, setIsChecked] = useState(false);
  const [couponData, setCouponData] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state

  const handleToggle = () => {
    setIsChecked(!isChecked);
    console.log("Toggle state:", !isChecked);
  };

  const loadCoupon = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        "https://wellness.neardeal.me/WAPI/fetchCouponsMW.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorId: userData.ID,
            couponType: "Coupon",
          }),
        }
      );

      const data = await response.json();
      setCouponData(data.message);
      console.log("Coupon data:", data.message);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    loadCoupon();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{ overflowY:'auto', height:'60vh' }}
    >
      {loading
        ? "Loading..." // Loader
        : couponData.map((coupon, index) => (
            <div className="item" key={index}>
              <div className="left" style={{ width: "84%", padding:'10px' }}>
                {/* <img
                  src="https://avatars.githubusercontent.com/u/97161064?v=4"
                  alt="Coupon"
                /> */}
                {/* <div> */}
                <span style={{ color: '#00A76F' }}>{coupon.CouponTitle}</span>
                {/* <div>
                  <div>
                    <img style={{ width: 'max-content' }} src={eye1} alt="Views" />
                    <span style={{ color: 'grey' }}>{coupon.views || '1000 views'}</span>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <img style={{ width: 'max-content' }} src={likes} alt="Likes" />
                    <span style={{ color: 'grey' }}>{coupon.likes || '1000 likes'}</span>
                  </div>
                </div> */}
                {/* </div> */}
              </div>
              <div
                className="right"
                style={{ width: "15%", justifyContent: "space-between" }}
              >
                <div>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id={`toggle-${index}`} // Unique ID for each toggle
                      className="toggle-checkbox"
                      checked={coupon.Status === '1' ? true : false}
                      onChange={handleToggle}
                    />
                    <label
                      htmlFor={`toggle-${index}`}
                      className="toggle-label"
                    ></label>
                  </div>
                  <span>Publish</span>
                </div>
                <div>
                  <img
                    width={25}
                    src={edit1}
                    alt="Edit"
                    onClick={() => navigate(`/coupon/${coupon.CouponCode}`)}
                  />
                </div>
              </div>
            </div>
          ))}
    </motion.div>
  );
};

export default CampaignCoupon;
