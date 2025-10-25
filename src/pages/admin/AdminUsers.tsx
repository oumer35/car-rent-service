// import React from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent,
  Box,
  Chip
} from '@mui/material';
import { read } from '../../services/storage';

interface User {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export default function AdminUsers() {
  const users = read('cr_users', []) as User[];

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {users.map((user: User) => (
          <Card key={user.id}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Box>
                  <Typography variant="h6">
                    {user.name || user.phone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.phone}
                  </Typography>
                </Box>
                <Chip 
                  label={user.role} 
                  color={user.role === 'admin' ? 'primary' : 'default'}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}