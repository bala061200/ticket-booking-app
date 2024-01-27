// Booking.js

"use client"
import React, { useState, useEffect } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Booking = () => {
  const movielist = [
    { id: 1, name: 'Leo', price: 200 },
    { id: 2, name: 'Joe', price: 150 },
    { id: 3, name: 'Avengers end game', price: 500 },
  ];

  const [selectedSeats, setSelectedSeats] = useState({});
  const [currentselectedseat, setcurrentselectedseat] = useState([]);
  const [seatselcted, setSeatSelected] = useState(0)
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(movielist[0].name);
  const [selectedMoviePrice, setSelectedMoviePrice] = useState(movielist[0].price);
  const [moviename, setmoviename] = useState(movielist[0].name);


  useEffect(() => {
    const savedSeats = JSON.parse(localStorage.getItem('selectedSeats')) || {};
    const savedBookedSeats = JSON.parse(localStorage.getItem('bookedSeats')) || [];
    setSelectedSeats(savedSeats);
    setBookedSeats(savedBookedSeats);
  }, []);

//handle movie selection dropdown
  const handleSelectedMovie = (e) => {
    let moviededetails = e.target.value.split(",")
    setmoviename(e.target.value)
    setSelectedMovie(moviededetails[0]);
    setSelectedMoviePrice(moviededetails[1])
  };


  //generated seat rows based on total seats and seats per row
  const generateSeatRows = () => {
    const totalSeats = 48;
    const seatsPerRow = 8;

    const movieSeats = selectedSeats[selectedMovie] || [];
    const rows = [];
    for (let row = 0; row < totalSeats / seatsPerRow; row++) {
      const Seats = [];
      for (let col = 0; col < seatsPerRow; col++) {
        const seatNumber = row * seatsPerRow + col + 1;
        const seatStatus = isSeatAvailable(seatNumber) ? 'available' : 'booked';
        Seats.push(
          <Seat
            key={seatNumber}
            id={seatNumber}
            selected={movieSeats.includes(seatNumber)}
            status={seatStatus}
            onSelect={handleSeatSelect}
          />
        );
      }
      rows.push(
        <div key={row} className="flex mb-4 gap-5">
          {Seats}
        </div>
      );
    }
    return rows;
  };

  const Seat = ({ id, selected, status, onSelect }) => {
    const handleClick = () => {
      if (status === 'available') {
        onSelect(id);
      }
    }
    return (
      <div
        onClick={handleClick}
        className={`w-5 h-5 border border-gray-400 cursor-pointer ${status === 'booked' ? 'bg-gray-700' : selected ? 'bg-green-500' : 'bg-white'
          }`}
      ></div>
    );
  };

//handled seat available or booked
  const isSeatAvailable = (seatId) => {
    const movieBookedSeats = bookedSeats[selectedMovie] || [];
    return !movieBookedSeats.includes(seatId);
  };

//handle seat selection
  const handleSeatSelect = (seatId) => {
    const movieSeats = selectedSeats[selectedMovie] || [];
    const index = movieSeats.indexOf(seatId);
    if (index !== -1) {
      let poparray = currentselectedseat;
      poparray.pop(seatId);
      setcurrentselectedseat(poparray)
      setSelectedSeats({
        ...selectedSeats,
        [selectedMovie]: movieSeats.filter((seat) => seat !== seatId),
      }); 0
    } else {
      let pusharray = currentselectedseat;
      pusharray.push(seatId)
      setcurrentselectedseat(pusharray)
      setSelectedSeats({
        ...selectedSeats,
        [selectedMovie]: [...movieSeats, seatId],
      });

    }

    let selectedseat = currentselectedseat !== undefined ? [...currentselectedseat, seatId] : [seatId]
    setSeatSelected(selectedseat.length - 1)
  };

//handled book button
  const handleSaveClick = () => {
    const movieBookedSeats = bookedSeats[selectedMovie] || [];
    const newBookedSeats = [...movieBookedSeats, ...selectedSeats[selectedMovie]];
    setBookedSeats({
      ...bookedSeats,
      [selectedMovie]: newBookedSeats,
    });
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    localStorage.setItem('bookedSeats', JSON.stringify({
      ...bookedSeats,
      [selectedMovie]: newBookedSeats,
    }));
    alert('Selected seats saved successfully!');
    setSeatSelected(0)
    setcurrentselectedseat([])

  };



  return (
    <div className="min-h-screen overflow-auto bg-gray-100">
      <div className="px-10 py-10">
        <div className="text-black flex justify-center items-center">Booking page</div>

        <div className="flex justify-center items-center mt-10 gap-2">
          <div className="text-purple-600 font-bold text-sm">SELECT A MOVIE :</div>
          <div>
            <select
              value={moviename}
              onChange={(e) => {
                handleSelectedMovie(e);
              }}
              className="block w-full border-0 px-8 text-gray-900 ring-1 ring-inset ring-gray-400 focus:ring-1 focus:ring-inset focus:ring-orange-600"
            >
              {movielist.map((movies) => (
                <option key={movies.id} value={[movies.name, movies.price]}>
                  {movies.name + " " + "(" + movies.price + ")"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center items-center mt-10">
          <div className="flex bg-gray-200 rounded-md text-black py-4 px-8">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border border-gray-400 bg-white"></div>
                <p className="font-medium text-base">N/A</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border border-gray-400 bg-green-600"></div>
                <p className="font-medium text-base">Selected</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border border-gray-400 bg-gray-700"></div>
                <p className="font-medium text-base">Occupied</p>
              </div>
            </div>
          </div>
        </div>


        <div className='mt-10 flex justify-center'>
          <div className='text-black'>

            You have selected {seatselcted ? seatselcted : 0} seats for a price of {seatselcted ? seatselcted * selectedMoviePrice : 0}
          </div>

        </div>
        <div className="flex justify-center mt-10 ">
          <div className="px-4 py-4 bg-gray-200 items-center">{generateSeatRows()}</div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => classNames(seatselcted == 0 ? {} : handleSaveClick())}
            className={`${seatselcted == 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'
              } bg-gray-300 text-black items-center px-2 border border-black mt-4`}
          >
            BOOK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
