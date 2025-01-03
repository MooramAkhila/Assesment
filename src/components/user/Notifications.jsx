import React from 'react';
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
  FaWhatsapp,
  FaExclamationTriangle,
  FaClock
} from 'react-icons/fa';

const NotificationsContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const NotificationSection = styled.div`
  margin-bottom: 30px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${props => props.type === 'overdue' ? '#dc3545' : '#ffc107'};

  h2 {
    margin: 0;
    color: ${props => props.type === 'overdue' ? '#dc3545' : '#856404'};
  }

  .icon {
    font-size: 24px;
    color: ${props => props.type === 'overdue' ? '#dc3545' : '#ffc107'};
  }
`;

const NotificationGrid = styled.div`
  display: grid;
  gap: 15px;
`;

const CommunicationIcon = styled.div`
  color: #007bff;
  font-size: 24px;
`;

const NotificationCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: ${props => props.type === 'overdue' ? '#fff5f5' : '#fff8e1'};
  border-radius: 8px;
  border-left: 4px solid ${props => props.type === 'overdue' ? '#dc3545' : '#ffc107'};

  @media (max-width: 480px) {
    flex-direction: column;
    padding: 12px;
    
    ${CommunicationIcon} {
      align-self: center;
    }
  }

  &.overdue {
    border-left-color: #dc3545;
    background-color: #fff5f5;
  }
  
  &.today {
    border-left-color: #ffc107;
    background-color: #fff8e1;
  }
`;

const CompanyInfo = styled.div`
  flex: 1;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CompanyName = styled.h3`
  margin: 0 0 5px 0;
  color: #2c3e50;
`;

const CommunicationDetails = styled.div`
  color: #666;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

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

const DaysOverdue = styled.div`
  color: #dc3545;
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
`;

const Notifications = () => {
  const { notifications } = useSelector(state => state.user);

  return (
    <NotificationsContainer>
      <NotificationSection>
        <SectionHeader type="overdue">
          <FaExclamationTriangle className="icon" />
          <h2>Overdue Communications ({notifications.overdue.length})</h2>
        </SectionHeader>
        <NotificationGrid>
          {notifications.overdue.map(notification => (
            <NotificationCard key={notification.id} className="overdue">
              <CommunicationIcon>
                {getCommunicationIcon(notification.communicationType)}
              </CommunicationIcon>
              <CompanyInfo>
                <CompanyName>{notification.companyName}</CompanyName>
                <CommunicationDetails>
                  <div>Last Communication: {notification.lastCommunication}</div>
                  <div>Due Date: {notification.dueDate}</div>
                  <DaysOverdue>
                    {notification.daysPastDue} days overdue
                  </DaysOverdue>
                  {notification.lastCommDate && (
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      Last communicated on: {notification.lastCommDate}
                    </div>
                  )}
                </CommunicationDetails>
              </CompanyInfo>
            </NotificationCard>
          ))}
          {notifications.overdue.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666' }}>
              No overdue communications
            </div>
          )}
        </NotificationGrid>
      </NotificationSection>

      <NotificationSection>
        <SectionHeader type="today">
          <FaClock className="icon" />
          <h2>Today's Communications ({notifications.today.length})</h2>
        </SectionHeader>
        <NotificationGrid>
          {notifications.today.map(notification => (
            <NotificationCard key={notification.id} className="today">
              <CommunicationIcon>
                {getCommunicationIcon(notification.communicationType)}
              </CommunicationIcon>
              <CompanyInfo>
                <CompanyName>{notification.companyName}</CompanyName>
                <CommunicationDetails>
                  <div>Type: {notification.communicationType}</div>
                  <div>Date: {formatDate(notification.date)}</div>
                  {notification.notes && (
                    <div>Notes: {notification.notes}</div>
                  )}
                </CommunicationDetails>
              </CompanyInfo>
            </NotificationCard>
          ))}
          {notifications.today.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666' }}>
              No communications scheduled for today
            </div>
          )}
        </NotificationGrid>
      </NotificationSection>
    </NotificationsContainer>
  );
};

export default Notifications; 