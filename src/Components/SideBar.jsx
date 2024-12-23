import { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import aiLogo from "../assets/aiLogo.svg";
import campaign from "../assets/campaign.svg";
import analytics from "../assets/analytics.svg";
import transaction from "../assets/transaction.svg";
import storeSetting from "../assets/storeSetting.svg";
import booking from "../assets/booking.svg";
import packageLogo from "../assets/package.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const SideBar = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const location = useLocation();
    var cookieValue = Cookies.get('user_token');
    cookieValue = JSON.parse(cookieValue);

    console.log("Cookie Value:", cookieValue.ID);
    useEffect(() => {
        const fetchData = async () => {
            try {
                var payload = {
                    "userID": cookieValue.ID
                }

                // Fetch user data
                const response = await fetch('https://wellness.neardeal.me/WAPI/fetchUserData.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                const userData = await response.json();
                setUserData(userData);
                console.log("User Data:", userData); // Log the user data

            } catch (error) {
                console.error('Failed to parse JSON from cookie or fetch user data:', error);
            }

        };

        fetchData();
    }, []);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleProfileClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        Cookies.remove('user_token'); // Remove the cookie
        setIsDropdownOpen(false); // Close dropdown after logout
        // Optionally, redirect the user or perform any additional actions after logout
        navigate('/login');
    };    

    const handleCloseDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-navigation">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <span className="sidebar-subtitle">CUSTOMER</span>
                <div className="sidebar-list">
                    <span className={isActive('/')}>
                        <img src={booking} alt="Booking" />
                        <Link style={{ textDecoration: 'none' }} to="/">Booking</Link>
                    </span>
                    <span className={isActive('/package') || isActive('/availability') || isActive('/limits') || isActive('/create-package') || isActive('/package/:id')}>
                        <img src={packageLogo} alt="Package" />
                        <Link style={{ textDecoration: 'none' }} to='/package'>Package</Link>
                    </span>
                </div>
                <span className="sidebar-subtitle">STORE</span>
                <div className="sidebar-list">
                    <span className={isActive('/campaign') || isActive('/create-coupon') || isActive('/campaign/redeemcode') || isActive('/campaign/ads') || isActive('/campaign/create-coupon') || isActive('/campaign/create-discounts') || isActive('/campaign/create-nearreel')}>
                        <img src={campaign} alt="Campaign" />
                        <Link style={{ textDecoration: 'none' }} to="/campaign">Campaign</Link>
                    </span>
                    <span className={isActive('/analytics')}>
                        <img src={analytics} alt="Analytics" />
                        <Link style={{ textDecoration: 'none' }} to="/analytics">Analytics</Link>
                    </span>
                    <span className={isActive('/transaction')}>
                        <img src={transaction} alt="Transaction" />
                        <Link style={{ textDecoration: 'none' }} to="/transaction">Transaction</Link>
                    </span>
                    <span className={isActive('/store-settings')}>
                        <img src={storeSetting} alt="Store Setting" />
                        <Link style={{ textDecoration: 'none' }} to="/store-settings">Store Setting</Link>
                    </span>
                    <span className={isActive('/nearai')}>
                        <img src={aiLogo} alt="Near.AI" />
                        <Link style={{ textDecoration: 'none' }} to="/nearai">Near.AI</Link>
                    </span>
                </div>
            </div>

            <div className="sidebar-profile-container">
                <div className="sidebar-profile">
                    <div className="profile-container" onClick={handleProfileClick}>
                        <img
                            src={userData && `https://wellness.neardeal.me/WAPI/${userData.profilePic}`}
                            alt="Profile"
                            className="profile-pic"
                        />
                        <div className="profile-info">
                            <span style={{ textAlign:'center' }} className="profile-name">{userData && userData.Name}</span>
                            <span style={{ textAlign:'center' }} className="profile-email">{userData && userData.Email}</span>
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <button className="close-button" onClick={handleCloseDropdown}>✖</button>
                            <button className="logout-button" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default SideBar;
