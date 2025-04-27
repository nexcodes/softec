"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Calendar, Clock, Eye, MapPin, MessageSquare, Tag, ThumbsUp, UserCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

// Comment form schema
const commentSchema = z.object({
  content: z.string().min(3, {
    message: "Comment must be at least 3 characters.",
  }),
})

type CrimeViewProps = {
  crimeId: string
  reports: CrimeReport[]
  comments: Comment[]
  onClose: () => void
}

const CrimeView = ({ crimeId, reports, comments, onClose }: CrimeViewProps) => {
  const [crimeComments, setCrimeComments] = useState<Comment[]>(
    comments.filter((comment) => comment.crimeId === crimeId),
  )

  // Find the crime report
  const report = reports.find((r) => r.id === crimeId)

  // Initialize comment form
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  })

  if (!report) {
    return null
  }

  // Handle comment submission
  const onSubmit = (values: z.infer<typeof commentSchema>) => {
    // Create a new comment
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      crimeId: crimeId,
      userId: "current-user", // In a real app, this would be the logged-in user's ID
      userName: "You", // In a real app, this would be the logged-in user's name
      content: values.content,
      createdAt: new Date().toISOString(),
    }

    // Add the new comment
    setCrimeComments((prev) => [...prev, newComment])

    // Reset the form
    form.reset()
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600 hover:bg-yellow-600"
      case "investigating":
        return "bg-blue-600 hover:bg-blue-600"
      case "resolved":
        return "bg-green-600 hover:bg-green-600"
      default:
        return "bg-gray-600 hover:bg-gray-600"
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-75 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full my-8 relative"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{report.title}</h2>

          <div className="flex items-center flex-wrap gap-2 mb-4">
            <Badge className={`${getStatusColor(report.status)} font-normal`}>
              {report.status === "pending"
                ? "Pending"
                : report.status === "investigating"
                  ? "Under Investigation"
                  : "Resolved"}
            </Badge>

            <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600 font-normal">
              <Tag className="mr-1 h-3 w-3" />
              {report.category}
            </Badge>

            <span className="text-gray-400 text-sm flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              {report.location}
            </span>
          </div>

          {report.image && (
            <div className="mb-6">
              <div className="rounded-lg overflow-hidden border border-gray-700">
                <img
                  src={report.image || "/placeholder.svg"}
                  alt={report.title}
                  className="w-full max-h-96 object-contain"
                />
              </div>
            </div>
          )}

          <p className="text-gray-300 mb-6">{report.description}</p>

          <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-700">
            <div className="flex items-center">
              {report.authorImage ? (
                <img
                  src={report.authorImage || "/placeholder.svg"}
                  alt={report.authorName}
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <UserCircle className="w-8 h-8 text-gray-500 mr-2" />
              )}
              <span className="text-gray-400 text-sm">{report.authorName}</span>
            </div>

            <div className="flex items-center text-gray-400 text-sm space-x-4">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {report.date}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {report.time}
              </div>
              <div className="flex items-center">
                <Eye className="mr-1 h-4 w-4" />
                {report.views}
              </div>
              <div className="flex items-center">
                <ThumbsUp className="mr-1 h-4 w-4" />
                {report.votes}
              </div>
              <div className="flex items-center">
                <MessageSquare className="mr-1 h-4 w-4" />
                {crimeComments.length}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>

            {crimeComments.length > 0 ? (
              <div className="space-y-4">
                {crimeComments.map((comment) => (
                  <Card key={comment.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        {comment.userImage ? (
                          <img
                            src={comment.userImage || "/placeholder.svg"}
                            alt={comment.userName}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                        ) : (
                          <UserCircle className="w-6 h-6 text-gray-400 mr-2" />
                        )}
                        <span className="text-gray-200 text-sm font-medium">{comment.userName}</span>
                        <span className="text-gray-400 text-xs ml-2">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-300">{comment.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No comments yet. Be the first to comment!</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Add a Comment</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Write your comment here..."
                          className="w-full bg-gray-700 border-gray-600 text-white focus-visible:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Post Comment
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CrimeView
