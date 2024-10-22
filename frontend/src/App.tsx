import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './App.css'

const App: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
                    onUploadProgress: (progressEvent) => {
                    const { loaded, total = 0 } = progressEvent;
                    const percent = Math.floor((loaded * 100) / total);
                    setMessage(`Upload progress: ${percent}%`);
                    }
                });
                setData(response.data.data);
                setMessage('File uploaded successfully!');
                setPageCount(Math.ceil(response.data.data.length / 10));
                await fetchData(0);
            } catch (error) {
            setMessage('Error uploading file');
            }
        }
    };

    const fetchData = async (page: number) => {
        const response = await axios.get(`http://localhost:5000/api/files?page=${page + 1}`);
        setData(response.data.data);
        setPageCount(response.data.totalPages);
    };

    const handlePageChange = (selectedPage: { selected: number }) => {
        setCurrentPage(selectedPage.selected);
        fetchData(selectedPage.selected);
    };

    const handleSearch = async () => {
        const response = await axios.get(`http://localhost:5000/api/files/search?q=${searchTerm}`);
        setData(response.data);
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    return (
        <div className='App'>
            <h1>CSV Upload and Display</h1>
            <div className="form">
                <div>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Upload</button>
                </div>
                <div>
                    <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        placeholder="Search..."
                        style={{ width: '100%' }}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
                <p>{message}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Body</th>
                        <th>Email</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.body}</td>
                            <td>{item.email}</td>
                            <td>{item.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
            />
        </div>
    );
};

export default App;
