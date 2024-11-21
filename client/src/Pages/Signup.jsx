import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast notifications
import logo from '../assets/logo.svg' // Adjust import path as needed
import spa from '../assets/spa.svg'; // Adjust import path as needed
import gym from '../assets/gym.svg'
import salon from '../assets/salon.svg'
import yoga from '../assets/yoga.svg'

const SignUp = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(0); // New state for storing user ID

    // Step 1: Account Credentials
    const [accountData, setAccountData] = useState({
        email: "",
        password: "",
        username: "",
        confirmPassword: "",
    });

    // Step 2: Merchant Account
    const [merchantData, setMerchantData] = useState({
        dob: "",
        contact: "",
        category: "All",
    });

    // Step 3: Store Information
    const [storeData, setStoreData] = useState({
        storeAddress: "",
        category: "All",
        city: "",
        country: "",
        zip: "",
        storelogo_name: "",
        profilePic: null,
    });

    const handleAccountChange = (e) => {
        const { name, value } = e.target;
        setAccountData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMerchantChange = (e) => {
        const { name, value } = e.target;
        setMerchantData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStoreChange = (e) => {
        const { name, value } = e.target;
        setStoreData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result; // Get the Base64 string from the reader
                const parts = base64String.split(","); // Split the string at the comma
                console.log("--------", parts); // Now you can log it
                
                // Update the state with the new data
                setStoreData(prev => ({
                    ...prev,
                    profilePic: parts, // Base64 encoded string
                    storelogo_name: file.name // Set the file name here
                }));
            };
            reader.readAsDataURL(file);
        }
    };    

    const handleCategoryChange = (category) => {
        setMerchantData(prev => ({
            ...prev,
            category,
        }));
    };

    const callApi = async (step) => {
        setLoading(true);
        let payload = {};        

        try {
            if (step === 1) {
                // Handle Step 1 API call
                payload = {
                    // Extracting user data from accountData for Step 1
                    email: accountData.email,
                    username: accountData.username,
                    password: accountData.password,
                    confirmPassword: accountData.confirmPassword
                };

                const response = await fetch('https://wellness.neardeal.me/WAPI/merchantSignup.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }

                const data = await response.json();
                setUserId(data.userid);
                toast.success('Account credentials saved successfully');
            } else if (step === 2) {
                // Handle verification API call
                payload = {
                    userid: userId // Pass userId for verification
                };

                const verificationResponse = await fetch('https://wellness.neardeal.me/WAPI/verificationStatus.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!verificationResponse.ok) {
                    throw new Error('Network response was not ok.');
                }

                const verificationData = await verificationResponse.json();
                if (verificationData.status !== 'success') {
                    throw new Error('Verification failed.');
                }

                toast.success('Verification successful');
                return true; // Proceed to next step if verification is successful
            } else if (step === 5) {
                // Handle final API call directly after successful verification

                console.log(storeData.storelogo_name,":", storeData.profilePic);
                const finalResponse = await fetch('https://wellness.neardeal.me/WAPI/merchantSignup.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userid: userId,
                        contactno: storeData.contact,
                        category: storeData.category,
                        storeaddress: storeData.storeAddress,
                        email: storeData.email,
                        storedoo: merchantData.dob,
                        city: storeData.city,
                        country: storeData.country,
                        zip: storeData.zip,
                        coordinates: "kl",
                        storeimage_name: storeData.storelogo_name,
                        storeimage: storeData.profilePic,
                    }),
                });

                console.log('Final Response:', finalResponse);
                // console.log();
                navigate('/login');
                toast.success('Merchant account launched successfully');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(`Error saving data for step ${step}`);
            return false; // Prevent moving to the next step if there's an error
        } finally {
            setLoading(false);
        }

        return true; // Allow moving to the next step if successful
    };

    const handleNextStep = async (nextStep) => {
        const success = await callApi(currentStep);
        if (success) {
            setCurrentStep(nextStep);
        }
    };

    return (
        <div className="bg-grad">
            <nav className="navbar navbar-expand-sm navbar-light p-4">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="mynavbar">
                        <img src={logo} className="logo-img" alt="logo" />
                        <ul className="navbar-nav me-auto"></ul>
                    </div>
                    <button className="btn px-0 float-end" type="button" style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                        Go to Website
                    </button>
                </div>
            </nav>

            <div className="container-fluid" id="form">
                <div className="row px-5" style={{ marginTop: '5%' }}>
                    <div className="col-lg-4"></div>
                    <div className="col-lg-4 col-sm-12 px-5">
                        {currentStep === 1 && (
                            <div id="signup1">
                                <h2 className="form-header">Account Credentials</h2>
                                <input
                                    type="email"
                                    className="form-control-plaintext formFields my-2"
                                    placeholder="Email"
                                    id="email"
                                    name="email"
                                    value={accountData.email}
                                    onChange={handleAccountChange}
                                    required
                                />
                                <input
                                    type="text"
                                    className="form-control-plaintext formFields mt-3"
                                    placeholder="Username"
                                    id="username"
                                    name="username"
                                    value={accountData.username}
                                    onChange={handleAccountChange}
                                    required
                                />
                                <input
                                    type="password"
                                    className="form-control-plaintext formFields my-2"
                                    placeholder="Password"
                                    id="pass"
                                    name="password"
                                    value={accountData.password}
                                    onChange={handleAccountChange}
                                    required
                                />
                                <input
                                    type="password"
                                    className="form-control-plaintext formFields my-2"
                                    placeholder="Confirm Password"
                                    id="conpass"
                                    name="confirmPassword"
                                    value={accountData.confirmPassword}
                                    onChange={handleAccountChange}
                                    required
                                />
                                <div className="d-grid mt-3">
                                    <button type="button" className="btn btn-dark btn-block" onClick={() => handleNextStep(2)}>
                                        Submit Credentials
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div id="signup2">
                                <h2 className="form-header">Merchant Account Created</h2>
                                <div className="d-grid mt-3">
                                    <button type="button" className="btn btn-dark btn-block" onClick={() => handleNextStep(3)}>
                                        Verification Done
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div id="signup3">
                                <h2 className="form-header">Store Information</h2>
                                <input
                                    type="date"
                                    className="form-control-plaintext formFields my-2"
                                    placeholder="Date of opening"
                                    id="dob"
                                    name="dob"
                                    value={merchantData.dob}
                                    onChange={handleMerchantChange}
                                    required
                                />
                                <input
                                    type="tel"
                                    className="form-control-plaintext formFields my-2"
                                    placeholder="Contact No."
                                    id="contact"
                                    name="contact"
                                    value={merchantData.contact}
                                    onChange={handleMerchantChange}
                                    required
                                />
                                <input
                                    type="hidden"
                                    className="form-control-plaintext formFields my-2"
                                    placeholder="Category"
                                    id="category"
                                    name="category"
                                    value={merchantData.category}
                                />
                                <div className="d-grid mt-3">
                                    <button type="button" className="btn btn-dark btn-block" onClick={() => handleNextStep(4)}>
                                        Continue
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div id="signup4">
                                <div className="row p-0">
                                    <h2 className="form-header">Service(s) Category</h2>
                                    <div className="col-lg-6 col-sm-12" style={{ paddingRight: "1%" }}>
                                        <div className="card mb-2" onClick={() => handleCategoryChange("Spa")} id="Spa">
                                            <div className="row g-0">
                                                <div className="col-md-6 m-auto">
                                                    <div className="card-body">
                                                        <p className="card-text">Spa</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-5 p-2">
                                                    <img src={spa} className="img-fluid rounded-start" alt="Spa" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card mb-2" onClick={() => handleCategoryChange("Gym")} id="Gym">
                                            <div className="row g-0">
                                                <div className="col-md-6 m-auto">
                                                    <div className="card-body">
                                                        <p className="card-text">Gym</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-5 p-2">
                                                    <img src={gym} className="img-fluid rounded-start" alt="Gym" />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="col-lg-6 col-sm-12" style={{ paddingRight: "1%" }}>
                                        <div className="card mb-2" onClick={() => handleCategoryChange("salon")} id="Salon">
                                            <div className="row g-0">
                                                <div className="col-md-6 m-auto">
                                                    <div className="card-body">
                                                        <p className="card-text">Salon</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-5 p-2">
                                                    <img src={salon} className="img-fluid rounded-start" alt="Salon" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card mb-2" onClick={() => handleCategoryChange("Yoga")} id="Yoga">
                                            <div className="row g-0">
                                                <div className="col-md-6 m-auto">
                                                    <div className="card-body">
                                                        <p className="card-text">Yoga</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-5 p-2">
                                                    <img src={yoga} className="img-fluid rounded-start" alt="Yoga" />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Repeat for other categories */}
                                </div>
                                <div className="d-grid mt-3">
                                    <button type="button" className="btn btn-dark btn-block" onClick={() => handleNextStep(5)}>
                                        Proceed to Final Step
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 5 && (
                            <div id="signup5">
                                <h2 className="form-header">Store Address</h2>
                                <textarea
                                    className="form-control-plaintext formFields mt-3"
                                    placeholder="Full Store Address"
                                    id="store_address"
                                    name="storeAddress"
                                    value={storeData.storeAddress}
                                    onChange={handleStoreChange}
                                    required
                                ></textarea>
                                <input
                                    type="text"
                                    className="form-control-plaintext formFields mt-3"
                                    placeholder="City"
                                    id="city"
                                    name="city"
                                    value={storeData.city}
                                    onChange={handleStoreChange}
                                    required
                                />
                                <input
                                    type="text"
                                    className="form-control-plaintext formFields mt-3"
                                    placeholder="Country"
                                    id="country"
                                    name="country"
                                    value={storeData.country}
                                    onChange={handleStoreChange}
                                    required
                                />
                                <input
                                    type="text"
                                    className="form-control-plaintext formFields mt-3"
                                    placeholder="Zip Code"
                                    id="zip"
                                    name="zip"
                                    value={storeData.zip}
                                    onChange={handleStoreChange}
                                    required
                                />
                                <input
                                    type="file"
                                    className="form-control-plaintext formFields mt-3"
                                    id="storeLogo"
                                    name="profilePic"
                                    onChange={handleFileChange}
                                    required
                                />
                                {storeData.profilePic && (
                                    <div className="mt-3">
                                        <img
                                            src={storeData.profilePic} // Show preview of selected image
                                            alt="Store Logo Preview"
                                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                                        />
                                    </div>
                                )}
                                <div className="d-grid mt-3">
                                    <button type="button" className="btn btn-dark btn-block" onClick={() => handleNextStep(6)}>
                                        Launch Merchant Account
                                        {loading && (
                                            <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-lg-4"></div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
