const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <a
            className="page-link"
            href="#"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </a>
        </li>
        {[...Array(totalPages)].map((_, index) => (
          <li
            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
            key={index}
          >
            <a
              className="page-link"
              href="#"
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </a>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <a
            className="page-link"
            href="#"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
