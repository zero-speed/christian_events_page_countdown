"use client"

import { useEffect, useState } from "react"
import { X, Calendar, Clock, MapPin, Users, CheckCircle, Send, Heart } from "lucide-react"
import Image from "next/image"
import { Event, Comment } from "@/lib/types"

interface EventModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [commentText, setCommentText] = useState("")
  const [commentAuthor, setCommentAuthor] = useState("")
  const [eventState, setEventState] = useState<Event | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set())

  useEffect(() => {
    setCurrentImageIndex(0)
    if (event) {
      setEventState(event)
      setIsConfirmed(false)
      setCommentText("")
      setCommentAuthor("")
      setLikedComments(new Set())
    }

    if (isOpen && event && event.gallery.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % event.gallery.length)
      }, 3000)

      return () => clearInterval(timer)
    }
  }, [isOpen, event])

  const handleAddComment = () => {
    if (commentText.trim() && commentAuthor.trim() && eventState) {
      const newComment: Comment = {
        id: (eventState.comments?.length || 0) + 1,
        author: commentAuthor,
        text: commentText,
        date: new Date().toLocaleDateString("es-ES"),
        likes: 0,
      }

      setEventState({
        ...eventState,
        comments: [...(eventState.comments || []), newComment],
      })

      setCommentText("")
      setCommentAuthor("")
    }
  }

  const handleConfirmAttendance = () => {
    if (eventState) {
      setIsConfirmed(true)
      setEventState({
        ...eventState,
        confirmations: (eventState.confirmations || 0) + 1,
      })
    }
  }

  const handleLikeComment = (commentId: number) => {
    if (eventState && eventState.comments) {
      const newLikedComments = new Set(likedComments)
      
      if (newLikedComments.has(commentId)) {
        newLikedComments.delete(commentId)
      } else {
        newLikedComments.add(commentId)
      }
      
      setLikedComments(newLikedComments)
      
      const updatedComments = eventState.comments.map((comment) => {
        if (comment.id === commentId) {
          const isNowLiked = newLikedComments.has(commentId)
          return {
            ...comment,
            likes: (comment.likes || 0) + (isNowLiked ? 1 : -1),
          }
        }
        return comment
      })

      setEventState({
        ...eventState,
        comments: updatedComments,
      })
    }
  }

  if (!eventState) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Modal */}
      <div
        className={`relative bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-800 shadow-2xl transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-slate-800/90 hover:bg-slate-700 text-white rounded-full p-2 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image Carousel */}
        <div className="relative h-80 overflow-hidden rounded-t-2xl">
          {eventState.gallery.map((imageSrc, index) => (
            <Image
              key={imageSrc}
              src={imageSrc || "/placeholder.svg"}
              alt={`${eventState.title} - image ${index + 1}`}
              fill
              className={`object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

          {/* Navigation Dots */}
          {eventState.gallery.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {eventState.gallery.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index ? "bg-white scale-125" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-amber-500 text-slate-900 px-4 py-2 rounded-full font-semibold">
            {eventState.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-4xl font-bold text-white mb-6">{eventState.title}</h2>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <Calendar className="w-6 h-6 mr-3 text-amber-400" />
              <div>
                <div className="text-xs text-slate-400 uppercase">Fecha</div>
                <div className="text-white font-semibold">{eventState.date}</div>
              </div>
            </div>
            <div className="flex items-center bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <Clock className="w-6 h-6 mr-3 text-amber-400" />
              <div>
                <div className="text-xs text-slate-400 uppercase">Hora</div>
                <div className="text-white font-semibold">{eventState.time}</div>
              </div>
            </div>
            <div className="flex items-center bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <MapPin className="w-6 h-6 mr-3 text-amber-400" />
              <div>
                <div className="text-xs text-slate-400 uppercase">Ubicación</div>
                <div className="text-white font-semibold">{eventState.location}</div>
              </div>
            </div>
            <div className="flex items-center bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
              <div>
                <div className="text-xs text-slate-400 uppercase">Confirmados</div>
                <div className="text-white font-semibold">{eventState.confirmations || 0} personas</div>
              </div>
            </div>
            {eventState.capacity && (
              <div className="flex items-center bg-slate-800/50 rounded-lg p-4 border border-slate-700 md:col-span-1">
                <Users className="w-6 h-6 mr-3 text-amber-400" />
                <div>
                  <div className="text-xs text-slate-400 uppercase">Capacidad</div>
                  <div className="text-white font-semibold">{eventState.capacity}</div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Descripción</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{eventState.description}</p>
          </div>

          {eventState.organizer && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Organizador</h3>
              <p className="text-slate-300">{eventState.organizer}</p>
            </div>
          )}

          {/* Confirmation Button */}
          <button
            onClick={handleConfirmAttendance}
            disabled={isConfirmed}
            className={`w-full font-bold py-4 rounded-lg transition-all duration-300 mb-8 ${
              isConfirmed
                ? "bg-green-600 text-white cursor-default"
                : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50"
            }`}
          >
            {isConfirmed ? "✓ ¡Asistencia Confirmada!" : "Confirmar Asistencia"}
          </button>

          {/* Comments Section */}
          <div className="border-t border-slate-700 pt-8">
            <h3 className="text-xl font-bold text-white mb-6">Comentarios ({eventState.comments?.length || 0})</h3>

            {/* Add Comment Form */}
            <div className="bg-slate-800/30 rounded-lg p-6 mb-6 border border-slate-700">
              <input
                type="text"
                placeholder="Tu nombre"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 mb-3 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <textarea
                placeholder="Escribe tu comentario..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 mb-3 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim() || !commentAuthor.trim()}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-semibold px-6 py-2 rounded-lg transition-all duration-300"
              >
                <Send className="w-4 h-4" />
                Enviar Comentario
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {eventState.comments && eventState.comments.length > 0 ? (
                eventState.comments.map((comment) => (
                  <div key={comment.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-amber-400">{comment.author}</h4>
                      <span className="text-xs text-slate-500">{comment.date}</span>
                    </div>
                    <p className="text-slate-300 mb-3">{comment.text}</p>
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-300 ${
                        likedComments.has(comment.id)
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          : "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-red-400"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
                      <span className="text-sm font-medium">{comment.likes || 0}</span>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-6">Sin comentarios aún. ¡Sé el primero en comentar!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
