import React, { useState } from "react";
import { useTable } from "react-table";
import "../App.css";
import SideBar from "../Components/SideBar";
import background from "../assets/background.svg";
import { motion } from "framer-motion";

const Transaction = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const data = React.useMemo(
        () => [
            {
                price: "$499",
                customer: "Mac",
                packageName: "Anti Ageing Facial",
                invoiceId: "INV-17067",
                dateTime: "--",
                status: "Uncaptured",
            },
            {
                price: "$499",
                customer: "Ada",
                packageName: "Anti Ageing Facial",
                invoiceId: "INV-17067",
                dateTime: "23 June 2024 10:00",
                status: "Succeeded",
            },
            {
                price: "$499",
                customer: "Cherish",
                packageName: "Anti Ageing Facial",
                invoiceId: "INV-17067",
                dateTime: "23 June 2024 9:00",
                status: "Succeeded",
            },
            {
                price: "$499",
                customer: "Jimmy",
                packageName: "Anti Ageing Facial",
                invoiceId: "INV-17067",
                dateTime: "23 June 2024 8:30",
                status: "Succeeded",
            },
        ],
        []
    );

    // Filter the data based on the search term
    const filteredData = React.useMemo(() => {
        return data.filter(row => 
            Object.values(row).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm]);

    const columns = React.useMemo(
        () => [
            {
                Header: () => <input type="checkbox" />,
                accessor: 'checkbox',
            },
            {
                Header: "Price",
                accessor: "price",
            },
            {
                Header: "Customer",
                accessor: "customer",
            },
            {
                Header: "Package Name",
                accessor: "packageName",
            },
            {
                Header: () => (
                    <div>
                        Invoice ID <span>&#x25BC;</span>
                    </div>
                ),
                accessor: "invoiceId",
            },
            {
                Header: "Date & Time",
                accessor: "dateTime",
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) => <span className={`status ${value.toLowerCase()}`}>{value}</span>,
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: filteredData });

    return (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                style={{ width: '80%' }}>
                <img style={{ position: 'absolute', top: 0, zIndex: '-1' }} src={background} alt="Background" />

                <div className="container mainSec" id="bookingSec">
                    <h1 className="secHead">Payments</h1>
                    <div className="row mb-4 p-0">
                        <div className="col-lg-6 d-flex">
                            <button type="button" className="btn btn-outline-secondary border-0 active me-2">All</button>
                            <button type="button" className="btn btn-outline-secondary border-0 me-2">Succeeded</button>
                            <button type="button" className="btn btn-outline-secondary border-0 me-2">Refunded</button>
                            <button type="button" className="btn btn-outline-secondary border-0 me-2">Uncaptured</button>
                            <button type="button" className="btn btn-outline-secondary border-0 me-2">Failed</button>
                        </div>
                        <div className="col-lg-6 d-flex input-group justify-content-end ms-5" style={{ maxWidth: '45%' }}>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <button className="btn btn-outline-secondary me-2 rounded-3" type="button">
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className="payment-table-container">
                        <table {...getTableProps()} className="payment-table">
                            <thead>
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {rows.map(row => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => {
                                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Transaction;
