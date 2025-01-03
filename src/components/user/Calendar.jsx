import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { 
  FaLinkedin, 
  FaEnvelope, 
  FaPhone, 
  FaComment, 
  FaTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp 
} from 'react-icons/fa';

const CalendarContainer = styled.div`
  padding: 20px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MonthNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #ddd;
  border: 1px solid #ddd;
`;

const WeekDayHeader = styled.div`
  background: #f8f9fa;
  padding: 10px;
  text-align: center;
  font-weight: bold;
`;

const CalendarCell = styled.div`
  background: white;
  min-height: 120px;
  padding: 10px;
  
  ${props => props.isToday && `
    background: #e8f4ff;
  `}

  ${props => props.isOtherMonth && `
    background: #f8f9fa;
    color: #adb5bd;
  `}
`;

const DateNumber = styled.div`
  font-weight: ${props => props.isToday ? 'bold' : 'normal'};
  color: ${props => props.isToday ? '#007bff' : 'inherit'};
  margin-bottom: 5px;
`;

const Event = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${props => props.isPast ? '#e9ecef' : '#007bff'};
  color: ${props => props.isPast ? '#666' : 'white'};
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  margin-bottom: 4px;
  cursor: pointer;

  svg {
    font-size: 14px;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const getCommunicationIcon = (type) => {
  if (!type) return <FaComment />;
  
  switch(type.toLowerCase()) {
    case 'linkedin post':
    case 'linkedin message':
      return <FaLinkedin />;
    case 'twitter':
      return <FaTwitter />;
    case 'facebook':
      return <FaFacebook />;
    case 'instagram':
      return <FaInstagram />;
    case 'whatsapp':
      return <FaWhatsapp />;
    case 'email':
      return <FaEnvelope />;
    case 'phone call':
      return <FaPhone />;
    default:
      return <FaComment />;
  }
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { calendarEvents } = useSelector(state => state.user);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const previousMonth = new Date(year, month, 0);
    const daysInPreviousMonth = previousMonth.getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPreviousMonth - i),
        isOtherMonth: true
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isOtherMonth: false
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isOtherMonth: true
      });
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth(currentDate);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <MonthNavigator>
          <NavButton onClick={() => navigateMonth(-1)}>←</NavButton>
          <h2>
            {currentDate.toLocaleString('default', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          <NavButton onClick={() => navigateMonth(1)}>→</NavButton>
        </MonthNavigator>
      </CalendarHeader>

      <CalendarGrid>
        {weekDays.map(day => (
          <WeekDayHeader key={day}>{day}</WeekDayHeader>
        ))}
        
        {days.map(({ date, isOtherMonth }, index) => {
          const events = getEventsForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <CalendarCell 
              key={index}
              isToday={isToday}
              isOtherMonth={isOtherMonth}
            >
              <DateNumber isToday={isToday}>
                {date.getDate()}
              </DateNumber>
              {events.map(event => (
                <Event
                  key={event.id}
                  isPast={event.isPast}
                  title={`${event.companyName}: ${event.notes}`}
                >
                  {getCommunicationIcon(event.type)}
                  <span>{event.companyName}</span>
                </Event>
              ))}
            </CalendarCell>
          );
        })}
      </CalendarGrid>
    </CalendarContainer>
  );
};

export default Calendar; 