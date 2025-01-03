import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Button from '../common/Button';
import CompanyForm from './CompanyForm';
import { deleteCompany } from '../../store/slices/companySlice';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f8f9fa;
    color: #007BFF;
  }
  
  tr:hover {
    background-color: #f5f5f5;
  }
`;

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const CompanyManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      dispatch(deleteCompany(id));
    }
  };

  return (
    <Container>
      <Header>
        <h1>Company Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Company</Button>
      </Header>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>LinkedIn Profile</th>
            <th>Emails</th>
            <th>Phone Numbers</th>
            <th>Communication Periodicity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.name}</td>
              <td>{company.location}</td>
              <td>{company.linkedinProfile}</td>
              <td>{company.emails?.join(', ')}</td>
              <td>{company.phoneNumbers?.join(', ')}</td>
              <td>{company.communicationPeriodicity} days</td>
              <td>
                <ButtonGroup>
                  <Button onClick={() => handleEdit(company)}>Edit</Button>
                  <Button
                    onClick={() => handleDelete(company.id)}
                    style={{ backgroundColor: '#dc3545' }}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {isModalOpen && (
        <CompanyForm
          company={selectedCompany}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCompany(null);
          }}
        />
      )}
    </Container>
  );
};

export default CompanyManagement; 