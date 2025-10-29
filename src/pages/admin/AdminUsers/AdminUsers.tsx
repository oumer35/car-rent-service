// src/pages/admin/AdminUsers/AdminUsers.tsx
import { useState } from 'react'
import { 
  Container, 
  Typography, 
  Card, 
  CardContent,
  Box,
  Chip,
  TextField,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material'
import {
  MoreVert,
  Edit,
  Delete,
  AdminPanelSettings,
  Person
} from '@mui/icons-material'
import { storage } from '../../../services/api'
import { User, Role } from '../../../types'

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(() => storage.read<User[]>('cr_users', []))
  const [searchTerm, setSearchTerm] = useState('')
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    role: 'user' as Role
  })

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setMenuAnchor(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setSelectedUser(null)
  }

  const handleEdit = (user: User) => {
    setEditForm({
      name: user.name || '',
      phone: user.phone,
      role: user.role
    })
    setSelectedUser(user)
    setEditDialogOpen(true)
    handleMenuClose()
  }

  const handleDelete = (user: User) => {
    if (window.confirm(`Are you sure you want to delete user ${user.name || user.phone}?`)) {
      const updatedUsers = users.filter(u => u.id !== user.id)
      setUsers(updatedUsers)
      storage.write('cr_users', updatedUsers)
      handleMenuClose()
    }
  }

  const handleSaveEdit = () => {
    if (!selectedUser) return

    const updatedUsers = users.map(user =>
      user.id === selectedUser.id
        ? { ...user, ...editForm }
        : user
    )

    setUsers(updatedUsers)
    storage.write('cr_users', updatedUsers)
    
    // Also update current user in localStorage if it's the same user
    const currentUser = storage.read<User | null>('cr_user', null)
    if (currentUser && currentUser.id === selectedUser.id) {
      storage.write('cr_user', { ...currentUser, ...editForm })
    }

    setEditDialogOpen(false)
    setSelectedUser(null)
  }

  const getRoleColor = (role: Role) => {
    return role === 'admin' ? 'primary' : 'default'
  }

  const getRoleIcon = (role: Role) => {
    return role === 'admin' ? <AdminPanelSettings /> : <Person />
  }

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        User Management
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Search Users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, phone, or role..."
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredUsers.map((user) => (
          <Grid size={{xs:12, sm:6, md:4}} key={user.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {user.name || 'Unnamed User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {user.phone}
                    </Typography>
                    <Chip
                      icon={getRoleIcon(user.role)}
                      label={user.role.toUpperCase()}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </Box>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, user)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <Typography variant="caption" color="text.secondary">
                  User ID: {user.id}
                </Typography>
                {user.email && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Email: {user.email}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No users found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms' : 'No users registered yet'}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedUser && handleEdit(selectedUser)}>
          <Edit sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={() => selectedUser && handleDelete(selectedUser)}>
          <Delete sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* Edit User Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit User
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Full Name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                margin="normal"
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Phone Number"
                value={editForm.phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                margin="normal"
                disabled
                helperText="Phone number cannot be changed"
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                select
                label="Role"
                value={editForm.role}
                onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value as Role }))}
                margin="normal"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}