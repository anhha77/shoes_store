import React, { useState, useEffect } from "react";
import { Alert, Box, Container, Stack } from "@mui/material";
import ProductFilter from "../components/ProductFilter";
import ProductSearch from "../components/ProductSearch";
import ProductSort from "../components/ProductSort";
import ProductList from "../components/ProductList";
import { FormProvider } from "../components/form";
import { useForm } from "react-hook-form";
import apiService from "../app/apiService";
import orderBy from "lodash/orderBy";
import LoadingScreen from "../components/LoadingScreen";
import { filter } from "lodash";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const defaultValues = {
    gender: [],
    category: "All",
    priceRange: "",
    sortBy: "featured",
    searchQuery: "",
  };
  const methods = useForm({
    defaultValues,
  });

  const { watch, reset } = methods;
  const filters = watch();

  const applyFilter = () => {
    console.log("hi");
    let previousListProducts = [];
    if (filters.gender.length > 0) {
      previousListProducts = products.filter((product) =>
        filters.gender.includes(product.gender)
      );
    }
    if (filters.category !== "All") {
      if (previousListProducts.length === 0) {
        previousListProducts = products.filter(
          (product) => filters.category === product.category
        );
      } else {
        previousListProducts = previousListProducts.filter(
          (product) => filters.category === product.category
        );
      }
    }
    if (filters.priceRange) {
      if (previousListProducts.length === 0) {
        previousListProducts = products.filter((product) => {
          if (filters.priceRange === "below") {
            return product.price < 25;
          } else if (filters.priceRange === "between") {
            return product.price >= 25 && product.price <= 75;
          }
          return product.price > 75;
        });
      } else {
        previousListProducts = previousListProducts.filter((product) => {
          if (filters.priceRange === "below") {
            return product.price < 25;
          } else if (filters.priceRange === "between") {
            return product.price >= 25 && product.price <= 75;
          }
          return product.price > 75;
        });
      }
    }
    if (filters.sortBy === "featured") {
      if (previousListProducts.length === 0) {
        previousListProducts = orderBy(products, ["sold"], ["desc"]);
      } else {
        previousListProducts = orderBy(
          previousListProducts,
          ["sold"],
          ["desc"]
        );
      }
    }
    if (filters.sortBy === "newest") {
      if (previousListProducts.length === 0) {
        previousListProducts = orderBy(products, ["createdAt"], ["desc"]);
      } else {
        previousListProducts = orderBy(
          previousListProducts,
          ["createdAt"],
          ["desc"]
        );
      }
    }
    if (filters.sortBy === "priceDesc") {
      if (previousListProducts.length === 0) {
        previousListProducts = orderBy(products, ["price"], ["desc"]);
      } else {
        previousListProducts = orderBy(
          previousListProducts,
          ["price"],
          ["desc"]
        );
      }
    }
    if (filters.sortBy === "priceAsc") {
      if (previousListProducts.length === 0) {
        previousListProducts = orderBy(products, ["price"], ["asc"]);
      } else {
        previousListProducts = orderBy(
          previousListProducts,
          ["price"],
          ["asc"]
        );
      }
    }
    if (filters.searchQuery) {
      if (previousListProducts.length === 0) {
        previousListProducts = products.filter((product) =>
          product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );
      } else {
        previousListProducts = previousListProducts.filter((product) =>
          product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );
      }
    }
    if (previousListProducts.length === 0) return products;
    return previousListProducts;
  };

  const filterProducts = applyFilter();

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const res = await apiService.get("/products");
        setProducts(res.data);
        setError("");
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
      setLoading(false);
    };
    getProducts();
  }, []);

  // function applyFilter(products, filters) {
  //   const { sortBy } = filters;
  //   console.log("hi");
  //   let filteredProducts = products;
  //   let sortedProducts = [];

  //   // FILTER PRODUCTS

  //   if (filters.gender.length > 0) {
  //     sortedProducts = products.filter((product) =>
  //       filters.gender.includes(product.gender)
  //     );
  //   }
  //   if (filters.category !== "All") {
  //     sortedProducts = products.filter(
  //       (product) => product.category === filters.category
  //     );
  //   }
  //   if (filters.priceRange) {
  //     sortedProducts = products.filter((product) => {
  //       if (filters.priceRange === "below") {
  //         return product.price < 25;
  //       }
  //       if (filters.priceRange === "between") {
  //         return product.price >= 25 && product.price <= 75;
  //       }
  //       return product.price > 75;
  //     });
  //   }
  //   if (filters.searchQuery) {
  //     sortedProducts = products.filter((product) =>
  //       product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
  //     );
  //   }

  //   // SORT BY
  //   const resultProducts =
  //     sortedProducts.length === 0 ? products : sortedProducts;

  //   if (sortBy === "featured") {
  //     filteredProducts = orderBy(resultProducts, ["sold"], ["desc"]);
  //   }
  //   if (sortBy === "newest") {
  //     filteredProducts = orderBy(resultProducts, ["createdAt"], ["desc"]);
  //   }
  //   if (sortBy === "priceDesc") {
  //     filteredProducts = orderBy(resultProducts, ["price"], ["desc"]);
  //   }
  //   if (sortBy === "priceAsc") {
  //     filteredProducts = orderBy(resultProducts, ["price"], ["asc"]);
  //   }

  //   return filteredProducts;
  // }

  return (
    <Container sx={{ display: "flex", minHeight: "100vh", mt: 3 }}>
      <Stack>
        <FormProvider methods={methods}>
          <ProductFilter
            resetFilter={() =>
              reset({
                gender: [],
                category: "All",
                priceRange: "",
                sortBy: "featured",
                searchQuery: "",
              })
            }
          />
        </FormProvider>
      </Stack>
      <Stack sx={{ flexGrow: 1 }}>
        <FormProvider methods={methods}>
          <Stack
            spacing={2}
            direction={{ sm: "column", md: "row" }}
            alignItems={{ sm: "flex-end" }}
            justifyContent="space-between"
            mb={2}
          >
            <ProductSearch />
            <ProductSort />
          </Stack>
        </FormProvider>
        <Box sx={{ position: "relative", height: 1 }}>
          {loading ? (
            <LoadingScreen />
          ) : (
            <>
              {error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                <ProductList products={filterProducts} />
              )}
            </>
          )}
        </Box>
      </Stack>
    </Container>
  );
}

export default HomePage;
