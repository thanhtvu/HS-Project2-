'use client'

import Image from "next/image";
import { useState, useEffect} from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore'


export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  //
  const [editItemName, setEditItemName] = useState('')
  const [editItemQuantity, setEditItemQuantity] = useState(0)
  const [selectedItem, setSelectedItem] = useState(null)
  //
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchItemName, setSearchItemName] = useState('');
  const [searchResult, setSearchResult] = useState(null);

//
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  // Add
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity:quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  // Remove
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity:quantity - 1})
      }
    }
    await updateInventory()
  }

  // Update
  const updateItem = async () => {
    if (selectedItem) {
      const docRef = doc(collection(firestore, 'inventory'), selectedItem.name);
      await setDoc(docRef, { quantity: editItemQuantity });
      if (selectedItem.name !== editItemName) {
        const newDocRef = doc(collection(firestore, 'inventory'), editItemName);
        const docSnap = await getDoc(newDocRef);
        if (docSnap.exists()) {
          const { quantity } = docSnap.data();
          await setDoc(newDocRef, { quantity: quantity + editItemQuantity });
        } else {
          await setDoc(newDocRef, { quantity: editItemQuantity });
        }
        await deleteDoc(docRef);
      }
      await updateInventory();
      setEditOpen(false);
    }
  }

  // Search
const searchItem = async () => {
  const docRef = doc(collection(firestore, 'inventory'), searchItemName)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const item = {
      name: docSnap.id,
      ...docSnap.data(),
    }
    setSearchResult(item)
  } else {
    setSearchResult(null)
  }
}

  
  
  
  //
  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleEditOpen = (item) => {
    setSelectedItem(item)
    setEditItemName(item.name)
    setEditItemQuantity(item.quantity)
    setEditOpen(true)
  }
  const handleEditClose = () => setEditOpen(false)
  const handleSearchOpen = () => setSearchOpen(true)
  const handleSearchClose = () => setSearchOpen(false)




  //
  return (
    // Outermost Box
    <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" gap={2} flexDirection="column">

      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" left="50%" 
          width={400} 
          bgcolor="white" 
          border="2px solid #000" 
          boxShadow={24} p={4} 
          display="flex" 
          flexDirection="column" 
          gap={3} 
          sx={{transform: 'translate(-50%, -50%)',}}
        >

          <Typography variant="h6">
            Add Item
          </Typography>

          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />

              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}
                >
                Add
              </Button>
          </Stack>
        </Box>
      </Modal>


      <Modal open={editOpen} onClose={() => setEditOpen(false)}> 
        <Box 
          position="absolute" 
          top="50%" left="50%" 
          width={400} 
          bgcolor="white" 
          border="2px solid #000" 
          boxShadow={24} p={4} 
          display="flex" 
          flexDirection="column" 
          gap={3} 
          sx={{transform: 'translate(-50%, -50%)'}}
        >
        <Typography variant="h6">Edit Item</Typography>
          <Stack width="100%" spacing={2}>
            <TextField
              label="Name"
              variant='outlined'
              fullWidth
              value={editItemName}
              onChange={(e) => setEditItemName(e.target.value)}
            />
            <TextField
              label="Quantity"
              type="number"
              variant='outlined'
              fullWidth
              value={editItemQuantity}
              onChange={(e) => setEditItemQuantity(Number(e.target.value))}
            />
            <Button
              variant="outlined"
              onClick={() => updateItem()}
            >
              SAVE
            </Button>
          </Stack>
        </Box>
      </Modal>


      <Modal open={searchOpen} onClose={handleSearchClose}>
        <Box
          position="absolute"
          top="50%" left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24} p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6">Search Item</Typography>
          <Stack width="100%" spacing={2}>
            <TextField
              label="Item Name"
              variant='outlined'
              fullWidth
              value={searchItemName}
              onChange={(e) => setSearchItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={searchItem}
            >
              Search
            </Button>
          </Stack>
          {searchResult !== null && (
            <Box mt={3}>
              <Typography variant="h6">Search Result</Typography>
              <Box border="1px solid #333" padding={2} mt={2}>
                <Typography>Name: {searchResult.name}</Typography>
                <Typography>Quantity: {searchResult.quantity}</Typography>
              </Box>
            </Box>
          )}
          {searchResult === null && (
            <Box mt={3}>
              <Typography variant="h6">No item found</Typography>
            </Box>
          )}
        </Box>
      </Modal>





      <Button //
        variant="contained"
        onClick={() => {
          handleOpen()
        }}
      >
        ADD NEW ITEMS
      </Button>

      <Button
        variant="contained"
        onClick={handleSearchOpen}
      >
        FILTER
      </Button>


      
      <Box border="1px solid #333"> 
        <Box 
          width="800px" 
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant='h2' color="#333">
            Inventory Item
          </Typography>
        </Box>
      

          <Stack
            width="800px"
            height="300px"
            spacing={2}
            overflow="auto"
          >
            {inventory.map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgColor="#f0f0f0"
            padding={5}
          >
            <Typography
              variant="h3"
              color="#333"
              textAlign="center"
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>

            <Typography
              variant="h3"
              color="#333"
              textAlign="center"
            >
              {quantity}
            </Typography>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => {
                  addItem(name)
                }}
              >
                ADD
              </Button>
              
              <Button
                variant="contained"
                onClick={() => {
                  removeItem(name)
                }}
              >
                REMOVE
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  handleEditOpen({ name, quantity })
                }}
              >
                UPDATE
              </Button>
            </Stack>

          </Box>
        ))}
        </Stack>
      </Box>
    </Box>

  )
}
