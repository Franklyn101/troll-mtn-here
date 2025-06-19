import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In production, you'd use a real database
const comments = [
  {
    id: 1,
    name: "Angry Customer",
    comment: "I've been trying to load this webpage for 3 hours! MTN speed is slower than a snail! 🐌",
    timestamp: "2 hours ago",
    likes: 47,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Frustrated User",
    comment: "They charged me ₦5000 for 1GB and it finished in 10 minutes. SCAM! 😡",
    timestamp: "1 hour ago",
    likes: 89,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Fed Up Nigerian",
    comment: "Customer service put me on hold for 6 hours then hung up. I'm switching networks! 📞💔",
    timestamp: "30 minutes ago",
    likes: 156,
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    // Sort comments by creation date (newest first)
    const sortedComments = comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ comments: sortedComments })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, comment } = await request.json()

    if (!name || !comment) {
      return NextResponse.json({ error: "Name and comment are required" }, { status: 400 })
    }

    const newComment = {
      id: Math.max(...comments.map((c) => c.id), 0) + 1,
      name: name.trim(),
      comment: comment.trim(),
      timestamp: "Just now",
      likes: 0,
      createdAt: new Date().toISOString(),
    }

    comments.unshift(newComment) // Add to beginning of array

    return NextResponse.json({ comment: newComment })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json()

    const commentIndex = comments.findIndex((c) => c.id === id)
    if (commentIndex === -1) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    comments[commentIndex].likes += 1

    return NextResponse.json({ comment: comments[commentIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to like comment" }, { status: 500 })
  }
}
