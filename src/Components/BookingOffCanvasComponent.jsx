/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

const BookingOffCanvasComponent = ({
  uniqueData,
  date,
  time,
  bookingStatus,
  paymentStatus,
  setDate,
  setTime,
  setBookingStatus,
  setPaymentStatus,
  handleEdit,
  fetchSelectedDataComplete,
  selectedBookingId,
}) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (uniqueData != null) {
      console.log(uniqueData);
      setData(uniqueData);
    }
  }, [uniqueData, setData]);

  if (fetchSelectedDataComplete == false)
    return (
      <>
        {" "}
        <div className="text-center">
          <div className="spinner-border " role="status"></div>
        </div>
      </>
    );

  if (selectedBookingId != uniqueData?.BookingID)
    return (
      <>
        {" "}
        <div className="text-center">
          <div className="spinner-border " role="status"></div>
        </div>
      </>
    );

  return (
    data != null && (
      <div className="offcanvas-body">
        <p className="offCanInvid">
          Invoice ID: <span id="invoiceNo">{data.BookingID}</span>
        </p>
        <p className="offCanCustName">
          Customer
          <br />
          <span id="custName">{data.AssignedTo}</span>
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
                <p className="offCanPackageDetail">{data.InventoryName}</p>
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
                onChange={(e) => setDate(e.target.value)}
                style={{
                  borderRadius: "7px",
                  width: "48%",
                  textAlign: "center",
                }}
                id="datepicker"
                value={date} // Use state for date
              />
              <input
                type="time"
                onChange={(e) => setTime(e.target.value)}
                style={{
                  borderRadius: "7px",
                  width: "48%",
                  textAlign: "center",
                }}
                id="timepicker"
                value={time} // Use state for time
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
                <p id="custName">{data.AssignedTo}</p>
              </div>
            </div>
            <div className="input-group mt-3 w-50">
              <input
                type="text"
                className="form-control"
                id="cName"
                value={data.userPhone}
                defaultValue={data.userPhone}
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
                defaultValue={data.userMail}
                value={data.userMail}
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
    )
  );
};
export default BookingOffCanvasComponent;
