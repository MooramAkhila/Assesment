import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData, logCommunication, setHighlightSettings } from '../../store/slices/userSlice';
import { deleteCompany } from '../../store/slices/companySlice';
import { 
  FaLinkedin, 
  FaEnvelope, 
  FaPhone, 
  FaComment, 
  FaBell, 
  FaTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp, 
  FaTrash 
} from 'react-icons/fa';

const DEFAULT_COMMUNICATION_METHODS = [
  { id: 1, name: 'LinkedIn Post' },
  { id: 2, name: 'LinkedIn Message' },
  { id: 3, name: 'Email' },
  { id: 4, name: 'Phone Call' },
  { id: 5, name: 'Twitter' },
  { id: 6, name: 'Facebook' },
  { id: 7, name: 'Instagram' },
  { id: 8, name: 'WhatsApp' }
];

const DashboardContainer = styled.div`
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  
  h1 {
    font-size: 28px;
    color: #2c3e50;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    
    h1 {
      font-size: 24px;
    }
  }
`;

const NotificationBadge = styled.div`
  position: relative;
  cursor: pointer;

  .badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #dc3545;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
  }
`;

const CompanyTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  overflow-x: auto;
  display: block;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  th, td {
    padding: 20px;
    text-align: left;
    border-bottom: 1px solid #eee;
    vertical-align: top;
  }

  th {
    background: #f8f9fa;
    font-weight: 600;
    color: #495057;
    font-size: 16px;
    white-space: nowrap;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  td {
    font-size: 15px;
  }

  /* Column widths */
  th:nth-child(1), td:nth-child(1) { /* Company Name */
    min-width: 200px;
    width: 25%;
  }

  th:nth-child(2), td:nth-child(2) { /* Last Five Communications */
    min-width: 300px;
    width: 45%;
  }

  th:nth-child(3), td:nth-child(3) { /* Next Communication */
    min-width: 150px;
    width: 20%;
  }

  th:nth-child(4), td:nth-child(4) { /* Actions */
    min-width: 100px;
    width: 10%;
  }

  tbody tr {
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background-color: #f8f9fa;
    }

    &.selected {
      background-color: #e8f4ff;
    }
  }

  @media (max-width: 768px) {
    font-size: 14px;
    
    th, td {
      padding: 15px;
    }
    
    /* Make table scrollable horizontally */
    white-space: nowrap;
  }
`;

const ActionButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover {
    background: ${props => props.disabled ? '#007bff' : '#0056b3'};
  }

  &:disabled {
    cursor: not-allowed;
  }

  &.delete-btn {
    background: #dc3545;
    padding: 6px 12px;
    font-size: 12px;
    
    &:hover {
      background: #c82333;
    }
  }
`;

const HighlightToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  padding: 5px;
  border-radius: 4px;

  &:hover {
    background: #f8f9fa;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  margin: 20px;

  h2 {
    color: #2c3e50;
    margin-bottom: 25px;
    text-align: center;
    font-size: 24px;
  }

  @media (max-width: 768px) {
    padding: 20px;
    margin: 10px;
    
    h2 {
      font-size: 20px;
      margin-bottom: 20px;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 500;
    color: #495057;
  }

  select, input, textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

const CommunicationIcon = styled.div`
  color: #007bff;
  display: flex;
  align-items: center;
  font-size: 16px;
`;

const CommunicationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  padding: 6px 12px;
  border-radius: 20px;
  margin: 0 8px 8px 0;
  font-size: 14px;
  color: #495057;
  position: relative;

  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = styled.div`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  transition: all 0.2s;
  z-index: 2;
  margin-bottom: 5px;

  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #333;
  }
`;

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
};

const getCompanyStatus = (company) => {
  const today = new Date();
  const nextComm = new Date(company.nextCommunication);
  
  if (nextComm < today) return 'overdue';
  if (nextComm.toDateString() === today.toDateString()) return 'today';
  return 'normal';
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

const Dashboard = () => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communicationForm, setCommunicationForm] = useState({
    type: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const { dashboardData, loading, highlightSettings } = useSelector(state => state.user);
  const methods = useSelector(state => state.communicationMethods.methods);
  const companies = useSelector(state => state.companies.companies);

  const overdueCount = dashboardData.filter(company => 
    getCompanyStatus(company) === 'overdue'
  ).length;

  const todayCount = dashboardData.filter(company => 
    getCompanyStatus(company) === 'today'
  ).length;

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch, companies]);

  const handleNotificationClick = () => {
    navigate('/user/notifications');
  };

  const handleCompanySelect = (companyId) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleCommunicationSubmit = (e) => {
    e.preventDefault();
    selectedCompanies.forEach(companyId => {
      dispatch(logCommunication({
        companyId,
        communication: {
          ...communicationForm,
          id: Date.now(),
        },
      }));
    });
    setIsModalOpen(false);
    setSelectedCompanies([]);
    setCommunicationForm({
      type: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const isAdmin = localStorage.getItem('userRole') === 'admin';

  if (loading) return <div>Loading...</div>;

  return (
    <DashboardContainer>
      <Header>
        <h1>Company Dashboard</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <ActionButton 
            disabled={selectedCompanies.length === 0}
            onClick={() => setIsModalOpen(true)}
          >
            Log Communication ({selectedCompanies.length})
          </ActionButton>
          {isAdmin && (
            <NotificationBadge onClick={handleNotificationClick}>
              <FaBell size={24} />
              {(overdueCount + todayCount) > 0 && (
                <span className="badge">{overdueCount + todayCount}</span>
              )}
            </NotificationBadge>
          )}
        </div>
      </Header>

      <CompanyTable>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Last Five Communications</th>
            <th>Next Communication</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {dashboardData.map(company => (
            <tr
              key={company.id}
              onClick={() => handleCompanySelect(company.id)}
              className={selectedCompanies.includes(company.id) ? 'selected' : ''}
              style={{
                backgroundColor: highlightSettings[company.id]?.disabled ? 'white' :
                  getCompanyStatus(company) === 'overdue' ? '#ffe6e6' :
                  getCompanyStatus(company) === 'today' ? '#fff3cd' : 'white'
              }}
            >
              <td>{company.name}</td>
              <td>
                {company.communications.slice(0, 5).map(comm => (
                  <CommunicationBadge key={comm.id}>
                    <CommunicationIcon>{getCommunicationIcon(comm.type)}</CommunicationIcon>
                    <span>{formatDate(comm.date)}</span>
                    {comm.notes && (
                      <Tooltip className="tooltip">
                        {comm.notes}
                      </Tooltip>
                    )}
                  </CommunicationBadge>
                ))}
                {company.communications.length === 0 && (
                  <span style={{ color: '#666', fontStyle: 'italic' }}>
                    No communications yet
                  </span>
                )}
              </td>
              <td style={{ 
                color: getCompanyStatus(company) === 'overdue' ? '#dc3545' : 
                       getCompanyStatus(company) === 'today' ? '#ffc107' : '#666' 
              }}>
                {formatDate(company.nextCommunication)}
              </td>
              {isAdmin && (
                <td>
                  <ActionButton 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this company?')) {
                        dispatch(deleteCompany(company.id));
                      }
                    }}
                  >
                    <FaTrash /> Delete
                  </ActionButton>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </CompanyTable>

      {isModalOpen && (
        <Modal onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2>Log Communication</h2>
            <Form onSubmit={handleCommunicationSubmit}>
              <FormGroup>
                <label>Type</label>
                <select
                  value={communicationForm.type}
                  onChange={e => setCommunicationForm(prev => ({
                    ...prev,
                    type: e.target.value
                  }))}
                  required
                >
                  <option value="">Select type</option>
                  {[...DEFAULT_COMMUNICATION_METHODS, ...methods].map(method => (
                    <option key={method.id} value={method.name}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup>
                <label>Date</label>
                <input
                  type="date"
                  value={communicationForm.date}
                  onChange={e => setCommunicationForm(prev => ({
                    ...prev,
                    date: e.target.value
                  }))}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Notes</label>
                <textarea
                  value={communicationForm.notes}
                  onChange={e => setCommunicationForm(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  placeholder="Add your communication notes here..."
                />
              </FormGroup>

              <ButtonGroup>
                <ActionButton 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ backgroundColor: '#6c757d' }}
                >
                  Cancel
                </ActionButton>
                <ActionButton type="submit">
                  Save Communication
                </ActionButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </DashboardContainer>
  );
};

export default Dashboard; 