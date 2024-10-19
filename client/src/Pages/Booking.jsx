
import "../App.css";
import SideBar from "../Components/SideBar";
import background from "../assets/background.svg";
import { motion } from "framer-motion";
import started from "../assets/started.svg";
import tick from "../assets/tick.svg";
import cross from "../assets/cross.svg";
import dotedCircle from "../assets/dotedCircle.svg";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

//klkl
import declined from "../assets/regular.svg";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

const Booking = () => {

  const jwtUserToken = Cookies.get("user_token");
  const userData = JSON.parse(jwtUserToken);
  const [bookingData, setBookingData] = useState([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(false);

  // State for offcanvas form
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookingStatus, setBookingStatus] = useState("Attend");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [selectedBookingId, setSelectedBookingId] = useState("");
  // const []

  const isActive = (path) => {
    return active === path ? "btn" : "";
  };

  const handleSubmit = async (filter) => {
    setBookingData([]);
    try {
      setLoading(true);
      const response = await fetch(
        "https://wellness.neardeal.me/WAPI/bookingsTry.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorid: userData.ID,
            bookingFilter: filter,
          }),
        }
      );

      const data = await response.json();
      console.log(data.data[0].BookingID);

      setBookingData(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(
        "https://wellness.neardeal.me/WAPI/editBookingsMW.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorId: userData.ID,
            bookingStatus: bookingStatus,
            paymentStatus: paymentStatus,
            bookingId: selectedBookingId,
            bookingTime: `${date} ${time}`,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      // You may want to refresh the booking data after editing
      handleSubmit(active);
      toast.success(data.message);
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  var currentBookings;

  const [selectedFilter, setSelectedFilter] = useState("Featured");
  useEffect(() => {
    handleSubmit(active);
  }, [active, selectedFilter, currentBookings]);

  const [filter, setFilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const handleFilter = async (filter) => {
    try {
      setFilter(true);

    } catch (error) {
      console.log(error);
    }
  }

  const ITEMS_PER_PAGE = 5; // Adjust this as needed

  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(bookingData.length / ITEMS_PER_PAGE);

  // Slice booking data for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  currentBookings = bookingData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        style={{ width: "80%" }}
      >
        <img
          style={{ position: "absolute", top: 0, zIndex: "-1" }}
          src={background}
        />
        <div className="container mainSec" id="bookingSec">
          <h1 className="secHead">Booking</h1>
          <div className="row mb-4 p-0">
            <div className="col-lg-6 d-flex">
              <button
                type="button"
                className={`${isActive(
                  "All"
                )} btn-outline-secondary border-0 active me-2`}
                onClick={() => setActive("All")}
              >
                All
              </button>
              <button
                type="button"
                className={`${isActive(
                  "Today"
                )} btn-outline-secondary border-0 active me-2`}
                onClick={() => setActive("Today")}
              >
                Today
              </button>
              <button
                type="button"
                className={`${isActive(
                  "Upcoming"
                )} btn-outline-secondary border-0 active me-2`}
                onClick={() => setActive("Upcoming")}
              >
                Upcoming
              </button>
              <button
                type="button"
                className={`${isActive(
                  "Finished"
                )} btn-outline-secondary border-0 active me-2`}
                onClick={() => setActive("Finished")}
              >
                Finished
              </button>
              <button
                type="button"
                className={`${isActive(
                  "Cancelled"
                )} btn-outline-secondary border-0 active me-2`}
                onClick={() => setActive("Cancelled")}
              >
                Cancelled
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
              <button
                data-bs-toggle="offcanvas"
                data-bs-target="#filter-package"
                className="btn btn-outline-secondary ms-3 me-0 rounded-3"
                type="button"
              >
                Filter Packages
              </button>
            </div>
          </div>


          {active === "All" && (
            <motion.div>
              <table className="table table-hover mt-5">
                <tbody>
                  {currentBookings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No booking available
                      </td>
                    </tr>
                  ) : (
                    currentBookings.map((data) => (
                      <tr className="align-middle" key={data.BookingID}>
                        <td style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                          {data.BookingStatus === "Started" ? (
                            <>
                              <img style={{ width: "30%", margin: "auto" }} src={started} />
                              <span>Started</span>
                            </>
                          ) : data.BookingStatus === "Absent" ? (
                            <>
                              <img style={{ width: "30%", margin: "auto" }} src={dotedCircle} />
                              <span>Absent</span>
                            </>
                          ) : data.BookingStatus === "Accepted" ? (
                            <>
                              <img style={{ width: "30%", margin: "auto" }} src={tick} />
                              <span>Accepted</span>
                            </>
                          ) : data.BookingStatus === "Declined" ? (
                            <>
                              <img style={{ width: "30%", margin: "auto" }} src={declined} />
                              <span>Declined</span>
                            </>
                          ) : data.BookingStatus === "Finished" ? (
                            <>
                              <div style={{ width: "30%", margin: "auto" }}>
                                <IoCheckmarkDoneCircle size={32} />
                              </div>
                              <span>Finished</span>
                            </>
                          ) : data.BookingStatus === "Cancelled" ? (
                            <>
                              <img style={{ width: "30%", margin: "auto" }} src={cross} />
                              <span>Cancelled</span>
                            </>
                          ) : (
                            <>
                              <img style={{ width: "30%", margin: "auto" }} src={tick} />
                              <span>Attend</span>
                            </>
                          )}
                        </td>
                        <td>{data.BookingStartDate}</td>
                        <td>{data.InventoryName}</td>
                        <td>{data.AssignedTo}</td>
                        <td className={data.PaymentStatus === "Paid" ? "text-success" : "text-danger"}>
                          {data.PaymentStatus}
                        </td>
                        <td>
                          <button
                            className="btn"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#demo"
                          >
                            <i
                              onClick={() => {
                                setSelectedBookingId(data.BookingID);
                              }}
                              className="fa fa-pencil p-0 me-3"
                              style={{ fontSize: "large" }}
                            ></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <nav>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => handlePageChange(currentPage - 1)}>
                      Previous
                    </a>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li className={`page-item ${currentPage === index + 1 ? 'pagination' : ''}`} key={index}>
                      <a className="page-link" href="#" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </a>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => handlePageChange(currentPage + 1)}>
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </motion.div>
          )}


          {active === "Today" && (
            <motion.div>
              <table className="table table-hover mt-5">
                <tbody>
                  {bookingData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No booking available
                      </td>
                    </tr>
                  ) : (
                    bookingData.map((data) => (
                      <tr className="align-middle" key={data.BookingID}>
                        <td
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "center",
                          }}
                        >
                          {data.BookingStatus === "Started" ? (
                            <>
                              <img
                                style={{ width: "30%", margin: "auto" }}
                                src={started}
                              />
                              <span>Started</span>
                            </>
                          ) : data.BookingStatus === "Absent" ? (
                            <>
                              <img
                                style={{ width: "30%", margin: "auto" }}
                                src={dotedCircle}
                              />
                              <span>Absent</span>
                            </>
                          ) : data.BookingStatus === "Accepted" ? (
                            <>
                              <img
                                style={{ width: "30%", margin: "auto" }}
                                src={tick}
                              />
                              <span>Accepted</span>
                            </>
                          ) : data.BookingStatus === "Declined" ? (
                            <>
                              <img
                                style={{ width: "30%", margin: "auto" }}
                                src={tick}
                              />
                              <span>Declined</span>
                            </>
                          ) : data.BookingStatus === "Finished" ? (
                            <>
                              <div style={{ width: "30%", margin: "auto" }}>
                                <IoCheckmarkDoneCircle size={32} />
                              </div>
                              <span>Finished</span>
                            </>
                          ) : data.BookingStatus === "Cancelled" ? (
                            <>
                              <img
                                style={{ width: "30%", margin: "auto" }}
                                src={cross}
                              />
                              <span>Cancelled</span>
                            </>
                          ) : (
                            <>
                              <img
                                style={{ width: "30%", margin: "auto" }}
                                src={tick}
                              />
                              <span>Attend</span>
                            </>
                          )}
                        </td>
                        <td>{data.BookingStartDate}</td>
                        <td>{data.InventoryName}</td>
                        <td>{data.AssignedTo}</td>
                        <td
                          className={
                            data.PaymentStatus === "Paid"
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {data.PaymentStatus}
                        </td>
                        <td>
                          <button
                            className="btn"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#demo"
                          >
                            <i
                              onClick={() => {
                                setSelectedBookingId(data.BookingID);
                              }}
                              className="fa fa-pencil p-0 me-3"
                              style={{ fontSize: "large" }}
                            ></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <nav>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => handlePageChange(currentPage - 1)}>
                      Previous
                    </a>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li className={`page-item ${currentPage === index + 1 ? 'pagination' : ''}`} key={index}>
                      <a className="page-link" href="#" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </a>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => handlePageChange(currentPage + 1)}>
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </motion.div>
          )}

          {active === "Upcoming" && (
            <motion.div>
              <table className="table table-hover mt-5">
                <tbody>
                  {currentBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No booking available
                      </td>
                    </tr>
                  ) : (
                    currentBookings.map((data) => (
                      <tr className="align-middle" key={data.BookingID}>
                        <td style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                          {data.BookingStatus === "Started" ? (
                            <>
                              <img style={{ width: "30%", margin: "auto" }} src={started} />
                              <span>Started</span>
                            </>
                          ) : data.BookingStatus === "Absent" ? (
                            <>
                              <img style={{ width: "30%", margin: "auto" }} src={dotedCircle} />
                              <span>Absent</span>
                            </>
                          ) : data.BookingStatus === "Accepted" ? (
                            <>
                              <img style={{ width: "30%", margin: "auto" }} src={tick} />
                              <span>Accepted</span>
                            </>
                          ) : data.BookingStatus === "Declined" ? (
                            <>
                              <img style={{ width: "30%", margin: "auto" }} src={tick} />
                              <span>Declined</span>
                            </>
                          ) : data.BookingStatus === "Finished" ? (
                            <>
                              <div style={{ width: "30%", margin: "auto" }}>
                                <IoCheckmarkDoneCircle size={32} />
                              </div>
                              <span>Finished</span>
                            </>
                          ) : data.BookingStatus === "Cancelled" ? (
                            <>
                              <img style={{ width: "30%", margin: "auto" }} src={cross} />
                              <span>Cancelled</span>
                            </>
                          ) : (
                            <>
                              <img style={{ width: "30%", margin: "auto" }} src={tick} />
                              <span>Attend</span>
                            </>
                          )}
                        </td>
                        <td>{data.BookingStartDate}</td>
                        <td>{data.InventoryName}</td>
                        <td>{data.AssignedTo}</td>
                        <td className={data.PaymentStatus === "Paid" ? "text-success" : "text-danger"}>
                          {data.PaymentStatus}
                        </td>
                        <td>
                          <button
                            className="btn"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#demo"
                          >
                            <i
                              onClick={() => setSelectedBookingId(data.BookingID)}
                              className="fa fa-pencil p-0 me-3"
                              style={{ fontSize: "large" }}
                            ></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination for Upcoming */}
              <nav>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => handlePageChange(currentPage - 1)}>
                      Previous
                    </a>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li className={`page-item ${currentPage === index + 1 ? 'pagination' : ''}`} key={index}>
                      <a className="page-link" href="#" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </a>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => handlePageChange(currentPage + 1)}>
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </motion.div>
          )}

          {active === "Finished" && (
            <motion.div>
              <table className="table table-hover mt-5">
                <tbody>
                  {currentBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No booking available
                      </td>
                    </tr>
                  ) : (
                    currentBookings.map((data) => (
                      <tr className="align-middle" key={data.BookingID}>
                        <td style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                          <div style={{ width: "30%", margin: "auto" }}>
                            <IoCheckmarkDoneCircle size={32} />
                          </div>
                          <span>Finished</span>
                        </td>
                        <td>{data.BookingStartDate}</td>
                        <td>{data.InventoryName}</td>
                        <td>{data.AssignedTo}</td>
                        <td className={data.PaymentStatus === "Paid" ? "text-success" : "text-danger"}>
                          {data.PaymentStatus}
                        </td>
                        <td>
                          <button
                            className="btn"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#demo"
                          >
                            <i
                              onClick={() => setSelectedBookingId(data.BookingID)}
                              className="fa fa-pencil p-0 me-3"
                              style={{ fontSize: "large" }}
                            ></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination for Finished */}
              <nav>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => handlePageChange(currentPage - 1)}>
                      Previous
                    </a>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li className={`page-item ${currentPage === index + 1 ? 'pagination' : ''}`} key={index}>
                      <a className="page-link" href="#" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </a>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => handlePageChange(currentPage + 1)}>
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </motion.div>
          )}

          {active === "Cancelled" && (
            <motion.div>
              <table className="table table-hover mt-5">
                <tbody>
                  {currentBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No booking available
                      </td>
                    </tr>
                  ) : (
                    currentBookings.map((data) => (
                      <tr className="align-middle" key={data.BookingID}>
                        <td style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                          <img style={{ width: "30%", margin: "auto" }} src={cross} />
                          <span>Cancelled</span>
                        </td>
                        <td>{data.BookingStartDate}</td>
                        <td>{data.InventoryName}</td>
                        <td>{data.AssignedTo}</td>
                        <td className={data.PaymentStatus === "Paid" ? "text-success" : "text-danger"}>
                          {data.PaymentStatus}
                        </td>
                        <td>
                          <button
                            className="btn"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#demo"
                          >
                            <i
                              onClick={() => setSelectedBookingId(data.BookingID)}
                              className="fa fa-pencil p-0 me-3"
                              style={{ fontSize: "large" }}
                            ></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination for Cancelled */}
              <nav>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => handlePageChange(currentPage - 1)}>
                      Previous
                    </a>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li className={`page-item ${currentPage === index + 1 ? 'pagination' : ''}`} key={index}>
                      <a className="page-link" href="#" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </a>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => handlePageChange(currentPage + 1)}>
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </motion.div>
          )}

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
                      onClick={handleEdit}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body pb-0">
                <div className="row">
                  <div
                    className="col-lg-2"
                    style={{ display: "flex", alignItems: "center" }}
                  >
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "10px 5px",
                  }}
                >
                  <input
                    type="date"
                    style={{
                      borderRadius: "7px",
                      width: "48%",
                      textAlign: "center",
                    }}
                    id="datepicker"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <input
                    type="time"
                    style={{
                      borderRadius: "7px",
                      width: "48%",
                      textAlign: "center",
                    }}
                    id="timepicker"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <div className="card-body pb-0">
                  <div className="row">
                    <select
                      style={{ padding: "10px", borderRadius: "5px" }}
                      value={bookingStatus}
                      onChange={(e) => setBookingStatus(e.target.value)}
                    >
                      <option>Accepted</option>
                      <option>Declined</option>
                      <option>Started</option>
                      <option>Finished</option>
                      <option>Absent</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                  <div
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                    className="row"
                  >
                    <select
                      style={{ padding: "10px", borderRadius: "5px" }}
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      <option>Paid</option>
                      <option>Pending</option>
                    </select>
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

        <div className="offcanvas offcanvas-end" id="filter-package">
          <div className="offcanvas-header mb-0">
            <h3 className="offcanvas-title">Filter Package</h3>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
            ></button>
          </div>
          <div className="offcanvas-body">
            <button className="remove-btn">Remove all filters</button>
            <div className="nav">
              <button
                className={`booking-nav-active ${selectedFilter === "Featured" ? "active" : ""}`}
                onClick={() => setSelectedFilter("Featured")}
              >
                Featured
              </button>
              <button
                className={`${selectedFilter === "Spa" ? "active" : ""}`}
                onClick={() => setSelectedFilter("Spa")}
              >
                Spa
              </button>
              <button
                className={`${selectedFilter === "Massage" ? "active" : ""}`}
                onClick={() => setSelectedFilter("Massage")}
              >
                Massage
              </button>
              <button
                className={`${selectedFilter === "Sonna" ? "active" : ""}`}
                onClick={() => setSelectedFilter("Sonna")}
              >
                Sonna
              </button>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Booking;

