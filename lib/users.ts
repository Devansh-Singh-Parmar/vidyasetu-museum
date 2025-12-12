import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const usersFilePath = path.join(process.cwd(), 'data', 'users.json')

interface User {
  id: string
  name: string
  email: string
  password: string
  points: number
  wishlist: number[]
  visited: Array<{ museumId: number; date: string }>
  reviews: Array<{ museumId: number; date: string; rating: number; notes: string }>
}

function getUsers(): User[] {
  try {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading users file:', error)
  }
  return []
}

function saveUsers(users: User[]) {
  try {
    const dir = path.dirname(usersFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error saving users file:', error)
  }
}

export async function createUser(name: string, email: string, password: string): Promise<User | null> {
  const users = getUsers()
  
  if (users.find(u => u.email === email)) {
    return null
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    points: 0,
    wishlist: [],
    visited: [],
    reviews: [],
  }

  users.push(newUser)
  saveUsers(users)
  
  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword as User
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const users = getUsers()
  const user = users.find(u => u.email === email)
  
  if (!user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return null
  }

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword as User
}

export function getUserById(id: string): User | null {
  const users = getUsers()
  const user = users.find(u => u.id === id)
  if (!user) return null
  
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword as User
}

export function updateUserWishlist(userId: string, museumId: number, action: 'add' | 'remove'): boolean {
  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) return false

  if (action === 'add') {
    if (!users[userIndex].wishlist.includes(museumId)) {
      users[userIndex].wishlist.push(museumId)
      users[userIndex].points += 10
    }
  } else {
    users[userIndex].wishlist = users[userIndex].wishlist.filter(id => id !== museumId)
  }

  saveUsers(users)
  return true
}

export function addVisitedMuseum(userId: string, museumId: number, date: string): boolean {
  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) return false

  const existingVisit = users[userIndex].visited.find(v => v.museumId === museumId)
  if (!existingVisit) {
    users[userIndex].visited.push({ museumId, date })
    users[userIndex].points += 50
  }

  saveUsers(users)
  return true
}

export function addReview(userId: string, museumId: number, rating: number, notes: string): boolean {
  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) return false

  const existingReview = users[userIndex].reviews.findIndex(r => r.museumId === museumId)
  if (existingReview !== -1) {
    users[userIndex].reviews[existingReview] = { museumId, date: new Date().toISOString(), rating, notes }
  } else {
    users[userIndex].reviews.push({ museumId, date: new Date().toISOString(), rating, notes })
    users[userIndex].points += 25
  }

  saveUsers(users)
  return true
}

export function getUserWishlist(userId: string): number[] {
  const user = getUserById(userId)
  return user?.wishlist || []
}

export function getUserVisited(userId: string): Array<{ museumId: number; date: string }> {
  const user = getUserById(userId)
  return user?.visited || []
}

export function getUserReviews(userId: string): Array<{ museumId: number; date: string; rating: number; notes: string }> {
  const user = getUserById(userId)
  return user?.reviews || []
}

export function getMuseumStatus(userId: string, museumId: number): { inWishlist: boolean; isVisited: boolean } {
  const user = getUserById(userId)
  if (!user) return { inWishlist: false, isVisited: false }
  
  return {
    inWishlist: user.wishlist.includes(museumId),
    isVisited: user.visited.some(v => v.museumId === museumId),
  }
}

