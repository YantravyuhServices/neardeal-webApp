import { useState } from "react";
import "../App.css";
import SideBar from "../Components/SideBar";
import background from "../assets/background.svg";
import plus from "../assets/plus.svg";
import clock from "../assets/clock.svg";
import CampaignAds from "../Components/CampaignAds";
import CampaignNearReel from "../Components/CampaignNearReel";
import CampaignCoupon from "../Components/CampaignCoupon";
import CampaignDiscounts from "../Components/CampaignDiscounts";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Campaign = () => {
  const [active, setActive] = useState("ads");
  const isActive = (path) => {
    return active === path ? "btn" : "";
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar></SideBar>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        style={{ width: "80%" }}
      >
        <div></div>
        <img
          style={{ position: "absolute", top: 0, zIndex: "-1" }}
          src={background}
        ></img>

        <div className="container mainSec" id="bookingSec">
          <h1 className="secHead">Campaign</h1>
          <div className="row mb-4 p-0">
            <div className="col-lg-6 d-flex">
              <button
                onClick={() => setActive("ads")}
                type="button"
                className={`${isActive(
                  "ads"
                )} btn-outline-secondary border-0 active me-2`}
              >
                Ads
              </button>
              <button
                onClick={() => setActive("nearreel")}
                type="button"
                className={`${isActive(
                  "nearreel"
                )} btn-outline-secondary border-0 active me-2`}
              >
                NearReel
              </button>
              <button
                onClick={() => setActive("coupon")}
                type="button"
                className={`${isActive(
                  "coupon"
                )} btn-outline-secondary border-0 active me-2`}
              >
                Coupon
              </button>
              <button
                onClick={() => setActive("discounts")}
                type="button"
                className={`${isActive(
                  "discounts"
                )} btn-outline-secondary border-0 active me-2`}
              >
                Discounts
              </button>
            </div>
            <div
              className="col-lg-6 d-flex input-group justify-content-end ms-5"
              style={{ maxWidth: "45%" }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
              />
              <button
                className="btn btn-outline-secondary me-2 rounded-3"
                type="button"
              >
                <i className="fa fa-search"></i>
              </button>
              {active === "coupon" && (
                <>
                  {/* <Link style={{display:'flex', alignItems:'center', textDecoration:'none', border:'2px solid black', padding:'0px 20px'}} to='/campaign/redeemcode' className=" btn-outline-secondary ms-3 me-0 rounded-3" type="button"><img src={clock} /> <span style={{ color: 'black' }}>Redeem record</span></Link> */}
                  <Link
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      border: "2px solid black",
                      padding: "0px 20px",
                    }}
                    to="/campaign/create-coupon"
                    className=" btn-outline-secondary ms-3 me-0 rounded-3"
                    type="button"
                  >
                    <img src={plus} />{" "}
                    <span style={{ color: "black" }}>Create Coupon</span>
                  </Link>
                </>
              )}
              {active === "nearreel" && (
                <Link
                  to="/campaign/create-nearreel"
                  className="btn-outline-secondary ms-3 me-0 rounded-3"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "2px solid black",
                    padding: "0px 20px",
                    textDecoration: "none",
                  }}
                >
                  <img src={plus} />{" "}
                  <span style={{ color: "black" }}>Create NearReel</span>
                </Link>
              )}
              {active === "discounts" && (
                <Link
                  to="/campaign/create-discounts"
                  className="btn-outline-secondary ms-3 me-0 rounded-3"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "2px solid black",
                    padding: "0px 20px",
                    textDecoration: "none",
                  }}
                >
                  <img src={plus} />
                  <span style={{ color: "black" }}>Create Discounts</span>
                </Link>
              )}
              {active === "ads" && (
                <>
                  {/* <Link style={{display:'flex', alignItems:'center', textDecoration:'none', border:'2px solid black', padding:'0px 20px'}} to='/campaign/redeemcode' className=" btn-outline-secondary ms-3 me-0 rounded-3" type="button"><img src={clock} /> <span style={{ color: 'black' }}>Redeem record</span></Link> */}
                  <Link
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      border: "2px solid black",
                      padding: "0px 20px",
                    }}
                    to="/campaign/ads"
                    className=" btn-outline-secondary ms-3 me-0 rounded-3"
                    type="button"
                  >
                    <img src={plus} />{" "}
                    <span style={{ color: "black" }}>Create Ad</span>
                  </Link>
                </>
              )}
            </div>
          </div>
          <table className="table table-hover mt-5">
            <tbody>
              {active === "ads" && <CampaignAds />}

              {active === "nearreel" && <CampaignNearReel />}

              {active === "coupon" && <CampaignCoupon />}

              {active === "discounts" && <CampaignDiscounts />}
            </tbody>
          </table>
        </div>
        <div className="offcanvas offcanvas-end" id="demo">
          <div className="offcanvas-header mb-0">
            <h3 className="offcanvas-title">Edit Booking</h3>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
            ></button>
          </div>
          <div className="offcanvas-body">
            <p className="offCanInvid">
              Invoice ID: <span id="invoiceNo">1234567890</span>
            </p>
            <p className="offCanCustName">
              Customer
              <br />
              <span id="custName">Qwerty</span>
            </p>
            <div className="card mt-4">
              <div className="card-header offCanCardHead">
                <div className="row">
                  <div className="col-lg-6">
                    <p>Order Information</p>
                  </div>
                  <div className="col-lg-6">
                    <button
                      type="button"
                      className="btn btn-outline-dark offCanCardHeadBtn float-end mt-1"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-lg-2">
                    <img
                      style={{ borderRadius: "5px" }}
                      src="https://avatars.githubusercontent.com/u/97161064?v=4"
                      width="100%"
                      alt="Package"
                    />
                  </div>
                  <div className="col-lg-8">
                    <p className="offCanOfferType">Regular</p>
                    <p className="offCanPackageDetail">
                      Japanese Sakura & Sake Spa Ritual for Couple /Japanese
                      sake bath + Aromatherapy Massage + Suite + Cake&Tea + Sake
                      + Gym
                    </p>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg-6">
                    <input id="datepicker" placeholder="Date" />
                  </div>
                  <div className="col-lg-6">
                    <input id="timepicker" placeholder="Time" />
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-4">
              <div className="card-header offCanCardHead">
                <div className="row">
                  <div className="col-lg-12">
                    <p>Customer Information</p>
                  </div>
                </div>
              </div>
              <div className="card-body ">
                <div className="row">
                  <div className="col-lg-4">
                    <img
                      style={{ borderRadius: "50%" }}
                      src="https://avatars.githubusercontent.com/u/97161064?v=4"
                      width="100%"
                      alt="Customer"
                    />
                  </div>
                  <div className="col-lg-8 my-auto">
                    <p id="custName">Qwerty</p>
                  </div>
                </div>
                <div className="input-group mt-3 w-50">
                  <input
                    type="text"
                    className="form-control"
                    id="cName"
                    defaultValue="9012345678"
                  />
                  <button
                    className="btn btn-outline-secondary border-0"
                    type="submit"
                  >
                    <i className="fa fa-clone"></i>
                  </button>
                </div>
                <div className="input-group mb-3 mt-3 w-auto">
                  <input
                    type="text"
                    className="form-control"
                    id="cEmail"
                    defaultValue="someone@something.com"
                  />
                  <button
                    className="btn btn-outline-secondary border-0"
                    type="submit"
                  >
                    <i className="fa fa-clone"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Campaign;
