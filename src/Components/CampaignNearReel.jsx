import { useEffect, useState } from 'react'
import edit1 from '../assets/edit1.svg'
import eye from '../assets/eye.svg'
import share from '../assets/share.svg'
import eye1 from '../assets/eye1.svg'
import likes from '../assets/likes.svg'
import { motion } from 'framer-motion'
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const CampaignNearReel = () => {
    const jwtUserToken = Cookies.get("user_token");
    const userData = JSON.parse(jwtUserToken);
    const [isChecked, setIsChecked] = useState(false);
    const [nearreel, setNearreel] = useState([]);

    const handleToggle = () => {
        setIsChecked(!isChecked);
        console.log('Toggle state:', !isChecked);
    };

    useEffect(() => {
        fetchNearReel();
    }, []); // Empty dependency array to run only on mount
    
    const fetchNearReel = async () => {
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
                  camFilter: "nearreel",
                }),
              }
            );
      
            const data = await response.json();
            setNearreel(data.message);
            console.log("Coupon data:", data);
          } catch (error) {
            console.error("Fetch error:", error);
        }
    };
    
    const deleteNR = async (id) => {
        console.log('ID:', id);
        
        try {
            const response = await fetch(
                "https://wellness.neardeal.me/WAPI/deleteNearReelMW.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "vendorID": userData.ID,
                        "camFilter": "nearreel",
                    }),
                }
            );

            const data = await response.json();
            console.log(data.message);
            toast.success("NearReel Deleted Successfully");

        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}>
            <div className='campaign-nearreel' style={{ background:'none' }}>
                {
                    nearreel.length === 0 ?
                        'No NearReel Campaigns Available'
                        :
                        nearreel.map((data) => {
                            return (
                                <>
                                    <div className='item' style={{ justifyContent:'space-between', marginBottom: '10px' }}>
                                        <div className='left' style={{ width: '84%' }}>
                                            {/* <img src={`https://wellness.neardeal.me/WAPI/${data.ContentLocation}`} /> */}
                                            <video
                                                src={`https://wellness.neardeal.me/WAPI/${data.ContentLocation}`} // Assuming `data.ContentLocation` contains the video source
                                                controls
                                                style={{
                                                    width: '50px',         
                                                    height: '50px',       
                                                    borderRadius: '50%',  
                                                    objectFit: 'cover',   
                                                    overflow: 'hidden',     
                                                    marginRight: '20px'
                                                }}
                                            />

                                            <div>
                                                <span>{data.CampaignName}</span>
                                                <div>
                                                    <div><img style={{ width: 'max-content' }} src={eye1} /><span style={{ color: 'grey' }}>1000 views</span></div>
                                                    <div style={{ marginLeft: '10px' }}><img style={{ width: 'max-content' }} src={likes} /><span style={{ color: 'grey' }}>1000 likes</span></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='right' style={{ width: '5%', justifyContent: 'space-between' }}>
                                            {/* <div>
                                                <div className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        id="toggle"
                                                        className="toggle-checkbox"
                                                        checked={data.Status === '1' ? true : false}
                                                        onChange={handleToggle}
                                                    />
                                                    <label htmlFor="toggle" className="toggle-label"></label>
                                                    <span>Publish</span>
                                                </div>

                                                <span>Publish</span>
                                            </div> */}

                                            <div>
                                                <i style={{ fontSize:'20px', color:'red', cursor:'pointer' }} onClick={()=> deleteNR(data.CampaignID)} className="bi bi-trash3-fill"></i>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })
                }
            </div>
        </motion.div>
    )
}

export default CampaignNearReel