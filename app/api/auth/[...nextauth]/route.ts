import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, User } from "@/lib/db"
import { comparePasswords, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    await connectToDatabase()

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await comparePasswords(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create session
    await createSession({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

