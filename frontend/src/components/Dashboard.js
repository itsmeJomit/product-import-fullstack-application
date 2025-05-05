import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import api from "../api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products from the API
  const fetchProducts = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await api.get("/products", {
        params: { page, search },
      });
      setProducts(res.data.data);
      setCurrentPage(res.data.current_page);
      setTotalPages(res.data.last_page);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, searchTerm);
  }, [searchTerm]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("products/import-products", formData);
      fetchProducts();
    } catch (err) {
      setError(
        "Import failed, Please check your file for errors or duplications"
      );
    }
  };

  return (
    <Box maxWidth={800} mx="auto" mt={6}>
      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleUpload} style={{ marginBottom: 24 }}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        {file && (
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ ml: 2 }}
          >
            Import CSV
          </Button>
        )}
      </form>

      <Typography variant="h6" gutterBottom>
        Products
      </Typography>
      <TextField
        label="Search Products"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="product table">
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="right">SKU</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell component="th" scope="row">
                      {product.name}
                    </TableCell>
                    <TableCell align="right">{product.sku}</TableCell>
                    <TableCell align="right">{product.price} INR</TableCell>
                    <TableCell align="right">{product.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Controls */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              disabled={currentPage === 1}
              onClick={() => fetchProducts(currentPage - 1)}
              sx={{ mr: 2 }}
            >
              Previous
            </Button>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => fetchProducts(currentPage + 1)}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
