import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/list/main.css'
import 'react-datetime/css/react-datetime.css'
import Datetime from 'react-datetime'
import { v4 as uuidv4 } from 'uuid'
import Swal from 'sweetalert2'
import url from './url'
const initEvents = [
    { title: 'All Day Event', start: getDate('YEAR-MONTH-01') },
    {
        title: 'Long Event',
        start: getDate('YEAR-MONTH-07'),
        end: getDate('YEAR-MONTH-10'),
    },
    {
        groupId: '999',
        title: 'Repeating Event',
        start: getDate('YEAR-MONTH-09T16:00:00+00:00'),
    },
    {
        groupId: '999',
        title: 'Repeating Event',
        start: getDate('YEAR-MONTH-16T16:00:00+00:00'),
    },
    {
        title: 'Conference',
        start: 'YEAR-MONTH-17',
        end: getDate('YEAR-MONTH-19'),
    },
    {
        title: 'Meeting',
        start: getDate('YEAR-MONTH-18T10:30:00+00:00'),
        end: getDate('YEAR-MONTH-18T12:30:00+00:00'),
    },
    { title: 'Lunch', start: getDate('YEAR-MONTH-18T12:00:00+00:00') },
    { title: 'Birthday Party', start: getDate('YEAR-MONTH-19T07:00:00+00:00') },
    { title: 'Meeting', start: getDate('YEAR-MONTH-18T14:30:00+00:00') },
    { title: 'Happy Hour', start: getDate('YEAR-MONTH-18T17:30:00+00:00') },
    {
        title: 'Dinner',
        start: '2022-03-15T17:30:00',
    },
]

function getDate(dayString) {
    const today = new Date()
    const year = today.getFullYear().toString()
    let month = (today.getMonth() + 1).toString()

    if (month.length === 1) {
        month = '0' + month
    }
    // console.log(dayString.replace('YEAR', year).replace('MONTH', month))
    return dayString.replace('YEAR', year).replace('MONTH', month)
}

const PersonalCalendar = () => {
    const [events, setEvents] = useState({
        title: 'Dinner',
        start: '2022-03-15T17:30:00',
    })
    const [startTime, setStartTime] = useState()
    const [title, setTitle] = useState('')

    const newEvents = {
        id: uuidv4(),
        data: [uuidv4(), startTime, title],
    }

    useEffect(() => {
        getData()
    }, [])

    function postData(url, data) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            redirect: 'follow',
        }

        fetch(`${url}/addNewEvents`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                // console.log(result)
                getData()
                setStartTime('')
                setTitle('')
            })
            .catch((error) => console.log('error', error))
    }
    function getData() {
        fetch(url, {
            method: 'GET',
            redirect: 'follow',
        })
            .then((response) => response.json())
            .then((result) => {
                // console.log(result)
                setEvents(result)
            })
            .catch((error) => console.log('error', error))
    }

    return (
        <div>
            <div>
                <p>Personal Calendar</p>
                <span>Add events </span>
                <Datetime
                    value={startTime}
                    onChange={(date) => {
                        setStartTime(date._d)
                    }}
                    inputProps={{ placeholder: 'Select a date and time' }}
                />

                <input
                    type='text'
                    name='title'
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                    placeholder='title'
                />
                <button
                    onClick={() => {
                        postData(url, newEvents)
                    }}
                >
                    OK
                </button>
            </div>
            <br />
            <div className='calendarContainer'>
                <FullCalendar
                    events={events}
                    plugins={[dayGridPlugin]}
                    height='500px'
                    eventClick={function (arg) {
                        Swal.fire({
                            title: `${arg.event.title}`,
                        })
                    }}
                />
            </div>
        </div>
    )
}

export default PersonalCalendar
