import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navigation from '../common/Navigation';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  flex-shrink: 0;
`;

const MainContent = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const ContentArea = styled.div`
  padding: 20px;
  flex: 1;
`;

const NavItem = styled(NavLink)`
  display: block;
  color: white;
  text-decoration: none;
  padding: 12px 15px;
  margin: 5px 0;
  border-radius: 4px;
  transition: background-color 0.3s;
  font-size: 16px;

  &:hover {
    background-color: #34495e;
  }

  &.active {
    background-color: #3498db;
  }
`;

const SidebarTitle = styled.h3`
  color: white;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #34495e;
  font-size: 20px;
`;

const AdminLayout = () => {
  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarTitle>Admin Dashboard</SidebarTitle>
        <NavItem to="/admin/companies">Company Management</NavItem>
        <NavItem to="/admin/communication-methods">Communication Methods</NavItem>
      </Sidebar>
      <MainContent>
        <Navigation />
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default AdminLayout; 