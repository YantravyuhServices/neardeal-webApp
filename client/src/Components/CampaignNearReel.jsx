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
                        vendorId: userData.ID,
                        camFilter: 'nearreel',
                    }),
                }
            );

            const data = await response.json();
            console.log(data.message);
            setNearreel(data.message);

        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchNearReel();
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}>
            <div className='campaign-nearreel'>
                {
                    nearreel.length === 0 ?
                        <div style={{ textAlign: 'center' }}>No Campaigns</div>
                        :
                        nearreel.map((data) => {
                            return (
                                <>
                                    <div className='item'>
                                        <div className='left' style={{ width: '84%' }}>
                                            <img src='https://avatars.githubusercontent.com/u/97161064?v=4' />
                                            <div>
                                                <span>{data.CampaignName}</span>
                                                <div>
                                                    <div><img style={{ width: 'max-content' }} src={eye1} /><span style={{ color: 'grey' }}>1000 views</span></div>
                                                    <div style={{ marginLeft: '10px' }}><img style={{ width: 'max-content' }} src={likes} /><span style={{ color: 'grey' }}>1000 likes</span></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='right' style={{ width: '20%', justifyContent: 'space-between' }}>
                                            <div>
                                                <div className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        id="toggle"
                                                        className="toggle-checkbox"
                                                        checked={isChecked}
                                                        onChange={handleToggle}
                                                    />
                                                    <label htmlFor="toggle" className="toggle-label"></label>
                                                    {/* <span>Publish</span> */}
                                                </div>

                                                <span>Publish</span>
                                            </div>

                                            <div>
                                                <img width={25} src={share} />
                                                <img width={25} src={eye} />
                                                <img width={25} src={edit1} />
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