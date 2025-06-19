import { type NextRequest, NextResponse } from "next/server"

// Global comments storage that persists across requests
// In production, you'd use a real database
const globalComments = [
  {
    id: 1,
    name: "Angry Customer",
    comment: "I've been trying to load this webpage for 3 hours! MTN speed is slower than a snail! 🐌",
    timestamp: "2 hours ago",
    likes: 47,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 2,
    name: "Frustrated User",
    comment: "They charged me ₦5000 for 1GB and it finished in 10 minutes. SCAM! 😡",
    timestamp: "1 hour ago",
    likes: 89,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: 3,
    name: "Fed Up Nigerian",
    comment: "Customer service put me on hold for 6 hours then hung up. I'm switching networks! 📞💔",
    timestamp: "30 minutes ago",
    likes: 156,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: 4,
    name: "Broke Student",
    comment: "MTN ate my entire allowance in one day! Now I'm surviving on free WiFi at McDonald's 🍟📱",
    timestamp: "15 minutes ago",
    likes: 203,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
  },
  {
    id: 5,
    name: "Night Shift Worker",
    comment: "Tried to make an emergency call at 2AM. No signal. Thanks MTN for making me walk 5km to find help! 🚶‍♂️",
    timestamp: "10 minutes ago",
    likes: 178,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
  },
]

// Helper function to get time ago string
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
}

export async function GET() {
  try {
    // Update timestamps for existing comments
    const updatedComments = globalComments.map((comment) => ({
      ...comment,
      timestamp: getTimeAgo(new Date(comment.createdAt)),
    }))

    // Sort comments by creation date (newest first)
    const sortedComments = updatedComments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    return NextResponse.json({
      comments: sortedComments,
      total: sortedComments.length,
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, comment } = await request.json()

    if (!name || !comment) {
      return NextResponse.json({ error: "Name and comment are required" }, { status: 400 })
    }

    // Validate input lengths
    if (name.trim().length > 50) {
      return NextResponse.json({ error: "Name too long (max 50 characters)" }, { status: 400 })
    }

    if (comment.trim().length > 500) {
      return NextResponse.json({ error: "Comment too long (max 500 characters)" }, { status: 400 })
    }

    // Generate new ID
    const newId = Math.max(...globalComments.map((c) => c.id), 0) + 1
    const now = new Date()

    const newComment = {
      id: newId,
      name: name.trim(),
      comment: comment.trim(),
      timestamp: "Just now",
      likes: 0,
      createdAt: now.toISOString(),
    }

    // Add to global comments array (this persists across requests)
    globalComments.push(newComment)

    console.log(`New comment added. Total comments: ${globalComments.length}`)

    return NextResponse.json({
      comment: newComment,
      total: globalComments.length,
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 })
    }

    const commentIndex = globalComments.findIndex((c) => c.id === id)
    if (commentIndex === -1) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Increment likes
    globalComments[commentIndex].likes += 1

    // Update timestamp
    globalComments[commentIndex].timestamp = getTimeAgo(new Date(globalComments[commentIndex].createdAt))

    return NextResponse.json({
      comment: globalComments[commentIndex],
      total: globalComments.length,
    })
  } catch (error) {
    console.error("Error liking comment:", error)
    return NextResponse.json({ error: "Failed to like comment" }, { status: 500 })
  }
}
