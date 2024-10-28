import { useState, useEffect } from 'react';
import eye1 from '../assets/eye1.svg';
import likes from '../assets/likes.svg';
import edit1 from '../assets/edit1.svg';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const CampaignDiscounts = () => {
  const navigate = useNavigate();
  const jwtUserToken = Cookies.get("user_token");
  const userData = JSON.parse(jwtUserToken);
  const [isChecked, setIsChecked] = useState(false);
  const [discountData, setDiscountData] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state

  const handleToggle = () => {
    setIsChecked(!isChecked);
    console.log('Toggle state:', !isChecked);
  };

  const loadDiscount = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch('https://wellness.neardeal.me/WAPI/fetchCouponsMW.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "vendorId": userData.ID,
          "couponType": 'Discount'
        })
      });
      const data = await response.json();
      console.log("dsds",data.message)
   
      setDiscountData(data.message);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    loadDiscount();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{ overflowY: 'auto', height: '60vh' }}
      >
      {loading ? (
        'Loading..' // Loader
      ) : (
        discountData.map((discount, index) => (
          <div className='item' key={index}>
            <div className='left' style={{ width: '84%' }}>
              <div style={{ padding: '10px' }}>
                <span style={{ color: '#00A76F' }}>{discount.CouponTitle}</span>
                {/* <span>Father's day offer</span> */}
              </div>
            </div>
            <div className='right' style={{ width: '15%', justifyContent: 'space-between' }}>
              <div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id={`toggle-${index}`} // Unique ID for each toggle
                    className="toggle-checkbox"
                    checked={discount.Status}
                    // checked={discount.Status === '1'}
                    onChange={handleToggle}
                  />
                  <label htmlFor={`toggle-${index}`} className="toggle-label"></label>
                </div>
                <span>Publish</span>
              </div>
              <div>
                <img width={25} src={edit1} alt="Edit" 
                
                 onClick={() => navigate(`/discount/${discount.CouponCode}`)}  // Navigate to package page with Inventory ID

                 />
              </div>
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
}

export default CampaignDiscounts;
