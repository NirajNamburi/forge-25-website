import React from "react";

export const FilterIcon = () => (
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

export const CaretUpIcon = () => (
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

export const CaretDownIcon = () => (
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

export const CloseIcon = () => (
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

export const CarCard = ({ car, onClick }) => {
  const price = car.price?.toLocaleString() ?? "Price not available";
  const mileage = car.mileage?.toLocaleString() ?? "Mileage not available";
  const transmission = car.transmission ?? "Transmission not specified";
  const color = car.color ?? "Color not specified";
  const fuelType = car.fuel_type ?? "Fuel type not specified";

  return (
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
          <div className="text-2xl font-bold text-green-600">${price}</div>
          <div className="text-gray-500">
            {mileage} miles | {transmission}
          </div>
        </div>
        <div className="text-gray-500 mt-2">
          {color} | {fuelType}
        </div>
      </div>
    </div>
  );
};
