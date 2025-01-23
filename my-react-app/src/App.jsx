import React, { useState, useEffect, useMemo } from "react";

// Simple SVG Icons
const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.5 21v-6.568a2.25 2.25 0 00-.659-1.591L3.409 7.409A2.25 2.25 0 012.75 5.818V4.774c0-.54.384-1.006.917-1.096A48.394 48.394 0 0112 3z"
    />
  </svg>
);

const CaretUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 15.75l7.5-7.5 7.5 7.5"
    />
  </svg>
);

const CaretDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Car card component with improved styling
const CarCard = ({ car, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
  >
    <div className="relative">
      <img
        src={car.image || "/placeholder.jpg"}
        alt={`${car.make} ${car.model}`}
        className="w-full h-56 object-cover"
      />
      <div className="absolute top-4 right-4 bg-white/80 rounded-full px-3 py-1 text-sm font-semibold">
        {car.year}
      </div>
    </div>
    <div className="p-5">
      <h2 className="text-xl font-bold mb-2">
        {car.make} {car.model}
      </h2>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-green-600">
          ${car.price?.toLocaleString() ?? "Price unavailable"}
        </div>
        <div className="text-gray-500">
          {car.mileage?.toLocaleString()} miles
        </div>
      </div>
    </div>
  </div>
);

// Main App component with enhanced interactivity
const App = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [yearRange, setYearRange] = useState([1990, new Date().getFullYear()]);
  const [selectedMake, setSelectedMake] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [sortDirection, setSortDirection] = useState("asc");

  // Define base API URL
  const API_BASE_URL = "https://dealership.naman.zip";

  // Fetch cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cars`);
        if (!response.ok) throw new Error("Failed to fetch cars");

        const data = await response.json();
        setCars(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load cars. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Reset all filters to default
  const resetFilters = () => {
    setPriceRange([0, 100000]);
    setSelectedMake("");
    setSortBy("price");
    setSortDirection("asc");
  };

  // Compute unique makes for filter
  const uniqueMakes = useMemo(
    () => [...new Set(cars.map((car) => car.make))],
    [cars]
  );

  // Filtered and sorted cars
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

  // Handle price input change with improved input handling
  const handlePriceInputChange = (index, value) => {
    const newPriceRange = [...priceRange];

    // Allow empty string or valid number
    newPriceRange[index] = value === "" ? "" : Math.max(0, Number(value));

    setPriceRange(newPriceRange);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-blue-600">
          Loading Vehicles...
        </div>
      </div>
    );
  }

  // Render error state
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
          // Detailed Car View
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
                      value: `$${selectedCar.price?.toLocaleString()}`,
                    },
                    {
                      label: "Mileage",
                      value: `${selectedCar.mileage?.toLocaleString()} miles`,
                    },
                    { label: "Year", value: selectedCar.year },
                    { label: "Transmission", value: selectedCar.transmission },
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
          // Car List View with Filters
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
                {/* Price Range Filter */}
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

                {/* Make Filter */}
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

                {/* Sort Options */}
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
                  onClick={() => {
                    setSelectedCar(car);
                  }}
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
