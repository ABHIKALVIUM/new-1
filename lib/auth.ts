import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { connectToDatabase, User } from "@/lib/db"
import type { Session } from "@/lib/types"

const secretKey = process.env.JWT_SECRET || "your-secret-key"
const key = new TextEncoder().encode(secretKey)

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createSession(user: { _id: string; name: string; email: string }) {
  // Create a session that expires in 7 days
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const session: Session = {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
  }

  // Create a JWT token
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(key)

  // Set the token in a cookie
  cookies().set("session", token, {
    httpOnly: true,
    expires: expiresAt,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })

  return session
}

export async function getSession(): Promise<Session | null> {
  const token = cookies().get("session")?.value

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, key)
    return verified.payload as Session
  } catch (error) {
    return null
  }
}

export async function getUserById(id: string) {
  try {
    await connectToDatabase()
    const user = await User.findById(id).lean()

    if (!user) {
      return null
    }

    // Convert _id to string and remove password
    const { password, ...userWithoutPassword } = user
    return {
      ...userWithoutPassword,
      _id: user._id.toString(),
    }
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

export async function clearSession() {
  cookies().delete("session")
}

