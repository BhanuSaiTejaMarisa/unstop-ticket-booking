import './App.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { useRef } from 'react';


const initState = [];
let seatNumber = 1;
let id = 1;

while (seatNumber <= 80) {
  const seats = [];
  for (let i = seatNumber; i <= seatNumber + 6; i++) {
    if (i <= 80) {
      seats.push({ seatNo: i, seatAvailable: true, rowId: id });
    }
  }
  initState.push({ id: id++, seats: seats });
  seatNumber += 7;
}

const rowStack = [];
for (let i = 0; i < 7; i++) {
  rowStack.push([])
}
for (let i = 0; i < initState.length; i++) {
  rowStack[initState[i].seats.length - 1].push(initState[i].seats)
}

function App() {
  const [trainSeats, setTrainSeats] = useState(initState);
  const [rowSeatsStack, setRowSeatsStack] = useState(rowStack)
  const [bookedTickets, setBookedTickets] = useState([])

  const inputRef = useRef();

  function bookSeats() {

    const noOfSeats = Number(inputRef.current.value);

    if (noOfSeats > 7) {
      alert("You can book only upto 7 tickets at a time");
      return;
    }

    let bookingComplete = false;
    let bookedTickets = [];

    for (let i = noOfSeats - 1; i < 7; i++) {

      if (rowSeatsStack[i].length) {

        const seats = rowSeatsStack[i].pop();
        const rowId = seats[0].rowId;

        const updatedTrainSeats = trainSeats.map(row => {
          if (row.id === rowId) {
            let otherSeats = [];
            for (let k = 0, j = 0; k < row.seats.length; k++) {
              if (row.seats[k].seatNo === seats[j].seatNo && j < noOfSeats && row.seats[k].seatAvailable === true) {
                row.seats[k].seatAvailable = false;
                bookedTickets.push(row.seats[k].seatNo)
                j++
              }
              else if (row.seats[k].seatAvailable === true) {
                otherSeats.push(row.seats[k])
              }
            }

            if (otherSeats.length > 0) rowSeatsStack[otherSeats.length - 1].push(otherSeats)
            //else make row availability false
          }
          return row;
        })
        setTrainSeats(updatedTrainSeats);
        setRowSeatsStack([...rowSeatsStack])
        bookingComplete = true
        break;
      }
    }
    if (!bookingComplete) {

      const availableSeats = rowSeatsStack.reduce((acc, seats, index) => {
        if (seats.length) {
          return acc + (seats.length * (index + 1))
        }
        return acc
      }, 0)
      // console.log(availableSeats);

      if (availableSeats >= noOfSeats) {
        let bookedSeats = 0;
        while (bookedSeats !== noOfSeats) {
          for (let i = noOfSeats - 2; i >= 0;) {
            if (rowSeatsStack[i].length) {

              let seats = rowSeatsStack[i].pop();
              const rowId = seats[0].rowId;

              // eslint-disable-next-line no-loop-func
              const updatedTrainSeats = trainSeats.map(row => {
                if (row.id === rowId) {
                  let otherSeats = []
                  for (let k = 0, j = 0; k < row.seats.length && j < seats.length; k++) {
                    if (row.seats[k].seatNo === seats[j].seatNo && bookedSeats < noOfSeats && row.seats[k].seatAvailable === true) {
                      row.seats[k].seatAvailable = false;
                      bookedTickets.push(row.seats[k].seatNo)

                      bookedSeats++;
                      j++;
                    }
                    else if (row.seats[k].seatAvailable === true) {
                      otherSeats.push(row.seats[k])
                    }
                  }
                  // bookedSeats+=

                  if (otherSeats.length > 0) rowSeatsStack[otherSeats.length - 1].push(otherSeats)
                  //else make row availability false
                }
                return row;
              })
              setTrainSeats(updatedTrainSeats);
              setRowSeatsStack([...rowSeatsStack])
              if (bookedSeats === noOfSeats) {
                break;
              }
            }
            else {
              i--
            }
          }
        }
      }
      else {
        alert(`Number of seats available are ${availableSeats}`)
      }

    }
    setBookedTickets(bookedTickets)

  }
  // console.log({ trainSeats, rowSeatsStack });
  // console.log({ bookedTickets });
  return (
    <div className="App">
      <input ref={inputRef} />
      <button onClick={bookSeats}>Book seats</button>
      <div>Booked Tickets: {bookedTickets.join(", ")}</div>
      <div className='block'>
        {trainSeats.map(row => (
          <div className='row' key={"row" + row.id}>
            {row.seats.map(seat => (
              <div className={classNames('seat ', { "unavailable": !seat.seatAvailable })} key={"seat" + seat.seatNo}>{seat.seatNo}</div>
            ))}
            <div>R{row.id}</div>
          </div>
        ))}

      </div>
    </div >
  );
}

export default App;
