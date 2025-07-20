import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";


const Funding = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(0);
  const size = 10;

  const { data: response = {}, isLoading } = useQuery({
    queryKey: ["funding", page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/funding?page=${page}&size=${size}`);
      return res.data;
    },
  });

  const { total = 0, data: funds = [] } = response;
  const totalPages = Math.ceil(total / size);

  return (
    <>
      <Helmet>
        <title>Funding | Blood Bridge</title>
      </Helmet>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Funding</h1>
          <Link to="/give-fund" className="btn btn-primary">
            Give Fund
          </Link>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((fund) => (
                  <tr key={fund._id}>
                    <td>{fund.userName}</td>
                    <td>${fund.amount.toFixed(2)}</td>
                    <td>{new Date(fund.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx)}
                  className={`btn btn-sm mx-1 ${page === idx ? "btn-primary" : ""}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Funding;
