"use server"
import { connectToDatabase, User } from "@/lib/db"
import { hashPassword, comparePasswords, createSession, clearSession } from "@/lib/auth"

export async function signup(data: {
  name: string
  email: string
  password: string
}) {
  try {
    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email })
    if (existingUser) {
      return { success: false, error: "Email already in use" }
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    })

    // Create session
    await createSession({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    })

    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error: "Failed to create account" }
  }
}

export async function login(data: { email: string; password: string }) {
  try {
    await connectToDatabase()

    // Find user
    const user = await User.findOne({ email: data.email })
    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Verify password
    const isPasswordValid = await comparePasswords(data.password, user.password)
    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create session
    await createSession({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Failed to log in" }
  }
}

export async function logout() {
  try {
    await clearSession()
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "Failed to log out" }
  }
}

