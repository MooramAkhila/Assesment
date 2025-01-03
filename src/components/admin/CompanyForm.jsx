import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Button from '../common/Button';
import { addCompany, editCompany } from '../../store/slices/companySlice';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  margin: 20px;

  @media (max-width: 768px) {
    margin: 10px;
    padding: 15px;
    max-height: 90vh;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const AddButton = styled(Button)`
  width: 120px;
  margin: 5px auto;
  padding: 5px 10px;
  font-size: 14px;
  background-color: #6c757d;
  
  &:hover {
    background-color: #5a6268;
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

const FormTitle = styled.h2`
  color: #007BFF;
  margin-bottom: 20px;
  text-align: center;
`;

const CompanyForm = ({ company, onClose }) => {
  const [formData, setFormData] = useState(company || {
    name: '',
    location: '',
    linkedinProfile: '',
    emails: [''],
    phoneNumbers: [''],
    communicationPeriodicity: 30,
    comments: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    location: '',
    linkedinProfile: '',
    emails: [],
    phoneNumbers: [],
    communicationPeriodicity: '',
    comments: ''
  });

  const validateName = (name) => {
    if (!name) {
      return 'Company name is required';
    }
    if (name.length < 2) {
      return 'Company name must be at least 2 characters long';
    }
    return '';
  };

  const validateLocation = (location) => {
    if (!location) {
      return 'Location is required';
    }
    if (location.length < 2) {
      return 'Location must be at least 2 characters long';
    }
    return '';
  };

  const validateLinkedinProfile = (linkedinProfile) => {
    if (!linkedinProfile) {
      return 'LinkedIn profile is required';
    }
    if (linkedinProfile.length < 2) {
      return 'LinkedIn profile must be at least 2 characters long';
    }
    return '';
  };

  const validateEmails = (emails) => {
    if (!emails || emails.length === 0) {
      return 'At least one email is required';
    }
    for (const email of emails) {
      if (!email) {
        return 'All emails must be filled out';
      }
      const emailRegex = /^[A-Za-z0-9]{2,}@[A-Za-z0-9]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) {
        return 'Please enter a valid email (minimum 2 characters before @domain.com)';
      }
    }
    return '';
  };

  const validatePhoneNumbers = (phoneNumbers) => {
    if (!phoneNumbers || phoneNumbers.length === 0) {
      return 'At least one phone number is required';
    }
    for (const phone of phoneNumbers) {
      if (!phone) {
        return 'All phone numbers must be filled out';
      }
      const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
      if (!phoneRegex.test(phone)) {
        return 'Please enter a valid 10-digit phone number';
      }
    }
    return '';
  };

  const validateCommunicationPeriodicity = (communicationPeriodicity) => {
    if (!communicationPeriodicity) {
      return 'Communication periodicity is required';
    }
    if (communicationPeriodicity < 1) {
      return 'Communication periodicity must be at least 1 day';
    }
    return '';
  };

  const validateComments = (comments) => {
    if (!comments) {
      return 'Comments are required';
    }
    if (comments.length < 2) {
      return 'Comments must be at least 2 characters long';
    }
    return '';
  };

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const validationErrors = {
      name: validateName(formData.name),
      location: validateLocation(formData.location),
      linkedinProfile: validateLinkedinProfile(formData.linkedinProfile),
      emails: validateEmails(formData.emails),
      phoneNumbers: validatePhoneNumbers(formData.phoneNumbers),
      communicationPeriodicity: validateCommunicationPeriodicity(formData.communicationPeriodicity),
      comments: validateComments(formData.comments)
    };

    // Update error state with all validation results
    setErrors(validationErrors);

    // Check if there are any validation errors
    const hasErrors = Object.values(validationErrors).some(error => error !== '');
    
    if (hasErrors) {
      return; // Don't proceed with submission if there are errors
    }

    // If no errors, proceed with form submission
    const newCompany = {
      ...formData,
      id: company ? company.id : Date.now(),
      communications: company ? company.communications : [],
    };
    
    if (company) {
      dispatch(editCompany(newCompany));
    } else {
      dispatch(addCompany(newCompany));
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let fieldError = '';

    switch (name) {
      case 'name':
        fieldError = validateName(value);
        break;
      case 'location':
        fieldError = validateLocation(value);
        break;
      case 'linkedinProfile':
        fieldError = validateLinkedinProfile(value);
        break;
      case 'emails':
        fieldError = validateEmails(value);
        break;
      case 'phoneNumbers':
        fieldError = validatePhoneNumbers(value);
        break;
      case 'communicationPeriodicity':
        fieldError = validateCommunicationPeriodicity(value);
        break;
      case 'comments':
        fieldError = validateComments(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleArrayChange = (index, field, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));

    // Validate the entire array when any element changes
    let fieldError = '';
    if (field === 'emails') {
      fieldError = validateEmails(newArray);
    } else if (field === 'phoneNumbers') {
      fieldError = validatePhoneNumbers(newArray);
    }

    setErrors(prev => ({
      ...prev,
      [field]: fieldError
    }));
  };

  const handleArrayBlur = (field) => {
    let fieldError = '';
    if (field === 'emails') {
      fieldError = validateEmails(formData.emails);
    } else if (field === 'phoneNumbers') {
      fieldError = validatePhoneNumbers(formData.phoneNumbers);
    }

    setErrors(prev => ({
      ...prev,
      [field]: fieldError
    }));
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  return (
    <Modal>
      <ModalContent>
        <FormTitle>{company ? 'Edit Company' : 'Add Company'}</FormTitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Company Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name ? 'error' : ''}
              placeholder="Enter company name"
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </FormGroup>

          <FormGroup>
            <label>Location</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.location ? 'error' : ''}
              placeholder="Enter company location"
            />
            {errors.location && <div className="error-message">{errors.location}</div>}
          </FormGroup>

          <FormGroup>
            <label>LinkedIn Profile</label>
            <Input
              name="linkedinProfile"
              value={formData.linkedinProfile}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.linkedinProfile ? 'error' : ''}
              placeholder="Enter LinkedIn profile"
            />
            {errors.linkedinProfile && <div className="error-message">{errors.linkedinProfile}</div>}
          </FormGroup>

          <FormGroup>
            <label>Emails</label>
            {formData.emails.map((email, index) => (
              <Input
                key={index}
                value={email}
                onChange={(e) => handleArrayChange(index, 'emails', e.target.value)}
                onBlur={() => handleArrayBlur('emails')}
                className={errors.emails ? 'error' : ''}
                placeholder="Enter email address"
              />
            ))}
            <AddButton type="button" onClick={() => addArrayField('emails')}>
              + Add Email
            </AddButton>
            {errors.emails && <div className="error-message">{errors.emails}</div>}
          </FormGroup>

          <FormGroup>
            <label>Phone Numbers</label>
            {formData.phoneNumbers.map((phone, index) => (
              <Input
                key={index}
                value={phone}
                onChange={(e) => handleArrayChange(index, 'phoneNumbers', e.target.value)}
                onBlur={() => handleArrayBlur('phoneNumbers')}
                className={errors.phoneNumbers ? 'error' : ''}
                placeholder="Enter phone number"
              />
            ))}
            <AddButton type="button" onClick={() => addArrayField('phoneNumbers')}>
              + Add Phone
            </AddButton>
            {errors.phoneNumbers && <div className="error-message">{errors.phoneNumbers}</div>}
          </FormGroup>

          <FormGroup>
            <label>Communication Periodicity (days)</label>
            <Input
              type="number"
              name="communicationPeriodicity"
              value={formData.communicationPeriodicity}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.communicationPeriodicity ? 'error' : ''}
              min="1"
            />
            {errors.communicationPeriodicity && <div className="error-message">{errors.communicationPeriodicity}</div>}
          </FormGroup>

          <FormGroup>
            <label>Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.comments ? 'error' : ''}
              rows="4"
              style={{ 
                padding: '8px', 
                borderRadius: '4px', 
                border: errors.comments ? '1px solid #dc3545' : '1px solid #ddd',
                resize: 'vertical'
              }}
            />
            {errors.comments && <div className="error-message">{errors.comments}</div>}
          </FormGroup>

          <ButtonGroup>
            <Button type="button" onClick={onClose} style={{ backgroundColor: '#6c757d' }}>
              Cancel
            </Button>
            <Button type="submit">
              {company ? 'Save Changes' : 'Add Company'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default CompanyForm; 