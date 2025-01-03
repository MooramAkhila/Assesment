import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Button from '../common/Button';
import {
  fetchMethods,
  addMethod,
  updateMethod,
  deleteMethod,
  reorderMethods,
} from '../../store/slices/communicationMethodSlice';

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

const MethodCard = styled.div`
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const MethodInfo = styled.div`
  flex-grow: 1;
`;

const MethodName = styled.h3`
  margin: 0 0 5px 0;
  color: #007BFF;
`;

const MethodDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

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
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
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

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CommunicationMethods = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mandatory: false,
  });

  const dispatch = useDispatch();
  const { methods, loading } = useSelector((state) => state.communicationMethods);

  useEffect(() => {
    dispatch(fetchMethods());
  }, [dispatch]);

  const moveMethod = (id, direction) => {
    const currentIndex = methods.findIndex(method => method.id === id);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === methods.length - 1)
    ) {
      return;
    }

    const newMethods = [...methods];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const [movedMethod] = newMethods.splice(currentIndex, 1);
    newMethods.splice(newIndex, 0, movedMethod);

    // Update sequences
    const updatedMethods = newMethods.map((method, index) => ({
      ...method,
      sequence: index + 1,
    }));

    dispatch(reorderMethods(updatedMethods));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const methodData = {
      ...formData,
      sequence: selectedMethod ? selectedMethod.sequence : methods.length + 1,
    };

    if (selectedMethod) {
      dispatch(updateMethod({ ...methodData, id: selectedMethod.id }));
    } else {
      dispatch(addMethod(methodData));
    }

    setIsModalOpen(false);
    setSelectedMethod(null);
    setFormData({ name: '', description: '', mandatory: false });
  };

  const handleEdit = (method) => {
    setSelectedMethod(method);
    setFormData({
      name: method.name,
      description: method.description,
      mandatory: method.mandatory,
    });
    setIsModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <Header>
        <h1>Communication Methods</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Method</Button>
      </Header>

      <MethodList>
        {methods.map((method) => (
          <MethodCard key={method.id}>
            <MethodInfo>
              <MethodName>{method.name}</MethodName>
              <MethodDescription>{method.description}</MethodDescription>
              <small>
                Sequence: {method.sequence} |{' '}
                {method.mandatory ? 'Mandatory' : 'Optional'}
              </small>
            </MethodInfo>
            <ButtonGroup>
              <Button 
                onClick={() => moveMethod(method.id, 'up')}
                disabled={method.sequence === 1}
              >
                ↑
              </Button>
              <Button 
                onClick={() => moveMethod(method.id, 'down')}
                disabled={method.sequence === methods.length}
              >
                ↓
              </Button>
              <Button onClick={() => handleEdit(method)}>Edit</Button>
              <Button
                onClick={() => dispatch(deleteMethod(method.id))}
                style={{ backgroundColor: '#dc3545' }}
              >
                Delete
              </Button>
            </ButtonGroup>
          </MethodCard>
        ))}
      </MethodList>

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <h2>{selectedMethod ? 'Edit Method' : 'Add Method'}</h2>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <label>Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </FormGroup>

              <FormGroup>
                <Checkbox>
                  <input
                    type="checkbox"
                    checked={formData.mandatory}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        mandatory: e.target.checked,
                      }))
                    }
                  />
                  <label>Mandatory</label>
                </Checkbox>
              </FormGroup>

              <ButtonGroup>
                <Button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedMethod(null);
                    setFormData({ name: '', description: '', mandatory: false });
                  }}
                  style={{ backgroundColor: '#6c757d' }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedMethod ? 'Save Changes' : 'Add Method'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default CommunicationMethods; 