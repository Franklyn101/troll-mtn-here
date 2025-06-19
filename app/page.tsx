"use client"

import { useState, useEffect } from "react"
import {
  Wifi,
  WifiOff,
  DollarSign,
  TrendingUp,
  Clock,
  Zap,
  AlertTriangle,
  Phone,
  MessageSquare,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Comment {
  id: number
  name: string
  comment: string
  timestamp: string
  likes: number
  createdAt: string
}

export default function MTNTrollSite() {
  const [signalStrength, setSignalStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [dataPrice, setDataPrice] = useState(1000)
  const [showGif, setShowGif] = useState(false)
  const [showCallDropGif, setShowCallDropGif] = useState(false)
  const [showLoadingGif, setShowLoadingGif] = useState(false)
  const [priceShock, setPriceShock] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [userName, setUserName] = useState("")
  const [showCommentGif, setShowCommentGif] = useState(false)
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const disappointmentGifs = [
    "https://media.giphy.com/media/l2JehQ2GitHGdVG9y/giphy.gif",
    "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
    "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",
    "https://media.giphy.com/media/26AHPxxnSw1L9T1rW/giphy.gif",
  ]

  const [currentGif, setCurrentGif] = useState(disappointmentGifs[0])

  // Load comments from API
  const loadComments = async () => {
    try {
      setIsLoadingComments(true)
      const response = await fetch("/api/comments")
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
      }
    } catch (error) {
      console.error("Failed to load comments:", error)
      // Fallback to localStorage if API fails
      const savedComments = localStorage.getItem("mtn-comments")
      if (savedComments) {
        setComments(JSON.parse(savedComments))
      }
    } finally {
      setIsLoadingComments(false)
    }
  }

  // Save comments to localStorage as backup
  const saveCommentsToLocal = (commentsToSave: Comment[]) => {
    localStorage.setItem("mtn-comments", JSON.stringify(commentsToSave))
  }

  useEffect(() => {
    loadComments()

    // Simulate terrible signal strength with animation
    const interval = setInterval(() => {
      setSignalStrength(Math.random() * 30) // Always terrible signal
    }, 2000)

    // Simulate constant price increases with shock animation
    const priceInterval = setInterval(() => {
      setDataPrice((prev) => prev + Math.floor(Math.random() * 50))
      setPriceShock(true)
      setTimeout(() => setPriceShock(false), 500)
    }, 3000)

    // Simulate eternal loading
    setTimeout(() => setIsLoading(false), 8000)

    return () => {
      clearInterval(interval)
      clearInterval(priceInterval)
    }
  }, [])

  const handleSubscribeClick = () => {
    const randomGif = disappointmentGifs[Math.floor(Math.random() * disappointmentGifs.length)]
    setCurrentGif(randomGif)
    setShowGif(true)
  }

  const simulateCallDrop = () => {
    setShowCallDropGif(true)
    setTimeout(() => setShowCallDropGif(false), 3000)
  }

  const simulateSlowLoading = () => {
    setShowLoadingGif(true)
    setTimeout(() => setShowLoadingGif(false), 4000)
  }

  const handleAddComment = async () => {
    if (newComment.trim() && userName.trim()) {
      setIsSubmittingComment(true)

      try {
        const response = await fetch("/api/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: userName.trim(),
            comment: newComment.trim(),
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const updatedComments = [data.comment, ...comments]
          setComments(updatedComments)
          saveCommentsToLocal(updatedComments)
          setNewComment("")
          setUserName("")
          setShowCommentGif(true)
          setTimeout(() => setShowCommentGif(false), 3000)
        } else {
          // Fallback to local storage if API fails
          const comment: Comment = {
            id: Math.max(...comments.map((c) => c.id), 0) + 1,
            name: userName.trim(),
            comment: newComment.trim(),
            timestamp: "Just now",
            likes: 0,
            createdAt: new Date().toISOString(),
          }
          const updatedComments = [comment, ...comments]
          setComments(updatedComments)
          saveCommentsToLocal(updatedComments)
          setNewComment("")
          setUserName("")
          setShowCommentGif(true)
          setTimeout(() => setShowCommentGif(false), 3000)
        }
      } catch (error) {
        console.error("Failed to add comment:", error)
        // Fallback to local storage
        const comment: Comment = {
          id: Math.max(...comments.map((c) => c.id), 0) + 1,
          name: userName.trim(),
          comment: newComment.trim(),
          timestamp: "Just now",
          likes: 0,
          createdAt: new Date().toISOString(),
        }
        const updatedComments = [comment, ...comments]
        setComments(updatedComments)
        saveCommentsToLocal(updatedComments)
        setNewComment("")
        setUserName("")
        setShowCommentGif(true)
        setTimeout(() => setShowCommentGif(false), 3000)
      } finally {
        setIsSubmittingComment(false)
      }
    }
  }

  const handleLikeComment = async (id: number) => {
    try {
      const response = await fetch("/api/comments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        const data = await response.json()
        const updatedComments = comments.map((comment) => (comment.id === id ? data.comment : comment))
        setComments(updatedComments)
        saveCommentsToLocal(updatedComments)
      } else {
        // Fallback to local update
        const updatedComments = comments.map((comment) =>
          comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment,
        )
        setComments(updatedComments)
        saveCommentsToLocal(updatedComments)
      }
    } catch (error) {
      console.error("Failed to like comment:", error)
      // Fallback to local update
      const updatedComments = comments.map((comment) =>
        comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment,
      )
      setComments(updatedComments)
      saveCommentsToLocal(updatedComments)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 animate-gradient-x">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-2xl font-bold text-black animate-pulse">M</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white animate-slide-in-left">
              MTN: Maybe Tomorrow Network
            </h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto animate-slide-in-right">
            Welcome to the most "reliable" network in the galaxy! 🛰️ (Signal not included)
          </p>
        </header>

        {/* Signal Strength Indicator */}
        <Card className="mb-8 border-2 border-red-500 animate-fade-in-up hover:animate-shake">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {signalStrength > 20 ? (
                <Wifi className="text-green-500 animate-pulse" />
              ) : (
                <WifiOff className="text-red-500 animate-bounce" />
              )}
              Current Signal Strength
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={signalStrength} className="mb-2 animate-pulse" />
            <p className="text-sm text-muted-foreground animate-fade-in">
              {signalStrength < 10
                ? "No signal (as usual) 📵"
                : signalStrength < 20
                  ? "Barely breathing 😵"
                  : "Miracle! You have signal! 🎉"}
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Network Quality */}
          <Card className="border-2 border-orange-500 animate-fade-in-up hover:animate-wobble">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="text-orange-500 animate-pulse" />
                Network Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="destructive" className="animate-bounce">
                  Call Drops: 99.9%
                </Badge>
                <Badge variant="destructive" className="animate-pulse">
                  SMS Delay: 3-5 business days
                </Badge>
                <Badge variant="destructive" className="animate-bounce">
                  Internet Speed: Dial-up era
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={simulateCallDrop}
                  className="mt-2 animate-pulse hover:animate-bounce"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Try Calling (Dare You!)
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  "We're not just a network, we're a patience training program!"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-2 border-red-500 animate-fade-in-up hover:animate-pulse">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="text-red-500 animate-spin" />
                Dynamic Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold text-red-500 mb-2 transition-all duration-300 ${
                  priceShock ? "animate-ping scale-110" : ""
                }`}
              >
                ₦{dataPrice.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mb-2">Price for 1GB (changes every 3 seconds)</p>
              <Badge variant="outline" className="flex items-center gap-1 animate-bounce">
                <TrendingUp className="w-3 h-3 animate-pulse" />
                Always Increasing!
              </Badge>
            </CardContent>
          </Card>

          {/* Customer Service */}
          <Card className="border-2 border-purple-500 animate-fade-in-up hover:animate-shake">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="text-purple-500 animate-spin" />
                Customer Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">Average Wait Time:</p>
                <div className="text-2xl font-bold text-purple-500 animate-pulse">∞ hours</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={simulateSlowLoading}
                  className="animate-pulse hover:animate-bounce"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Contact Support
                </Button>
                <p className="text-xs text-muted-foreground">
                  "Please hold while we pretend to care about your problem"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call Drop GIF */}
        {showCallDropGif && (
          <Card className="mb-8 border-2 border-red-500 animate-fade-in bg-red-50">
            <CardContent className="text-center p-6">
              <h3 className="text-xl font-bold text-red-600 mb-4 animate-bounce">Call Dropped! 📞💥</h3>
              <img
                src="https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif"
                alt="Phone hanging up gif"
                className="mx-auto rounded-lg animate-fade-in"
                style={{ maxHeight: "200px" }}
              />
              <p className="text-red-600 mt-4 animate-pulse">"Sorry, your call is important to us... NOT!" 😂</p>
            </CardContent>
          </Card>
        )}

        {/* Slow Loading GIF */}
        {showLoadingGif && (
          <Card className="mb-8 border-2 border-blue-500 animate-fade-in bg-blue-50">
            <CardContent className="text-center p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-4 animate-pulse">
                Connecting to Customer Service... 🐌
              </h3>
              <img
                src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
                alt="Slow loading gif"
                className="mx-auto rounded-lg animate-fade-in"
                style={{ maxHeight: "200px" }}
              />
              <p className="text-blue-600 mt-4 animate-bounce">
                "At this rate, you'll get help sometime next century!" ⏰
              </p>
            </CardContent>
          </Card>
        )}

        {/* Fake Loading Section */}
        <Card className="mb-8 border-2 border-blue-500 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="animate-pulse">Loading Your Data Bundle...</CardTitle>
            <CardDescription>This might take a while (or forever)</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="animate-pulse">Still loading... Maybe try again tomorrow?</span>
              </div>
            ) : (
              <div className="text-red-500 font-semibold animate-bounce">
                Error 404: Your data bundle has left the chat 💸
              </div>
            )}
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="mb-8 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="animate-slide-in-left">What Our "Happy" Customers Say</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg animate-fade-in hover:animate-pulse">
                <p className="italic mb-2">"I bought 10GB and it lasted exactly 3 minutes. Amazing efficiency!"</p>
                <p className="text-sm text-muted-foreground">- Frustrated Customer #1</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg animate-fade-in hover:animate-pulse">
                <p className="italic mb-2">"MTN taught me the true meaning of patience. I'm now a zen master."</p>
                <p className="text-sm text-muted-foreground">- Former Customer #2</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg animate-fade-in hover:animate-pulse">
                <p className="italic mb-2">
                  "Their network is so slow, I aged 10 years waiting for a webpage to load."
                </p>
                <p className="text-sm text-muted-foreground">- Time Traveler</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg animate-fade-in hover:animate-pulse">
                <p className="italic mb-2">"I called customer service in 2019. Still on hold. Send help."</p>
                <p className="text-sm text-muted-foreground">- Ghost Customer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="mb-8 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="animate-slide-in-left flex items-center gap-2">
              💬 Vent Your Frustrations Here!
              <Button
                variant="ghost"
                size="sm"
                onClick={loadComments}
                className="ml-auto animate-pulse"
                disabled={isLoadingComments}
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingComments ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </CardTitle>
            <CardDescription>
              Share your MTN horror stories with fellow sufferers. Misery loves company! 😭
              <br />
              <span className="text-xs text-green-600">💾 Comments are saved permanently and visible to everyone!</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add Comment Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <h4 className="font-semibold mb-3 text-gray-700">Add Your MTN Horror Story:</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name (or stay anonymous as 'Angry Customer')"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={isSubmittingComment}
                />
                <textarea
                  placeholder="Tell us your MTN nightmare... Don't hold back! 😤"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  disabled={isSubmittingComment}
                />
                <Button
                  onClick={handleAddComment}
                  className="bg-red-500 hover:bg-red-600 text-white animate-pulse hover:animate-bounce"
                  disabled={!newComment.trim() || !userName.trim() || isSubmittingComment}
                >
                  {isSubmittingComment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : (
                    <>🔥 Release Your Anger!</>
                  )}
                </Button>
              </div>
            </div>

            {/* Comment Added GIF */}
            {showCommentGif && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-500 animate-fade-in">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-green-600 mb-2 animate-bounce">Comment Added! 🎉</h4>
                  <img
                    src="https://media.giphy.com/media/3o7abwbzKeaRksvVaE/giphy.gif"
                    alt="Venting anger gif"
                    className="mx-auto rounded-lg animate-fade-in"
                    style={{ maxHeight: "150px" }}
                  />
                  <p className="text-green-600 mt-2 animate-pulse">
                    Your frustration has been documented for posterity! 📝
                  </p>
                </div>
              </div>
            )}

            {/* Comments List */}
            {isLoadingComments ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading comments... (Hopefully faster than MTN!) 🐌</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No comments yet. Be the first to vent your MTN frustrations! 😤</p>
                  </div>
                ) : (
                  comments.map((comment, index) => (
                    <div
                      key={comment.id}
                      className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{comment.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-800">{comment.name}</h5>
                            <p className="text-xs text-gray-500">{comment.timestamp}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeComment(comment.id)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 animate-pulse"
                        >
                          ❤️ {comment.likes}
                        </Button>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Encouragement to Comment */}
            <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg text-center animate-pulse">
              <p className="text-yellow-800 font-medium">
                🔥 Don't suffer in silence! Share your MTN pain and let the world know! 🔥
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                The more comments, the more evidence of their "excellent" service! 😏
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="text-center border-2 border-green-500 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-2xl animate-bounce">Ready to Join the Chaos?</CardTitle>
            <CardDescription className="animate-pulse">
              Experience the thrill of uncertainty with every call, text, and byte!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold animate-pulse hover:animate-bounce transform hover:scale-105 transition-all duration-300"
                onClick={handleSubscribeClick}
              >
                <Zap className="mr-2 animate-spin" />
                Subscribe to Disappointment
              </Button>

              {showGif && (
                <div className="mt-6 p-4 bg-white rounded-lg border-2 border-red-500 animate-fade-in">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-red-600 mb-2 animate-bounce">Congratulations! 🎉</h3>
                    <p className="text-gray-700 mb-4 animate-pulse">
                      You've successfully subscribed to eternal frustration!
                    </p>
                  </div>
                  <div className="flex justify-center mb-4">
                    <img
                      src={currentGif || "/placeholder.svg"}
                      alt="Disappointed person gif"
                      className="rounded-lg max-w-full h-auto animate-fade-in"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3 animate-pulse">
                      Welcome to the club! Your first bill of ₦50,000 for 1MB is on its way! 📱💸
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowGif(false)}
                      className="text-red-600 border-red-600 hover:bg-red-50 animate-bounce"
                    >
                      Close (and cry silently) 😭
                    </Button>
                  </div>
                </div>
              )}
              <p className="text-sm text-muted-foreground animate-fade-in">
                *Terms and conditions apply. Network quality not guaranteed. Sanity not included. Side effects may
                include chronic frustration.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center mt-12 text-white/80 animate-fade-in">
          <p className="text-sm">
            This is a satirical website created for entertainment purposes only. No actual mobile networks were harmed
            in the making of this site. 😄
          </p>
        </footer>
      </div>
    </div>
  )
}
