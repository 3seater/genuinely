import { useState, useRef, useEffect } from 'react'
import './App.css'
import { database, storage } from './firebase'
import { ref, push, onValue, query, orderByChild, limitToLast, get, update } from 'firebase/database'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import Grain from './components/Grain'

// Import local videos
import video1 from './assets/videos/Download (11).mp4'
import video2 from './assets/videos/Download (13).mp4'
import video3 from './assets/videos/SnapTik-dot-Kim-1fafd7d075cac7219f5b08bec7c67655.mp4'
import video4 from './assets/videos/SnapTik-dot-Kim-279a3e690b1294bbef6cd3114d3af933 (1).mp4'
import video5 from './assets/videos/SnapTik-dot-Kim-63b4077f6c48fcd289ecef67a022228c.mp4'
import video6 from './assets/videos/SnapTik-dot-Kim-6a92d566ecafbe6230777e33f8673913.mp4'
import video7 from './assets/videos/SnapTik-dot-Kim-f766df1f811efcb75f8bb3a8c49f1614.mp4'
import video8 from './assets/videos/Download (2).mp4'
import video9 from './assets/videos/Download (3).mp4'
import video10 from './assets/videos/Download (4).mp4'
import video11 from './assets/videos/Download (7).mp4'
import video12 from './assets/videos/Download (5).mp4'
import video13 from './assets/videos/Download (8).mp4'
import video14 from './assets/videos/Download (10).mp4'
import video15 from './assets/videos/Download (12).mp4'
import video16 from './assets/videos/Download (14).mp4'
import video17 from './assets/videos/Download (15).mp4'
import video18 from './assets/videos/Download (16).mp4'
import video19 from './assets/videos/Download (17).mp4'
import video20 from './assets/videos/Download (18).mp4'
import video21 from './assets/videos/Download (20).mp4'
import video22 from './assets/videos/Download (21).mp4'
import video23 from './assets/videos/Download (22).mp4'
import video24 from './assets/videos/Download (23).mp4'
import video25 from './assets/videos/Download (24).mp4'
import video26 from './assets/videos/Download (25).mp4'
import video27 from './assets/videos/Download (26).mp4'
import video28 from './assets/videos/Download (27).mp4'
import video29 from './assets/videos/Download (28).mp4'

// Import app icons
import pumpfunIcon from './assets/iphone icons/pumpfun.png'
import tiktokIcon from './assets/iphone icons/tiktok.png'
import xIcon from './assets/iphone icons/x.png'
import messagesIcon from './assets/iphone icons/messages.png'

// Import TikTok action icons
import commentsIcon from './assets/tiktok icons/comments.svg'
import forwardIcon from './assets/tiktok icons/forward.svg'

// Import status bar icons
import cellularIcon from './assets/iphone icons/🧩 Status Bar › Cellular Icon.svg'
import wifiIcon from './assets/iphone icons/🧩 Status Bar › Wi-Fi Icon.svg'
import batteryIcon from './assets/iphone icons/🧩 Status Bar › Battery Icon.svg'

// Import profile pictures
import profile1 from './assets/profile pictures/G3rOWA4W8AAMQQ5.jpg'
import profile2 from './assets/profile pictures/images (13).jpg'
import profile3 from './assets/profile pictures/images (14).jpg'
import profile4 from './assets/profile pictures/images (15).jpg'
import profile5 from './assets/profile pictures/images (16).jpg'
import profile6 from './assets/profile pictures/images (17).jpg'
import profile7 from './assets/profile pictures/IMG_7617.jpg'
import profile8 from './assets/profile pictures/IMG_7722.jpg'
import profile9 from './assets/profile pictures/Pepe_With_Crack.webp'
import profile10 from './assets/profile pictures/images (18).jpg'
import profile11 from './assets/profile pictures/images (19).jpg'
import profile12 from './assets/profile pictures/2401a9479bec9d8c575b38623160e1ef8bcf9105r1-736-735v2_hq.jpg'
import profile13 from './assets/profile pictures/meme-pfp-02.jpg'

interface VideoItem {
  id: number
  username: string
  caption: string
  videoUrl: string
  avatarUrl: string
  likes: number
  comments: number
  bookmarks: number
  shares: number
}

interface Comment {
  id: number
  firebaseId: string
  username: string
  avatar: string
  text: string
  likes: number
  timestamp: Date
  parentId?: string
  replies?: Comment[]
}

// Helper function to format numbers (1900000 -> 1.9M)
const formatCount = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Generate random count for engagement
const randomCount = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Format time ago
const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

// Get all available profile pictures
const getAllProfilePictures = () => {
  return [profile1, profile2, profile3, profile4, profile5, profile6, profile7, profile8, profile9, profile10, profile11, profile12, profile13]
}

// Shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}


function App() {
  const [videos] = useState<VideoItem[]>(() => {
    // Create initial video array
    const initialVideos = [
      { id: 1, username: '@cosmic.vibes', caption: 'nahh genuinely 😭', videoUrl: video1, avatarUrl: profile1, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 2, username: '@midnight_dreamer', caption: 'genuinely fr 💀', videoUrl: video2, avatarUrl: profile2, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 3, username: '@neon.aesthetic', caption: 'genuinely tweaking 🙏', videoUrl: video3, avatarUrl: profile3, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 4, username: '@lostinthemusic', caption: 'genuinely 🥀', videoUrl: video4, avatarUrl: profile4, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 5, username: '@rxlly.wav', caption: 'genuinely cant rn 😭💀', videoUrl: video5, avatarUrl: profile5, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 6, username: '@goldenhour.clips', caption: 'this is genuinely it 🙏', videoUrl: video6, avatarUrl: profile6, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 7, username: '@404.notfound', caption: 'genuinely unreal 🥀😭', videoUrl: video7, avatarUrl: profile7, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 8, username: '@vapor_aesthetics', caption: 'genuinely wild 💀🙏', videoUrl: video8, avatarUrl: profile8, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 9, username: '@memequeen420', caption: 'nahh this genuinely 😭', videoUrl: video9, avatarUrl: profile9, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 10, username: '@skibidi.ohio', caption: 'genuinely insane 🥀', videoUrl: video10, avatarUrl: profile10, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 11, username: '@rizz.master', caption: 'genuinely no way 💀😭', videoUrl: video11, avatarUrl: profile11, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 12, username: '@lowkey.fire', caption: 'genuinely hits 🥀💀', videoUrl: video12, avatarUrl: profile12, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 13, username: '@based.fr', caption: 'nahh genuinely fr 😭🙏', videoUrl: video13, avatarUrl: profile13, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 14, username: '@vibe.check', caption: 'genuinely crazy 💀', videoUrl: video14, avatarUrl: profile4, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 15, username: '@no.cap.zone', caption: 'genuinely 🥀😭', videoUrl: video15, avatarUrl: profile5, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 16, username: '@ethereal.energy', caption: 'genuinely obsessed 🙏💀', videoUrl: video16, avatarUrl: profile6, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 17, username: '@chaos.theory', caption: 'this genuinely it 😭', videoUrl: video17, avatarUrl: profile7, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 18, username: '@moonlight.faded', caption: 'genuinely unhinged 🥀', videoUrl: video18, avatarUrl: profile8, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 19, username: '@divine.timing', caption: 'nahh genuinely 💀🙏', videoUrl: video19, avatarUrl: profile9, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 20, username: '@synthetic.dreams', caption: 'genuinely cant 😭🥀', videoUrl: video20, avatarUrl: profile10, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 21, username: '@core.memory', caption: 'genuinely broke me 💀', videoUrl: video21, avatarUrl: profile11, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 22, username: '@analog.soul', caption: 'genuinely real 🙏😭', videoUrl: video22, avatarUrl: profile12, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 23, username: '@nocturnal.thoughts', caption: 'genuinely tho 🥀💀', videoUrl: video23, avatarUrl: profile13, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 24, username: '@velvet.underground', caption: 'genuinely fr fr 😭🙏', videoUrl: video24, avatarUrl: profile1, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 25, username: '@faded.frequencies', caption: 'nahh genuinely 💀', videoUrl: video25, avatarUrl: profile2, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 26, username: '@liminal.spaces', caption: 'genuinely different 🥀😭', videoUrl: video26, avatarUrl: profile3, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 27, username: '@abstract.feelings', caption: 'this genuinely hits 🙏', videoUrl: video27, avatarUrl: profile4, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 28, username: '@nostalgic.wave', caption: 'genuinely iconic 💀🥀', videoUrl: video28, avatarUrl: profile5, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
      { id: 29, username: '@parallel.universe', caption: 'genuinely wild 😭🙏💀', videoUrl: video29, avatarUrl: profile6, likes: randomCount(150000, 2800000), comments: randomCount(5000, 75000), bookmarks: randomCount(20000, 350000), shares: randomCount(50000, 750000) },
    ]
    // Shuffle the videos on every load
    return shuffleArray(initialVideos)
  })

  // Create circular buffer by adding duplicates at boundaries
  const circularVideos = [
    videos[videos.length - 1], // Last video at start (for wrap-up)
    ...videos,
    videos[0] // First video at end (for wrap-down)
  ]
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(1) // Start at first real video (index 1 because of duplicate)
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set())
  const [pausedVideos, setPausedVideos] = useState<Set<number>>(new Set())
  const [mutedVideos, setMutedVideos] = useState<Set<number>>(new Set())
  const [glowColor, setGlowColor] = useState('100, 150, 255')
  const screenRef = useRef<HTMLDivElement>(null)
  const [showMessages, setShowMessages] = useState(false)
  const [messages, setMessages] = useState<Array<{ id: string; text: string; isUser: boolean; username: string; timestamp: Date; imageUrl?: string }>>([])
  const [messageInput, setMessageInput] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showUsernameSetup, setShowUsernameSetup] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [currentVideoComments, setCurrentVideoComments] = useState<number | null>(null)
  const [commentInput, setCommentInput] = useState('')
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set())
  const [videoComments, setVideoComments] = useState<{ [videoId: number]: Comment[] }>({})
  const [replyingTo, setReplyingTo] = useState<{ firebaseId: string; username: string } | null>(null)
  const commentInputRef = useRef<HTMLInputElement>(null)

  // Check for username on first load
  useEffect(() => {
    const username = getUserName()
    if (!username) {
      setShowUsernameSetup(true)
    }
  }, [])

  // Initialize scroll position to first real video (skip duplicate at index 0)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    
    // Set initial scroll position to first real video (index 1)
    const videoHeight = container.clientHeight
    container.scrollTo({
      top: 1 * videoHeight,
      behavior: 'auto'
    })
  }, [])

  // Auto-play video when it comes into view
  useEffect(() => {
    const videoElements = document.querySelectorAll('.video-player')
    videoElements.forEach((video, index) => {
      const videoEl = video as HTMLVideoElement
      // Unmute after first interaction for audio, keep muted initially for autoplay
      const videoData = circularVideos[index]
      videoEl.muted = !hasInteracted || mutedVideos.has(videoData.id)
      if (index === currentVideoIndex) {
        // Only play if user hasn't manually paused this video
        if (!pausedVideos.has(videoData.id)) {
          if (videoEl.paused) {
            videoEl.currentTime = 0
            const playPromise = videoEl.play()
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Autoplay might be blocked, that's okay
              })
            }
          }
        } else {
          // User has manually paused, keep it paused
          videoEl.pause()
        }
      } else {
        videoEl.pause()
      }
    })
  }, [currentVideoIndex, hasInteracted, mutedVideos, circularVideos, pausedVideos])

  // Handle video state when switching between messages/comments and TikTok
  useEffect(() => {
    if (!showMessages && !showComments) {
      // Returning to TikTok - pause ALL videos first, then play current
      setTimeout(() => {
        const videoElements = document.querySelectorAll('.video-player')
        
        // First, pause and reset ALL videos
        videoElements.forEach((video) => {
          const videoEl = video as HTMLVideoElement
          videoEl.pause()
          videoEl.currentTime = 0
        })
        
        // Then play only the current video (if not manually paused)
        const currentVideo = videoElements[currentVideoIndex] as HTMLVideoElement
        if (currentVideo) {
          const currentVideoData = circularVideos[currentVideoIndex]
          currentVideo.muted = !hasInteracted || mutedVideos.has(currentVideoData.id)
          currentVideo.currentTime = 0
          
          // Only play if user hasn't manually paused this video
          if (!pausedVideos.has(currentVideoData.id)) {
            currentVideo.play().catch(() => {
              // Autoplay might be blocked
            })
          }
        }
      }, 100)
    } else if (showMessages || showComments) {
      // Going to messages or comments - pause all videos
      const videoElements = document.querySelectorAll('.video-player')
      videoElements.forEach((video) => {
        const videoEl = video as HTMLVideoElement
        videoEl.pause()
      })
    }
  }, [showMessages, showComments, currentVideoIndex, hasInteracted])

  // Ensure first video loads and plays on mount (single clean attempt)
  useEffect(() => {
    const initFirstVideo = () => {
      const videoElements = document.querySelectorAll('.video-player')
      if (videoElements.length === 0) return

      const firstVideo = videoElements[0] as HTMLVideoElement
      
      const attemptPlay = () => {
        firstVideo.muted = true // Start muted for Chrome autoplay
        firstVideo.currentTime = 0
        firstVideo.play().catch(() => {
          // If autoplay fails, wait for user interaction
          const playOnInteract = () => {
            firstVideo.play()
            setHasInteracted(true)
            document.removeEventListener('click', playOnInteract)
            document.removeEventListener('touchstart', playOnInteract)
          }
          document.addEventListener('click', playOnInteract, { once: true })
          document.addEventListener('touchstart', playOnInteract, { once: true })
        })
      }

      // Wait for video to be ready
      if (firstVideo.readyState >= 3) {
        attemptPlay()
      } else {
        firstVideo.addEventListener('canplay', attemptPlay, { once: true })
      }
    }

    setTimeout(initFirstVideo, 300)
  }, [])

  // Sample video colors for ambient glow with enhanced vibrancy
  useEffect(() => {
    // Don't sample video colors when showing messages
    if (showMessages) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const sampleColors = () => {
      const videoElements = document.querySelectorAll('.video-player')
      // Use currentVideoIndex which now points to circular buffer
      const currentVideo = videoElements[currentVideoIndex] as HTMLVideoElement
      
      if (!currentVideo || currentVideo.readyState < 2) return

      canvas.width = 80
      canvas.height = 80
      
      try {
        ctx.drawImage(currentVideo, 0, 0, 80, 80)
        const imageData = ctx.getImageData(0, 0, 80, 80).data
        
        let r = 0, g = 0, b = 0, count = 0
        
        // Sample pixels, ignoring very dark ones to get more vibrant colors
        for (let i = 0; i < imageData.length; i += 4) {
          const red = imageData[i]
          const green = imageData[i + 1]
          const blue = imageData[i + 2]
          const brightness = (red + green + blue) / 3
          
          // Skip very dark pixels (black areas don't contribute to glow)
          if (brightness > 30) {
            r += red
            g += green
            b += blue
            count++
          }
        }
        
        if (count > 0) {
          r = Math.floor(r / count)
          g = Math.floor(g / count)
          b = Math.floor(b / count)
          
          // Boost saturation for more vibrant glow
          const max = Math.max(r, g, b)
          const min = Math.min(r, g, b)
          const saturation = max === 0 ? 0 : (max - min) / max
          
          if (saturation > 0.1) {
            // Amplify the dominant color
            const boost = 1.4
            r = Math.min(255, Math.floor(r * boost))
            g = Math.min(255, Math.floor(g * boost))
            b = Math.min(255, Math.floor(b * boost))
          }
          
          setGlowColor(`${r}, ${g}, ${b}`)
        }
      } catch (e) {
        // CORS or other error, keep default
      }
    }

    const interval = setInterval(sampleColors, 50) // More frequent updates
    return () => clearInterval(interval)
  }, [currentVideoIndex, showMessages])
  
  // Update glow color for messages screen
  useEffect(() => {
    if (showMessages) {
      // Set blue glow for messages screen
      setGlowColor('30, 100, 200')
    }
    // When returning to TikTok, the video color sampling will take over
  }, [showMessages])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let animationFrameId: number

    // Track which video is in view and update opacity
    const updateCurrentVideo = () => {
      const scrollTop = container.scrollTop
      const videoHeight = container.clientHeight
      let index = Math.round(scrollTop / videoHeight)
      
      // Clamp index to circular buffer range
      index = Math.max(0, Math.min(index, circularVideos.length - 1))
      
      // Seamless wrap when snapped to duplicate videos
      const isSnapped = Math.abs(scrollTop - (index * videoHeight)) < 1 // Within 1px of snap position
      
      if (isSnapped) {
        if (index === 0) {
          // Snapped to first duplicate (showing last video), instantly jump to real last video
          requestAnimationFrame(() => {
            container.scrollTo({
              top: videos.length * videoHeight,
              behavior: 'auto'
            })
          })
          return
        } else if (index === circularVideos.length - 1) {
          // Snapped to last duplicate (showing first video), instantly jump to real first video
          requestAnimationFrame(() => {
            container.scrollTo({
              top: 1 * videoHeight,
              behavior: 'auto'
            })
          })
          return
        }
      }
      
      setCurrentVideoIndex(index)

      // Update opacity for all video overlays
      const videoContainers = document.querySelectorAll('.video-container')
      videoContainers.forEach((videoContainer, i) => {
        const sideActions = videoContainer.querySelector('.side-actions') as HTMLElement
        const videoInfo = videoContainer.querySelector('.video-info') as HTMLElement
        
        if (sideActions && videoInfo) {
          // Calculate how far this video is from its centered position
          const videoTop = i * videoHeight
          const distanceFromCenter = Math.abs(scrollTop - videoTop)
          const fadeDistance = videoHeight * 0.4 // Fade over 40% of video height
          
          // Calculate opacity: 1 when centered, fades to 0.2 as you scroll away
          let opacity = 1 - (distanceFromCenter / fadeDistance)
          opacity = Math.max(0.2, Math.min(1, opacity)) // Clamp between 0.2 and 1
          
          sideActions.style.opacity = String(opacity)
          videoInfo.style.opacity = String(opacity)
        }
      })
    }

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = requestAnimationFrame(updateCurrentVideo)
    }

    // Initial update
    updateCurrentVideo()

    container.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      container.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [showMessages, showComments, circularVideos.length])

  // Simple drag-to-scroll with snap
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let isDragging = false
    let startY = 0
    let startScroll = 0

    const onStart = (y: number) => {
      // Enable audio on first interaction
      if (!hasInteracted) {
        setHasInteracted(true)
      }
      isDragging = true
      startY = y
      startScroll = container.scrollTop
      container.classList.add('dragging')
      container.classList.remove('snapping')
    }

    const onMove = (y: number) => {
      if (!isDragging) return
      const delta = startY - y
      container.scrollTop = startScroll + delta
    }

    const onEnd = () => {
      if (!isDragging) return
      isDragging = false
      
      container.classList.remove('dragging')
      container.classList.add('snapping')
      
      // Snap to nearest video
      const videoHeight = container.clientHeight
      const currentPos = container.scrollTop
      let nearest = Math.round(currentPos / videoHeight)
      
      // Clamp to valid range
      nearest = Math.max(0, Math.min(nearest, circularVideos.length - 1))
      
      // Snap to the nearest video
      container.scrollTo({
        top: nearest * videoHeight,
        behavior: 'smooth'
      })
      
      // Remove snapping class after animation
      setTimeout(() => {
        container.classList.remove('snapping')
      }, 300)
    }

    // Handle wheel scroll - snap to next/prev video
    let wheelTimeout: number
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      clearTimeout(wheelTimeout)
      wheelTimeout = window.setTimeout(() => {
        const videoHeight = container.clientHeight
        const currentPos = container.scrollTop
        const currentIndex = Math.round(currentPos / videoHeight)
        
        let targetIndex = currentIndex
        if (e.deltaY > 0) {
          targetIndex = currentIndex + 1
        } else if (e.deltaY < 0) {
          targetIndex = currentIndex - 1
        }
        
        // Clamp to circular buffer range
        targetIndex = Math.max(0, Math.min(targetIndex, circularVideos.length - 1))
        
        container.scrollTo({
          top: targetIndex * videoHeight,
          behavior: 'smooth'
        })
      }, 50)
    }
    
    // Handle arrow keys - snap to next/prev video
    let isKeyScrolling = false
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
      if (isKeyScrolling) return // Prevent multiple key presses while scrolling
      
      e.preventDefault()
      isKeyScrolling = true
      
      const videoHeight = container.clientHeight
      const currentPos = container.scrollTop
      const currentIndex = Math.round(currentPos / videoHeight)
      
      let targetIndex = currentIndex
      if (e.key === 'ArrowDown') {
        targetIndex = currentIndex + 1
      } else if (e.key === 'ArrowUp') {
        targetIndex = currentIndex - 1
      }
      
      // Clamp to circular buffer range
      targetIndex = Math.max(0, Math.min(targetIndex, circularVideos.length - 1))
      
      container.scrollTo({
        top: targetIndex * videoHeight,
        behavior: 'smooth'
      })
      
      // Re-enable key scrolling after animation
      setTimeout(() => {
        isKeyScrolling = false
      }, 300)
    }

    // Mouse handlers
    const mouseDown = (e: MouseEvent) => {
      // Don't prevent default on initial mousedown - this blocks clicks in Firefox
      onStart(e.clientY)
    }
    const mouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        onMove(e.clientY)
      }
    }
    const mouseUp = () => onEnd()

    // Touch handlers
    const touchStart = (e: TouchEvent) => {
      e.preventDefault() // Prevent default for touch is ok
      onStart(e.touches[0].clientY)
    }
    const touchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault()
        onMove(e.touches[0].clientY)
      }
    }
    const touchEnd = () => onEnd()

    // Attach listeners with proper options for cross-browser compatibility
    // Use feature detection for passive events
    let supportsPassive = false
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassive = true
          return false
        }
      })
      window.addEventListener('test' as any, null as any, opts)
      window.removeEventListener('test' as any, null as any, opts)
    } catch (e) {
      // Passive not supported
    }

    // Wheel
    try {
      container.addEventListener('wheel', handleWheel, supportsPassive ? { passive: false } : false as any)
    } catch {
      container.addEventListener('wheel', handleWheel)
    }
    
    // Keyboard
    window.addEventListener('keydown', handleKeyDown, supportsPassive ? { passive: false } : false as any)
    
    // Mouse
    container.addEventListener('mousedown', mouseDown, supportsPassive ? { passive: true } : false as any)
    window.addEventListener('mousemove', mouseMove, supportsPassive ? { passive: false } : false as any)
    window.addEventListener('mouseup', mouseUp, supportsPassive ? { passive: true } : false as any)
    
    // Touch
    container.addEventListener('touchstart', touchStart, supportsPassive ? { passive: false } : false as any)
    container.addEventListener('touchmove', touchMove, supportsPassive ? { passive: false } : false as any)
    container.addEventListener('touchend', touchEnd, supportsPassive ? { passive: true } : false as any)

    return () => {
      container.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      container.removeEventListener('mousedown', mouseDown)
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mouseup', mouseUp)
      container.removeEventListener('touchstart', touchStart)
      container.removeEventListener('touchmove', touchMove)
      container.removeEventListener('touchend', touchEnd)
    }
  }, [videos.length, showMessages, showComments, hasInteracted, circularVideos.length])

  // Handle like toggle
  const toggleLike = (videoId: number) => {
    setLikedVideos(prev => {
      const newLiked = new Set(prev)
      if (newLiked.has(videoId)) {
        newLiked.delete(videoId)
      } else {
        newLiked.add(videoId)
      }
      return newLiked
    })
  }

  // Handle volume toggle
  const toggleVolume = (videoId: number) => {
    const isCurrentlyMuted = mutedVideos.has(videoId)
    setMutedVideos(prev => {
      const newMuted = new Set(prev)
      if (isCurrentlyMuted) {
        newMuted.delete(videoId)
      } else {
        newMuted.add(videoId)
      }
      return newMuted
    })

    // Immediately apply the change to the current video if it's playing
    if (circularVideos[currentVideoIndex] && circularVideos[currentVideoIndex].id === videoId) {
      const videoElements = document.querySelectorAll('.video-player')
      const currentVideo = videoElements[currentVideoIndex] as HTMLVideoElement
      if (currentVideo) {
        currentVideo.muted = !isCurrentlyMuted
      }
    }
  }

  // Handle video play/pause on click
  const toggleVideoPlayPause = (e: React.MouseEvent<HTMLVideoElement>, videoId: number) => {
    e.stopPropagation() // Prevent event bubbling
    const video = e.currentTarget
    
    if (video.paused) {
      video.play().catch(() => {
        // Handle play error silently
      })
      setPausedVideos(prev => {
        const newSet = new Set(prev)
        newSet.delete(videoId)
        return newSet
      })
    } else {
      video.pause()
      setPausedVideos(prev => {
        const newSet = new Set(prev)
        newSet.add(videoId)
        return newSet
      })
    }
  }

  const openComments = (videoId: number) => {
    setCurrentVideoComments(videoId)
    setShowComments(true)
  }

  const closeComments = () => {
    setShowComments(false)
    setCommentInput('')
    setReplyingTo(null)
  }

  const startReply = (firebaseId: string, username: string) => {
    const mention = username.startsWith('@') ? username : `@${username}`
    const mentionText = `${mention} `
    setReplyingTo({ firebaseId, username: mention })
    setCommentInput(mentionText)
    // Focus the input after state updates
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus()
        const length = mentionText.length
        commentInputRef.current.setSelectionRange(length, length)
      }
    }, 50)
  }

  const renderCommentContent = (comment: Comment, isReply = false, key?: string) => (
    <div key={key || comment.firebaseId} className={`comment-item ${isReply ? 'reply' : ''}`}>
      <img src={comment.avatar} alt={comment.username} className="comment-avatar" />
      <div className="comment-content">
        <div className="comment-username">{comment.username}</div>
        <div className="comment-text">{comment.text}</div>
        <div className="comment-footer">
          <span className="comment-time">{formatTimeAgo(comment.timestamp)}</span>
          <button
            className="comment-reply"
            onClick={() => startReply(comment.firebaseId, comment.username)}
          >
            Reply
          </button>
        </div>
      </div>
      <div className="comment-like-section">
        <button
          className={`comment-like-btn ${likedComments.has(comment.id) ? 'liked' : ''}`}
          onClick={() => toggleCommentLike(comment.id, comment.firebaseId)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 48 48"
            fill={likedComments.has(comment.id) ? '#fe2c55' : 'none'}
            stroke={likedComments.has(comment.id) ? '#fe2c55' : '#161823'}
            strokeWidth="3"
          >
            <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z" />
          </svg>
        </button>
        {comment.likes > 0 && <span className="comment-like-count">{comment.likes}</span>}
      </div>
    </div>
  )

  const renderRepliesFlat = (
    replies?: Comment[]
  ): Array<ReturnType<typeof renderCommentContent>> => {
    if (!replies || replies.length === 0) return []
    return replies.flatMap((reply) => [
      renderCommentContent(reply, true, `reply-${reply.firebaseId}`),
      ...(reply.replies ? renderRepliesFlat(reply.replies) : [])
    ])
  }

  const toggleCommentLike = async (commentId: number, commentFirebaseId: string) => {
    if (!database || !currentVideoComments) return

    const currentUser = getUserName()
    if (!currentUser) return // User must be logged in to like

    try {
      const commentRef = ref(database, `comments/video_${currentVideoComments}/${commentFirebaseId}`)
      const commentSnapshot = await get(commentRef)

      if (commentSnapshot.exists()) {
        const commentData = commentSnapshot.val()
        const currentLikes = commentData.likes || 0
        const likedBy = commentData.likedBy || []
        const isLiked = likedBy.includes(currentUser)

        // Update likedBy array in Firebase
        let newLikedBy: string[]
        let newLikes: number

        if (isLiked) {
          // Remove user from likedBy array
          newLikedBy = likedBy.filter((user: string) => user !== currentUser)
          newLikes = Math.max(0, currentLikes - 1)
        } else {
          // Add user to likedBy array
          newLikedBy = [...likedBy, currentUser]
          newLikes = currentLikes + 1
        }

        await update(commentRef, {
          likes: newLikes,
          likedBy: newLikedBy
        })

        // Update local state
        setLikedComments(prev => {
          const newLiked = new Set(prev)
          if (isLiked) {
            newLiked.delete(commentId)
          } else {
            newLiked.add(commentId)
          }
          return newLiked
        })

        console.log(`Comment ${isLiked ? 'unliked' : 'liked'} by ${currentUser}! New count: ${newLikes}`)
      }
    } catch (error) {
      console.error('Error toggling comment like:', error)
    }
  }

  const postComment = async () => {
    if (!commentInput.trim() || !currentVideoComments) {
      console.log('Cannot post: missing input or video ID')
      return
    }
    
    const username = getUserName()
    const avatar = getUserAvatar()
    
    console.log('Posting comment with username:', username, 'avatar:', avatar)
    
    if (!username || !avatar) {
      console.error('Missing username or avatar')
      alert('Please set your username first')
      return
    }

    if (!database) {
      console.error('Firebase not initialized')
      alert('Firebase not connected. Check console.')
      return
    }

    try {
      const commentsRef = ref(database, `comments/video_${currentVideoComments}`)
      
      const commentData: any = {
        username: username.startsWith('@') ? username : `@${username}`,
        avatar: avatar,
        text: commentInput.trim(),
        likes: 0,
        timestamp: new Date().toISOString()
      }
      
      // If replying to a comment, add parent ID
      if (replyingTo) {
        commentData.parentId = replyingTo.firebaseId
        console.log('Posting reply to:', replyingTo.firebaseId)
      }
      
      console.log('Posting comment data:', commentData)
      
      await push(commentsRef, commentData)
      
      console.log('Comment posted successfully!')
      setCommentInput('')
      setReplyingTo(null)
    } catch (error) {
      console.error('Error posting comment:', error)
      alert('Error posting comment. Check console.')
    }
  }

  // Get or check if user has username
  const getUserName = () => {
    return localStorage.getItem('genuinely_username') || ''
  }

  // Get user avatar
  const getUserAvatar = () => {
    return localStorage.getItem('genuinely_avatar') || ''
  }

  // Open messages (username already set on load)
  const openMessages = () => {
    setShowMessages(true)
  }

  // Set username
  const setUsername = () => {
    const trimmed = usernameInput.trim()
    if (!trimmed) return
    
    // Pick a random profile picture from available ones
    const profilePictures = getAllProfilePictures()
    const randomAvatar = profilePictures[Math.floor(Math.random() * profilePictures.length)]
    
    localStorage.setItem('genuinely_username', trimmed)
    localStorage.setItem('genuinely_avatar', randomAvatar)
    setShowUsernameSetup(false)
    setUsernameInput('')
  }

  // Compress image before upload
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxWidth) {
              width = (width * maxWidth) / height
              height = maxWidth
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Canvas toBlob failed'))
              }
            },
            'image/jpeg',
            quality
          )
        }
        img.onerror = reject
      }
      reader.onerror = reject
    })
  }

  // Upload image to Firebase Storage
  const uploadImage = async (file: File): Promise<string> => {
    if (!storage || !database) {
      throw new Error('Firebase not initialized')
    }

    // Compress the image first
    const compressedBlob = await compressImage(file)
    
    // Create a unique filename
    const filename = `chat-images/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`
    const imageRef = storageRef(storage, filename)
    
    // Upload the compressed image
    await uploadBytes(imageRef, compressedBlob)
    
    // Get the download URL
    const downloadURL = await getDownloadURL(imageRef)
    return downloadURL
  }

  // Handle image selection
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image is too large. Please select an image under 10MB')
      return
    }

    setUploadingImage(true)

    try {
      // Upload image and get URL
      const imageUrl = await uploadImage(file)
      
      // Send message with image
      const newMessage = {
        text: messageInput.trim() || '', // Optional caption
        username: getUserName(),
        timestamp: Date.now(),
        imageUrl: imageUrl
      }

      const messagesRef = ref(database!, 'messages')
      await push(messagesRef, newMessage)
      console.log('Image message sent:', newMessage)
      
      setMessageInput('') // Clear caption
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setUploadingImage(false)
      // Reset the file input
      event.target.value = ''
    }
  }

  // Send message
  const sendMessage = async () => {
    if (!messageInput.trim()) return
    
    if (!database) {
      console.error('Firebase not initialized')
      alert('Chat is temporarily unavailable')
      return
    }
    
    const newMessage = {
      text: messageInput,
      username: getUserName(),
      timestamp: Date.now()
    }
    
    try {
      // Push to Firebase Realtime Database
      const messagesRef = ref(database!, 'messages')
      await push(messagesRef, newMessage)
      console.log('Message sent:', newMessage)
      setMessageInput('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message. Check console.')
    }
  }

  // Load chat history and listen for real-time updates
  useEffect(() => {
    if (!database || !showMessages) {
      return
    }
    
    const userUsername = getUserName()
    console.log('User username:', userUsername)
    
    if (!userUsername) {
      console.warn('No username set')
      return
    }
    
    const messagesRef = ref(database!, 'messages')
    const messagesQuery = query(messagesRef, orderByChild('timestamp'), limitToLast(100))
    
    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val()
      console.log('Firebase data received:', data)
      if (data) {
        const currentUser = getUserName() // Get fresh username on each update
        const messagesList = Object.entries(data).map(([id, msg]: [string, any]) => ({
          id,
          text: msg.text,
          username: msg.username || 'Anonymous',
          timestamp: new Date(msg.timestamp),
          isUser: msg.username && currentUser && msg.username === currentUser,
          imageUrl: msg.imageUrl
        }))
        console.log('Messages list:', messagesList)
        console.log('Current user:', currentUser)
        setMessages(messagesList)
      } else {
        setMessages([])
      }
    }, (error) => {
      console.error('Firebase read error:', error)
    })
    
    return () => unsubscribe()
  }, [showMessages])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load comments for current video from Firebase
  useEffect(() => {
    if (!database || !showComments || !currentVideoComments) {
      return
    }

    try {
      const commentsRef = ref(database!, `comments/video_${currentVideoComments}`)
      const commentsQuery = query(commentsRef, orderByChild('timestamp'))
      
      const unsubscribe = onValue(commentsQuery, (snapshot) => {
        try {
          const data = snapshot.val()
          if (data && typeof data === 'object') {
            // First, parse all comments with their parent IDs
            const allComments = Object.entries(data).map(([id, comment]: [string, any]) => {
              const numericId = parseInt(id.replace(/[^0-9]/g, '').slice(-10), 10) || Math.floor(Math.random() * 1000000000)
              
              return {
                id: numericId,
                firebaseId: id,
                username: comment.username || 'Anonymous',
                avatar: comment.avatar || '',
                text: comment.text || '',
                likes: typeof comment.likes === 'number' ? comment.likes : 0,
                timestamp: comment.timestamp ? new Date(comment.timestamp) : new Date(),
                parentId: comment.parentId || undefined,
                replies: []
              }
            })
            
            // Organize into threaded structure
            const commentMap = new Map<string, Comment>()
            const topLevelComments: Comment[] = []
            
            // First pass: add all comments to map
            allComments.forEach(comment => {
              commentMap.set(comment.firebaseId, comment)
            })
            
            // Second pass: organize into threads
            allComments.forEach(comment => {
              if (comment.parentId && commentMap.has(comment.parentId)) {
                // This is a reply, add to parent's replies
                const parent = commentMap.get(comment.parentId)!
                if (!parent.replies) parent.replies = []
                parent.replies.push(comment)
              } else {
                // This is a top-level comment
                topLevelComments.push(comment)
              }
            })
            
            setVideoComments(prev => ({
              ...prev,
              [currentVideoComments]: topLevelComments
            }))

            // Update liked comments state based on current user's likes
            const currentUser = getUserName()
            if (currentUser) {
              const userLikedComments = new Set<number>()
              allComments.forEach(comment => {
                const commentData = data[comment.firebaseId]
                const likedBy = commentData.likedBy || []
                if (likedBy.includes(currentUser)) {
                  userLikedComments.add(comment.id)
                }
              })
              setLikedComments(userLikedComments)
            }
          } else {
            // No comments yet for this video
            setVideoComments(prev => ({
              ...prev,
              [currentVideoComments]: []
            }))
            // Clear liked comments state when no comments
            setLikedComments(new Set())
          }
        } catch (parseError) {
          console.error('Error parsing comments:', parseError)
          setVideoComments(prev => ({
            ...prev,
            [currentVideoComments]: []
          }))
          // Clear liked comments state on error
          setLikedComments(new Set())
        }
      }, (error) => {
        console.error('Firebase comments read error:', error)
        // Set empty array on error so UI still shows
        setVideoComments(prev => ({
          ...prev,
          [currentVideoComments]: []
        }))
        // Clear liked comments state on error
        setLikedComments(new Set())
      })
      
      return () => {
        try {
          unsubscribe()
        } catch (e) {
          console.error('Error unsubscribing from comments:', e)
        }
      }
    } catch (error) {
      console.error('Error setting up comments listener:', error)
    }
  }, [showComments, currentVideoComments])

  return (
    <div className="app-container">
      {/* Animated grain overlay for gradient banding fix */}
      <Grain opacity={0.03} blendMode="screen" />
      
      <div 
        className="iphone-frame"
        style={{
          filter: `
            drop-shadow(0 0 60px rgba(${glowColor}, 0.38))
            drop-shadow(0 0 100px rgba(${glowColor}, 0.29))
            drop-shadow(0 0 140px rgba(${glowColor}, 0.19))
            drop-shadow(0 0 200px rgba(${glowColor}, 0.14))
          `
        }}
      >
        {/* Side Buttons */}
        <div className="volume-button"></div>
        <div className="power-button"></div>
        
        <div className="side">
          <div className="line"></div>
          
          {/* Notch with sensors */}
          <div className="header">
            <div className="sensor-1"></div>
            <div className="sensor-2"></div>
          </div>
          
          {/* Screen Content */}
          <div 
            className="iphone-screen" 
            ref={screenRef}
          >
          {!showMessages ? (
            <>
          {/* TikTok Status Bar */}
          <div className="status-bar">
            <span className="time">7:08</span>
            <div className="status-icons">
              {/* Cellular Signal */}
              <img src={cellularIcon} alt="cellular" className="status-icon" />
              {/* WiFi */}
              <img src={wifiIcon} alt="wifi" className="status-icon" />
              {/* Battery */}
              <img src={batteryIcon} alt="battery" className="status-icon" />
            </div>
          </div>

          {/* Top Navigation */}
          <div className="top-nav">
            <button className="nav-item">Following</button>
            <button className="nav-item active">For You</button>
          </div>

          {/* Scrollable Video Feed */}
          <div className="video-feed" ref={scrollContainerRef}>
            {circularVideos.map((video, index) => (
              <div key={`${video.id}-${index}`} className="video-container">
                <video 
                  className={`video-player ${pausedVideos.has(video.id) ? 'paused' : ''}`}
                  src={video.videoUrl}
                  loop
                  playsInline
                  preload="auto"
                  crossOrigin="anonymous"
                  onClick={(e) => toggleVideoPlayPause(e, video.id)}
                />
                
                {/* Play Button Overlay */}
                {pausedVideos.has(video.id) && (
                  <div className="play-button-overlay">
                    <svg viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                )}
                
                {/* Right Side Actions */}
                <div className="side-actions">
                  <div className="action-button avatar-section">
                    <img src={video.avatarUrl} alt={video.username} className="avatar" />
                    <div className="plus-button">+</div>
                  </div>
                  <div 
                    className={`action-button like-button ${likedVideos.has(video.id) ? 'liked' : ''}`}
                    onClick={() => toggleLike(video.id)}
                  >
                    <svg className="action-icon" viewBox="0 0 48 48" fill={likedVideos.has(video.id) ? '#fe2c55' : 'white'}>
                      <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                    </svg>
                    <span className="count">{formatCount(video.likes)}</span>
                  </div>
                  <div className="action-button" onClick={() => openComments(video.id)}>
                    <img src={commentsIcon} alt="Comments" className="action-icon-img comments-icon" />
                    <span className="count">{formatCount(video.comments)}</span>
                  </div>
                  <div className="action-button">
                    <svg className="action-icon" viewBox="0 0 48 48" fill="white">
                      <path d="M38 4H10v40l14-10 14 10V4z" stroke="white" strokeWidth="2.5" fill="white"/>
                    </svg>
                    <span className="count">{formatCount(video.bookmarks)}</span>
                  </div>
                  <div className="action-button" onClick={() => toggleVolume(video.id)}>
                    <svg className="action-icon" viewBox="0 0 48 48" fill="white">
                      {/* Speaker cone */}
                      <path d="M6 16h8l10-10v36L14 32H6V16z"/>
                      {/* Sound waves */}
                      {!mutedVideos.has(video.id) && (
                        <>
                          <path d="M28 18c2 2 2 10 0 12" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                          <path d="M32 14c4 4 4 16 0 20" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                          <path d="M36 10c6 6 6 22 0 28" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                        </>
                      )}
                      {/* Mute slash */}
                      {mutedVideos.has(video.id) && (
                        <path d="M8 40L40 8" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      )}
                    </svg>
                  </div>
                  <div className="action-button">
                    <img src={forwardIcon} alt="Forward" className="action-icon-img" />
                    <span className="count">{formatCount(video.shares)}</span>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="video-info">
                  <div className="username">{video.username}</div>
                  <div className="caption">{video.caption}</div>
                  <div className="audio-info">
                    <span>🎵 Original Audio - {video.username}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Dock - Hidden when comments open */}
          {!showComments && (
            <div className="dock">
              <a href="https://pump.fun/coin/21dCU5jcTDTdqohD5XjXGxEibEm7QpjJe24FkBAPpump" target="_blank" rel="noopener noreferrer" className="dock-app">
                <div className="app-icon">
                  <img src={pumpfunIcon} alt="Pumpfun" className="app-icon-img" />
                </div>
              </a>
              <a href="https://www.tiktok.com/search?q=genuinely&t=1762812929391" target="_blank" rel="noopener noreferrer" className="dock-app">
                <div className="app-icon">
                  <img src={tiktokIcon} alt="TikTok" className="app-icon-img" />
                </div>
              </a>
              <a href="https://x.com/genuinelysol" target="_blank" rel="noopener noreferrer" className="dock-app">
                <div className="app-icon">
                  <img src={xIcon} alt="X" className="app-icon-img" />
                </div>
              </a>
              <div className="dock-app" onClick={openMessages}>
                <div className="app-icon">
                  <img src={messagesIcon} alt="Messages" className="app-icon-img" />
                </div>
              </div>
            </div>
          )}
          </>
          ) : (
            /* iMessage UI */
            <div className="imessage-container">
              {/* Messages Header */}
              <div className="imessage-header">
                <button className="back-button" onClick={() => setShowMessages(false)}>
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                    <path d="M10 2L2 10L10 18" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="chat-info">
                  <div className="chat-name">genuinely chat</div>
                  <div className="chat-members">{messages.length} messages</div>
                </div>
                <div className="header-spacer"></div>
              </div>

              {/* Messages List */}
              <div className="messages-list">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message-wrapper ${msg.isUser ? 'user' : 'other'}`}>
                    {!msg.isUser && <div className="message-sender">{msg.username}</div>}
                    <div className={`message-bubble ${msg.isUser ? 'user' : 'other'}`}>
                      {msg.imageUrl && (
                        <img 
                          src={msg.imageUrl} 
                          alt="Shared image" 
                          className="message-image"
                          loading="lazy"
                        />
                      )}
                      {msg.text && <div className="message-text">{msg.text}</div>}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                <div className="input-wrapper">
                  {/* Image Upload Button */}
                  <label className="image-upload-button" title="Upload image">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      disabled={uploadingImage}
                      style={{ display: 'none' }}
                    />
                    {uploadingImage ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" opacity="0.25"/>
                        <path d="M12 2 A10 10 0 0 1 22 12" strokeLinecap="round">
                          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                        </path>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    )}
                  </label>
                  
                  <input
                    type="text"
                    className="message-input"
                    placeholder="iMessage"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !uploadingImage) sendMessage()
                    }}
                    disabled={uploadingImage}
                  />
                  <button 
                    className="send-button" 
                    onClick={sendMessage}
                    disabled={!messageInput.trim() || uploadingImage}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M2 12L22 2L16 22L11 13L2 12Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Username Setup Modal */}
          {showUsernameSetup && (
            <div className="username-modal-overlay">
              <div className="username-modal">
                <h2>Welcome to Genuinely</h2>
                <p>Choose your username to get started</p>
                <input
                  type="text"
                  className="username-input"
                  placeholder="Enter username..."
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && usernameInput.trim()) setUsername()
                  }}
                  autoFocus
                  maxLength={20}
                />
                <div className="username-modal-buttons">
                  <button 
                    className="username-submit-btn username-submit-full"
                    onClick={setUsername}
                    disabled={!usernameInput.trim()}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Comments Overlay */}
          {showComments && currentVideoComments && (
            <div className="comments-overlay">
              <div className="comments-container">
                {/* Header */}
                <div className="comments-header">
                  <span className="comments-count">
                    {videoComments[currentVideoComments]?.length || 0} comments
                  </span>
                  <button className="comments-close" onClick={closeComments}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>

                {/* Comments List */}
                <div className="comments-list">
                  {(!videoComments[currentVideoComments] || videoComments[currentVideoComments].length === 0) ? (
                    <div className="comments-empty">
                      <p>No comments yet</p>
                      <span>Be the first to comment!</span>
                    </div>
                  ) : (
                    videoComments[currentVideoComments].map((comment) => (
                      <div key={`thread-${comment.firebaseId}`} className="comment-thread">
                        {renderCommentContent(comment)}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="comment-replies">
                            {renderRepliesFlat(comment.replies)}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Input */}
                <div className="comment-input-container">
                  {replyingTo && (
                    <div className="replying-to">
                      Replying to {replyingTo.username}
                      <button onClick={() => setReplyingTo(null)}>✕</button>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <input
                      ref={commentInputRef}
                      type="text"
                      className="comment-input"
                      placeholder={replyingTo ? `Reply to ${replyingTo.username}...` : "Add comment..."}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && commentInput.trim()) postComment()
                      }}
                    />
                    <button 
                      className="comment-post-btn" 
                      disabled={!commentInput.trim()}
                      onClick={postComment}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

export default App

