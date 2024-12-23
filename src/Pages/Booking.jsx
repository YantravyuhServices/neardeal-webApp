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
import Pagination from "../Components/Pagination";
import { format } from "date-fns";
import BookingOffCanvasComponent from "../Components/BookingOffCanvasComponent";

const Booking = () => {
  const jwtUserToken = Cookies.get("user_token");
  const userData = JSON.parse(jwtUserToken);
  const [bookingData, setBookingData] = useState([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(false);
  const [fetchSelectedDataComplete, setFetchSelectedDataComplete] = useState(false);

  // State for offcanvas form
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookingStatus, setBookingStatus] = useState("Attend");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isActive = (path) => {
    return active === path ? "btn" : "";
  };

  const handleSubmit = async (filter) => {
    setBookingData([]); // Reset booking data before fetching
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
      console.log(data)
      // const uniqueIds = new Set();  // Set to store unique IDs
      // const uniqueObjects = [];     // Array to store unique objects

      // for (const obj of data.data) {
      //     if (!uniqueIds.has(obj.BookingID)) {  // Check if ID is already in the Set
      //         uniqueIds.add(obj.BookingID);      // Add the ID to the Set
      //         uniqueObjects.push(obj);    // Add the object to the result array
      //     }
      // }

      // console.log(uniqueObjects)

      setBookingData(data.data); // Replace old data with new data
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
    // Fetch bookings when the active filter or the page changes
    handleSubmit(active);
    setCurrentPage(1); // Reset to first page on filter change
  }, [active]);

  useEffect(() => {
    // Trigger fetching of data whenever the page changes
    if (currentPage > 1) {
      handleSubmit(active);
    }
  }, [currentPage]);

  const [filter, setFilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const handleFilter = async (filter) => {
    try {
      setFilter(true);
    } catch (error) {
      console.log(error);
    }
  };

  const ITEMS_PER_PAGE = 5; // Adjust this as needed

  // Calculate total pages
  const totalPages = Math.ceil(bookingData.length / ITEMS_PER_PAGE);

  // Slice booking data for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  currentBookings = bookingData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle page change

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setLoading(true); // Show loading spinner
      setBookingData([]); // Clear bookings when changing page
      setCurrentPage(newPage); // Set the new page number
    }
  };

  const [uniqueData, setUniqueData] = useState(null);

  const fetchBooking = async (id) => {
    setFetchSelectedDataComplete(false)
    console.log(id);

    try {
      const response = await fetch(
        "https://wellness.neardeal.me/WAPI/fetchBookingDetailsMW.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: id,
          }),
        }
      );

      const data = await response.json();
      const booking = data.message[0];
console.log("Unique", uniqueData);

      // Set the state with formatted values
      setTimeout(() => {
        setUniqueData(booking);
        setFetchSelectedDataComplete(true)
      }, 1000);

      // console.log(booking)


      // Set booking status and payment status
      setBookingStatus(booking.BookingStatus);
      setPaymentStatus(booking.PaymentStatus);

      // Format the booking end date and time

      // console.log("Date", bookingStartDate)
      if (booking?.BookingStartDate == "0000-00-00 00:00:00") {
        // if booking start date is empty

        setDate("0000-00-00");
        setTime("00:00"); // Set default time to 00:00
      } else {
        const bookingStartDate = booking?.BookingStartDate
          ? new Date(booking.BookingStartDate)
          : new Date();
        const formattedDate = format(bookingStartDate, "yyyy-MM-dd"); // YYYY-MM-DD format for the date input
        const formattedTime = format(bookingStartDate, "HH:mm"); // HH:mm format for the time input

        // Set date and time in state (you need to add these two lines)
        console.log(formattedDate)
        setDate(formattedDate);
        setTime(formattedTime);
      }

      setFetchSelectedDataComplete(true)

      console.log("data", data.message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="booking-container-section" style={{ display: "flex" }}>
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
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border " role="status"></div>
                </div>
              ) : (
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
                                  style={{ width: "25%", margin: "auto" }}
                                  src={started}
                                />
                                <span>Started</span>
                              </>
                            ) : data.BookingStatus === "Absent" ? (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
                                  src={dotedCircle}
                                />
                                <span>Absent</span>
                              </>
                            ) : data.BookingStatus === "Accepted" ? (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
                                  src={tick}
                                />
                                <span>Accepted</span>
                              </>
                            ) : data.BookingStatus === "Declined" ? (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
                                  src={declined}
                                />
                                <span>Declined</span>
                              </>
                            ) : data.BookingStatus === "Finished" ? (
                              <>
                                <div style={{ width: "25%", margin: "auto" }}>
                                  <IoCheckmarkDoneCircle size={32} />
                                </div>
                                <span>Finished</span>
                              </>
                            ) : data.BookingStatus === "Cancelled" ? (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
                                  src={cross}
                                />
                                <span>Cancelled</span>
                              </>
                            ) : (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
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
                              onClick={() => {
                                setUniqueData(null)
                                setSelectedBookingId(data.BookingID);
                                fetchBooking(data.BookingID);
                              }}
                            >
                              <i

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
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </motion.div>
          )}

          {active === "Today" && (
            <motion.div>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border " role="status"></div>
                </div>
              ) : (
                <table className="table table-hover mt-5">
                  <tbody>
                    {bookingData.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No booking available
                        </td>
                      </tr>
                    ) : (
                      bookingData.map((data) => console.log(data) || (
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
                                  style={{ width: "25%", margin: "auto" }}
                                  src={started}
                                />
                                <span>Started</span>
                              </>
                            ) : data.BookingStatus === "Absent" ? (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
                                  src={dotedCircle}
                                />
                                <span>Absent</span>
                              </>
                            ) : data.BookingStatus === "Accepted" ? (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
                                  src={tick}
                                />
                                <span>Accepted</span>
                              </>
                            ) : data.BookingStatus === "Declined" ? (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
                                  src={tick}
                                />
                                <span>Declined</span>
                              </>
                            ) : data.BookingStatus === "Finished" ? (
                              <>
                                <div style={{ width: "25%", margin: "auto" }}>
                                  <IoCheckmarkDoneCircle size={32} />
                                </div>
                                <span>Finished</span>
                              </>
                            ) : data.BookingStatus === "Cancelled" ? (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
                                  src={cross}
                                />
                                <span>Cancelled</span>
                              </>
                            ) : (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
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
                              onClick={() => {
                                setUniqueData(null)
                                setSelectedBookingId(data.BookingID);
                                fetchBooking(data.BookingID);
                              }}
                            >
                              <i

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
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </motion.div>
          )}

          {active === "Upcoming" && (
            <motion.div>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border " role="status"></div>
                </div>
              ) : (
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
                                  style={{ width: "25%", margin: "auto" }}
                                  src={started}
                                />
                                <span>Started</span>
                              </>
                            ) : data.BookingStatus === "Absent" ? (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
                                  src={dotedCircle}
                                />
                                <span>Absent</span>
                              </>
                            ) : data.BookingStatus === "Accepted" ? (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
                                  src={tick}
                                />
                                <span>Accepted</span>
                              </>
                            ) : data.BookingStatus === "Declined" ? (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
                                  src={tick}
                                />
                                <span>Declined</span>
                              </>
                            ) : data.BookingStatus === "Finished" ? (
                              <>
                                <div style={{ width: "25%", margin: "auto" }}>
                                  <IoCheckmarkDoneCircle size={32} />
                                </div>
                                <span>Finished</span>
                              </>
                            ) : data.BookingStatus === "Cancelled" ? (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
                                  src={cross}
                                />
                                <span>Cancelled</span>
                              </>
                            ) : (
                              <>
                                <img
                                  style={{ width: "25%", margin: "auto" }}
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
                              onClick={() => {
                                setUniqueData({})
                                setSelectedBookingId(data.BookingID);
                                fetchBooking(data.BookingID);
                              }}
                            >
                              <i

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
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </motion.div>
          )}

          {active === "Finished" && (
            <motion.div>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border " role="status"></div>
                </div>
              ) : (
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
                          <td
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              textAlign: "center",
                            }}
                          >
                            <div style={{ width: "25%", margin: "auto" }}>
                              <IoCheckmarkDoneCircle size={32} />
                            </div>
                            <span>Finished</span>
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
                              onClick={() => {
                                setUniqueData(null)
                                setSelectedBookingId(data.BookingID);
                                fetchBooking(data.BookingID);
                              }}
                            >
                              <i

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
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </motion.div>
          )}

          {active === "Cancelled" && (
            <motion.div>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border " role="status"></div>
                </div>
              ) : (
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
                          <td
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              textAlign: "center",
                            }}
                          >
                            <img
                              style={{ width: "25%", margin: "auto" }}
                              src={cross}
                            />
                            <span>Cancelled</span>
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
                              onClick={() => {
                                setUniqueData(null)
                                setSelectedBookingId(data.BookingID);
                                fetchBooking(data.BookingID);
                              }}
                            >
                              <i

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
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
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

          <BookingOffCanvasComponent
            uniqueData={uniqueData}
            date={date}
            time={time}
            bookingStatus={bookingStatus}
            paymentStatus={paymentStatus}
            setDate={setDate}
            setTime={setTime}
            setBookingStatus={setBookingStatus}
            setPaymentStatus={setPaymentStatus}
            handleEdit={handleEdit}
            fetchSelectedDataComplete={fetchSelectedDataComplete}
            selectedBookingId={selectedBookingId}
          />
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
                className={`booking-nav-active ${selectedFilter === "Featured" ? "active" : ""
                  }`}
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