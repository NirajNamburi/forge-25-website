import React, { useState, useEffect, useMemo } from "react";
import {
  FilterIcon,
  CaretUpIcon,
  CaretDownIcon,
  CloseIcon,
  CarCard,
} from "./CarComponents";

const App = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [yearRange, setYearRange] = useState([1990, new Date().getFullYear()]);
  const [selectedMake, setSelectedMake] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [sortDirection, setSortDirection] = useState("asc");

  const API_BASE_URL = "https://dealership.naman.zip";

  const fetchCarDetails = async (carId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/car/${carId}`);
      if (!response.ok) throw new Error("Failed to fetch car details");
      return await response.json();
    } catch (err) {
      console.error("Car details fetch error:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/cars/sort?key=price&direction=asc`
        );
        if (!response.ok) throw new Error("Failed to fetch cars");

        const data = await response.json();

        const enhancedCars = await Promise.all(
          data.map(async (car) => {
            const details = await fetchCarDetails(car.id);
            return { ...car, ...details };
          })
        );

        setCars(enhancedCars);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load cars. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleCarSelection = async (car) => {
    try {
      const fullDetails = await fetchCarDetails(car.id);
      setSelectedCar({ ...car, ...fullDetails });
    } catch (err) {
      console.error("Error fetching car details:", err);
      setSelectedCar(car);
    }
  };

  const resetFilters = () => {
    setPriceRange([0, 1000000]);
    setSelectedMake("");
    setSortBy("price");
    setSortDirection("asc");
  };

  const uniqueMakes = useMemo(
    () => [...new Set(cars.map((car) => car.make))],
    [cars]
  );

  const filteredCars = useMemo(() => {
    return cars
      .filter(
        (car) =>
          car.price >= priceRange[0] &&
          car.price <= priceRange[1] &&
          car.year >= yearRange[0] &&
          car.year <= yearRange[1] &&
          (!selectedMake || car.make === selectedMake)
      )
      .sort((a, b) => {
        if (sortBy === "price") {
          return sortDirection === "asc"
            ? a.price - b.price
            : b.price - a.price;
        }
        if (sortBy === "year") {
          return sortDirection === "asc" ? a.year - b.year : b.year - a.year;
        }
        return 0;
      });
  }, [cars, priceRange, yearRange, selectedMake, sortBy, sortDirection]);

  const handlePriceInputChange = (index, value) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = value === "" ? "" : Math.max(0, Number(value));
    setPriceRange(newPriceRange);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-blue-600">
          Loading Vehicles...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        {selectedCar ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <button
              onClick={() => setSelectedCar(null)}
              className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
            >
              <CloseIcon className="mr-2" /> Back to Listings
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img
                  src={selectedCar.image || "/placeholder.jpg"}
                  alt={`${selectedCar.make} ${selectedCar.model}`}
                  className="w-full rounded-xl shadow-md"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-4">
                  {selectedCar.make} {selectedCar.model}
                </h1>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    {
                      label: "Price",
                      value: `$${
                        selectedCar.price?.toLocaleString() ?? "Not available"
                      }`,
                    },
                    {
                      label: "Mileage",
                      value: `${
                        selectedCar.mileage?.toLocaleString() ?? "Not available"
                      } miles`,
                    },
                    {
                      label: "Year",
                      value: selectedCar.year ?? "Not specified",
                    },
                    {
                      label: "Transmission",
                      value: selectedCar.transmission ?? "Not specified",
                    },
                    {
                      label: "Condition",
                      value: selectedCar.condition ?? "Not specified",
                    },
                    {
                      label: "VIN",
                      value: selectedCar.vin ?? "Not available",
                    },
                    {
                      label: "Color",
                      value: selectedCar.color ?? "Not specified",
                    },
                    {
                      label: "Fuel Type",
                      value: selectedCar.fuel_type ?? "Not specified",
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-100 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">{label}</div>
                      <div className="font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-700">{selectedCar.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-gray-800">
                Convergent Car Dealership
              </h1>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <FilterIcon className="mr-2" /> Filters
              </button>
            </div>

            {filterOpen && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6 grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 font-semibold">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        handlePriceInputChange(0, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      placeholder="Min Price"
                      min="0"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        handlePriceInputChange(1, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      placeholder="Max Price"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Car Make</label>
                  <select
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">All Makes</option>
                    {uniqueMakes.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block mb-2 font-semibold">Sort By</label>
                  <div className="flex space-x-2 flex-grow">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="price">Price</option>
                      <option value="year">Year</option>
                    </select>
                    <button
                      onClick={() =>
                        setSortDirection(
                          sortDirection === "asc" ? "desc" : "asc"
                        )
                      }
                      className="bg-gray-200 p-2 rounded"
                    >
                      {sortDirection === "asc" ? (
                        <CaretUpIcon />
                      ) : (
                        <CaretDownIcon />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="mt-2 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onClick={() => handleCarSelection(car)}
                />
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div className="text-center text-gray-600 mt-10">
                No cars match your current filters.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
