import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataList } from "../store/action/dataListAction";

// {
//   "info": {
//     "count": 826,
//     "pages": 42,
//     "next": "https://rickandmortyapi.com/api/character/?page=3",
//     "prev": "https://rickandmortyapi.com/api/character/?page=1"
//   },
//   "results": [
//     {
//       "id": 21,
//       "name": "Aqua Morty",
//       "status": "unknown",
//       "species": "Humanoid",
//       "type": "Fish-Person",
//       "gender": "Male",
//       "origin": {
//         "name": "unknown",
//         "url": ""
//       },
//       "location": {
//         "name": "Citadel of Ricks",
//         "url": "https://rickandmortyapi.com/api/location/3"
//       },
//       "image": "https://rickandmortyapi.com/api/character/avatar/21.jpeg",
//       "episode": [
//         "https://rickandmortyapi.com/api/episode/10",
//         "https://rickandmortyapi.com/api/episode/22"
//       ],
//       "url": "https://rickandmortyapi.com/api/character/21",
//       "created": "2017-11-04T22:39:48.055Z"
//     },

const DataList = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const dispatch = useDispatch();
    const { dataList } = useSelector((state) => state.dataList);

    const totalPages = dataList?.info?.pages;

    const pagesPerGroup = 10;

    const startPage =
        Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;

    const endPage = Math.min(
        startPage + pagesPerGroup - 1,
        totalPages
    );

    const visiblePages = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
    );


    useEffect(() => {
        dispatch(getDataList(currentPage));
    }, [dispatch, currentPage]);

    console.log("Data List:", dataList);
    console.log("Total Pages:", totalPages);

    return (
        <div>
            <h2 className="d-flex justify-content-center text-info-emphasis mt-5">Data List</h2>
            <div className="container my-3">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Name</th>
                            <th scope="col">Status</th>
                            <th scope="col">Species</th>
                            <th scope="col">OriginName</th>
                            <th scope="col">LocationName</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataList?.results?.map((data, index) => (
                            <tr key={index}>
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td>{data.status}</td>
                                <td>{data.species}</td>
                                <td>{data.origin.name}</td>
                                <td>{data.location.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <nav aria-label="..." className="d-flex justify-content-center">
                    <ul className="pagination">
                        <li className="page-item">
                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                        </li>

                        {visiblePages.map((page) => (
                        <li key={page} className="page-item">
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        </li>
                        ))}

                        <li className="page-item">
                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default DataList;