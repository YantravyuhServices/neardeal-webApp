import { useState, useEffect } from "react";
import "../App.css";
import SideBar from "../Components/SideBar";
import background from "../assets/background.svg";
import { Link, useNavigate } from "react-router-dom";
import plus from "../assets/plus.svg";
import edit1 from '../assets/edit1.svg';
import eye from '../assets/eye.svg';
import share from '../assets/share.svg';
import eye1 from '../assets/eye1.svg';
import likes from '../assets/likes.svg';
import addFile from "../assets/addFile.svg";
import more from "../assets/more.svg";
import play from "../assets/play.svg";
import { motion } from "framer-motion";
import Cookies from 'js-cookie';

const CreatePackage = () => {
    const jwtUserToken = Cookies.get("user_token");
    const userData = JSON.parse(jwtUserToken);
    const navigate = useNavigate();
    const [active, setActive] = useState('ads');
    const [isChecked, setIsChecked] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);

    const isActive = (path) => {
        return active === path ? 'btn' : '';
    };

    const handleToggle = () => {
        setIsChecked(!isChecked);
        console.log('Toggle state:', !isChecked);
    };

    const handleAccordionToggle = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const openModal = () => {
        const modal = new window.bootstrap.Modal(document.getElementById('exampleModalToggle'));
        modal.show();
    };

    const [spa, setSpa] = useState([]);
    const [massage, setMassage] = useState([]);
    const [sauna, setSauna] = useState([]);

    const fetchSpa = async () => {

        try {
            const response = await fetch('https://wellness.neardeal.me/WAPI/invListingMW.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "vendorId": userData.ID,
                    "invCat": 'spa',
                    "fetchType": 'List'
                })
            });

            const data = await response.json();
            console.log('Data', data);

            setSpa(data.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchSpa()
    }, [])

    return (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <motion.div initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }} style={{ width: '80%' }}>
                <img style={{ position: 'absolute', top: 0, zIndex: '-1' }} src={background} alt="background" />

                <div className="container mainSec" id="bookingSec">
                    <h1 className="secHead">Package</h1>
                    <div className="row mb-4 p-0">
                        <div className="col-lg-6 d-flex">
                            <button onClick={() => setActive('ads')} type="button" className={`${isActive('ads')} btn-outline-secondary border-0 active me-2`}>All</button>
                            <button onClick={() => setActive('nearreel')} type="button" className={`${isActive('nearreel')} btn-outline-secondary border-0 active me-2`}>Spa</button>
                            <button onClick={() => setActive('coupon')} type="button" className={`${isActive('coupon')} btn-outline-secondary border-0 active me-2`}>Massage</button>
                            <button onClick={() => setActive('discounts')} type="button" className={`${isActive('discounts')} btn-outline-secondary border-0 active me-2`}>Status</button>
                            {/* <img className="border-0 me-2" src={addFile} alt="add file" id="addFileBtn" onClick={openModal} style={{ cursor: 'pointer' }} /> */}
                        </div>
                        <div className="col-lg-6 d-flex input-group justify-content-end ms-5" style={{ maxWidth: '45%' }}>
                            <input type="text" className="form-control" placeholder="Search..." />
                            <button className="btn btn-outline-secondary me-2 rounded-3" type="button">
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className="package-body">
                        <div className="spa" onClick={() => handleAccordionToggle('spa')}>
                            <div style={{ width: '8%' }}>
                                <img src={play} className={`play-icon ${expandedSection === 'spa' ? 'rotate' : ''}`} alt="play" />
                                <span style={{ fontWeight: 'bold' }}>Spa</span>
                                <img src={more} alt="more" />
                            </div>
                            <Link to='/create-package'>
                                <button>
                                    <img src={plus} alt="add" />
                                    <span>Add Package</span>
                                </button>
                            </Link>
                        </div>
                        <div className={`accordion-content ${expandedSection === 'spa' ? 'expanded' : ''}`}>

                            {
                                spa.map((item, index) => {
                                    return <>
                                        <div className='item' key={index}>
                                            <div className='left' style={{ width: '84%' }}>
                                                <img src='https://avatars.githubusercontent.com/u/97161064?v=4' alt="spa" />
                                                <div>
                                                    <span>{item.InventoryName}</span>
                                                </div>
                                            </div>
                                            <div className='right' style={{ width: '14%', justifyContent: 'space-between' }}>
                                                <div>
                                                    <div className="toggle-switch">
                                                        <input
                                                            type="checkbox"
                                                            id="toggle"
                                                            className="toggle-checkbox"
                                                            checked={item.Status == 1 ? true : false}
                                                            onChange={handleToggle}
                                                        />
                                                        <label htmlFor="toggle" className="toggle-label"></label>
                                                        <span>{item.Status == 1 ? 'Published' : 'Draft Saved'}</span>
                                                    </div>
                                                </div>
                                                <div onClick={(e)=> navigate(`/package/${item.InventoryID}`)}> 
                                                    <img width={25} src={edit1} alt="edit" />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                })
                            }
                        </div>


                        <div className="spa" onClick={() => handleAccordionToggle('massage')}>
                            <div style={{ width: '10%' }}>
                                <img src={play} className={`play-icon ${expandedSection === 'massage' ? 'rotate' : ''}`} alt="play" />
                                <span style={{ fontWeight: 'bold' }}>Massage</span>
                                <img src={more} alt="more" />
                            </div>
                            <Link to='/create-package'>
                                <button>
                                    <img src={plus} alt="add" />
                                    <span>Add Package</span>
                                </button>
                            </Link>
                        </div>
                        <div className={`accordion-content ${expandedSection === 'massage' ? 'expanded' : ''}`}>
                            <div className='item'>
                                <div className='left' style={{ width: '84%' }}>
                                    <img src='https://avatars.githubusercontent.com/u/97161064?v=4' alt="massage" />
                                    <div>
                                        <span>Relaxing massage experience</span>

                                    </div>
                                </div>
                                <div className='right' style={{ width: '15%', justifyContent: 'space-between' }}>
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
                                            <span>Publish</span>
                                        </div>
                                    </div>
                                    <div>
                                        {/* <img width={25} src={share} alt="share" /> */}
                                        {/* <img width={25} src={eye} alt="view" /> */}
                                        <img width={25} src={edit1} alt="edit" />
                                    </div>
                                </div>
                            </div>
                            {/* Add more items here */}
                        </div>

                        <div className="spa" onClick={() => handleAccordionToggle('sauna')}>
                            <div style={{ width: '10%' }}>
                                <img src={play} className={`play-icon ${expandedSection === 'sauna' ? 'rotate' : ''}`} alt="play" />
                                <span style={{ fontWeight: 'bold' }}>Sauna</span>
                                <img src={more} alt="more" />
                            </div>
                            <Link to='/create-package'>
                                <button>
                                    <img src={plus} alt="add" />
                                    <span>Add Package</span>
                                </button>
                            </Link>
                        </div>
                        <div className={`accordion-content ${expandedSection === 'sauna' ? 'expanded' : ''}`}>
                            <div className='item'>
                                <div className='left' style={{ width: '84%' }}>
                                    <img src='https://avatars.githubusercontent.com/u/97161064?v=4' alt="sauna" />
                                    <div>
                                        <span>Premium sauna experience</span>

                                    </div>
                                </div>
                                <div className='right' style={{ width: '15%', justifyContent: 'space-between' }}>
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
                                            <span>Publish</span>
                                        </div>
                                    </div>
                                    <div>
                                        {/* <img width={25} src={share} alt="share" /> */}
                                        {/* <img width={25} src={eye} alt="view" /> */}
                                        <img width={25} src={edit1} alt="edit" />
                                    </div>
                                </div>
                            </div>
                            {/* Add more items here */}
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="modal fade" id="exampleModalToggle" aria-labelledby="exampleModalToggleLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div style={{ border: 'none' }} className="modal-header">
                            <h5 className="modal-title" id="exampleModalToggleLabel">New Folder</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div style={{ border: 'none' }} className="modal-body">
                            <input type="text" className="form-control" placeholder="Folder Title" />
                        </div>
                        <div style={{ border: 'none' }} className="modal-footer">
                            <button style={{ background: 'black', color: 'white' }} type="button" className="btn">Create Folder</button>
                            <button style={{ border: '1px solid black' }} type="button" className="btn" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CreatePackage;
